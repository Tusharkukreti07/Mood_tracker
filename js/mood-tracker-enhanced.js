// Enhanced Mood Tracker JavaScript

// Store mood data
let moodData = {};
let notesData = {};
let customMoods = [];

// Default moods
const defaultMoods = [
    { name: "Sad", emoji: "😔", color: "#ef4444" },
    { name: "Happy", emoji: "😊", color: "#f59e0b" },
    { name: "Neutral", emoji: "😐", color: "#60a5fa" },
    { name: "Very Happy", emoji: "😄", color: "#10b981" },
    { name: "Calm", emoji: "😌", color: "#a78bfa" }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadMoodData();
    loadNotes();
    loadCustomMoods();
    
    // Update date display
    updateDateDisplay();
    
    // Set up dark mode toggle
    setupDarkMode();
    
    // Set up mood selector functionality
    setupMoodSelector();
    
    // Set up floating button
    setupFloatingButton();
    
    // Set up notes feature
    setupNotesFeature();
    
    // Set up custom mood feature
    setupCustomMoodFeature();
    
    // Generate mood history timeline
    generateMoodHistory();
});

// Update date display
function updateDateDisplay() {
    const dateElement = document.querySelector('.welcome small');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Set up dark mode toggle
function setupDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '☀️';
    }
    
    // Toggle dark mode
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        this.innerHTML = isDarkMode ? '☀️' : '🌙';
    });
}

// Set up mood selector functionality
function setupMoodSelector() {
    const moodOptions = document.querySelectorAll('.mood-option');
    const moodValue = document.querySelector('.mood-value');
    const emojiDisplay = document.querySelector('.emoji div');
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update mood value and emoji
            const moodName = this.querySelector('.mood-name').textContent;
            const moodEmoji = this.querySelector('.mood-emoji').textContent;
            
            moodValue.textContent = moodName;
            emojiDisplay.textContent = moodEmoji;
            
            // Add animation effect
            moodValue.style.animation = 'none';
            setTimeout(() => {
                moodValue.style.animation = 'fadeIn 0.5s ease-out';
            }, 10);
            
            emojiDisplay.style.animation = 'none';
            setTimeout(() => {
                emojiDisplay.style.animation = 'bounce 2s infinite alternate';
            }, 10);
        });
    });
}

// Set up floating button
function setupFloatingButton() {
    const floatingBtn = document.querySelector('.floating-btn');
    
    floatingBtn.addEventListener('click', function() {
        // Animation effect
        this.style.transform = 'scale(1.2) rotate(45deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(45deg)';
        }, 200);
        
        // Save current mood
        saveMoodEntry();
        
        // Show notification
        showNotification('New mood entry added!');
        
        // Update mood history
        generateMoodHistory();
    });
}

// Save mood entry
function saveMoodEntry() {
    const selectedMood = document.querySelector('.mood-option.selected');
    const moodName = selectedMood.querySelector('.mood-name').textContent;
    const moodEmoji = selectedMood.querySelector('.mood-emoji').textContent;
    
    // Get current date as key
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    
    // Save mood data
    moodData[dateKey] = {
        mood: moodName,
        emoji: moodEmoji,
        timestamp: now.getTime()
    };
    
    // Save to localStorage
    localStorage.setItem('moodData', JSON.stringify(moodData));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '100px';
    notification.style.right = '30px';
    notification.style.backgroundColor = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    notification.style.color = '#1e293b';
    notification.style.fontWeight = '600';
    notification.style.zIndex = '99';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    notification.textContent = message;
    
    // Add emoji based on message
    if (message.includes('mood')) {
        notification.textContent = '🎉 ' + message;
    } else if (message.includes('note')) {
        notification.textContent = '📝 ' + message;
    } else if (message.includes('custom')) {
        notification.textContent = '✨ ' + message;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 3000);
}

// Set up notes feature
function setupNotesFeature() {
    // Add notes button to reflection section
    const reflectionTitle = document.querySelector('.reflection-title');
    const addNotesBtn = document.createElement('button');
    addNotesBtn.className = 'add-notes-btn';
    addNotesBtn.innerHTML = '📝';
    addNotesBtn.title = 'Add Notes';
    addNotesBtn.style.marginLeft = 'auto';
    addNotesBtn.style.background = 'none';
    addNotesBtn.style.border = 'none';
    addNotesBtn.style.fontSize = '1.2rem';
    addNotesBtn.style.cursor = 'pointer';
    addNotesBtn.style.transition = 'transform 0.3s ease';
    
    addNotesBtn.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.2)';
    });
    
    addNotesBtn.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
    
    addNotesBtn.addEventListener('click', openNotesModal);
    
    reflectionTitle.appendChild(addNotesBtn);
}

// Open notes modal
function openNotesModal() {
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const modal = document.querySelector('.notes-modal');
    const dateElement = document.querySelector('.notes-date');
    const textarea = document.querySelector('.notes-textarea');
    
    // Format date for display
    dateElement.textContent = formattedDate;
    
    // Load existing notes if any
    textarea.value = notesData[dateKey] || '';
    
    // Store current date key for saving
    modal.setAttribute('data-date-key', dateKey);
    
    // Show modal
    modal.classList.add('active');
}

// Close notes modal
function closeNotesModal() {
    const modal = document.querySelector('.notes-modal');
    modal.classList.remove('active');
}

// Save notes
function saveNotes() {
    const modal = document.querySelector('.notes-modal');
    const textarea = document.querySelector('.notes-textarea');
    const dateKey = modal.getAttribute('data-date-key');
    
    // Save notes
    notesData[dateKey] = textarea.value;
    
    // Update reflection content
    if (textarea.value.trim() !== '') {
        document.querySelector('.reflection-content').textContent = textarea.value;
        
        // Add tags if they exist
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags';
        
        // Extract hashtags from text
        const hashtags = textarea.value.match(/#\w+/g);
        if (hashtags) {
            hashtags.forEach(tag => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
            document.querySelector('.reflection-content').appendChild(tagsContainer);
        }
    }
    
    // Close modal
    closeNotesModal();
    
    // Save to localStorage
    localStorage.setItem('notesData', JSON.stringify(notesData));
    
    // Show notification
    showNotification('Notes saved successfully!');
}

// Load mood data from localStorage
function loadMoodData() {
    const savedMoodData = localStorage.getItem('moodData');
    if (savedMoodData) {
        moodData = JSON.parse(savedMoodData);
    }
}

// Load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('notesData');
    if (savedNotes) {
        notesData = JSON.parse(savedNotes);
        
        // Update reflection content with today's note if it exists
        const now = new Date();
        const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        
        if (notesData[todayKey]) {
            document.querySelector('.reflection-content').textContent = notesData[todayKey];
            
            // Add tags if they exist
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'tags';
            
            // Extract hashtags from text
            const hashtags = notesData[todayKey].match(/#\w+/g);
            if (hashtags) {
                hashtags.forEach(tag => {
                    const tagElement = document.createElement('div');
                    tagElement.className = 'tag';
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
                document.querySelector('.reflection-content').appendChild(tagsContainer);
            }
        }
    }
}

// Set up custom mood feature
function setupCustomMoodFeature() {
    // Add custom mood button to mood selector
    const moodSelector = document.querySelector('.mood-selector');
    const addCustomMoodBtn = document.createElement('div');
    addCustomMoodBtn.className = 'mood-option add-custom';
    addCustomMoodBtn.innerHTML = `
        <div class="mood-emoji" style="background: linear-gradient(135deg, #d1d5db, #9ca3af);">+</div>
        <div class="mood-name">Custom</div>
    `;
    
    addCustomMoodBtn.addEventListener('click', openCustomMoodModal);
    
    moodSelector.appendChild(addCustomMoodBtn);
}

// Open custom mood modal
function openCustomMoodModal() {
    const modal = document.querySelector('.custom-mood-modal');
    modal.classList.add('active');
}

// Close custom mood modal
function closeCustomMoodModal() {
    const modal = document.querySelector('.custom-mood-modal');
    modal.classList.remove('active');
}

// Save custom mood
function saveCustomMood() {
    const nameInput = document.querySelector('#custom-mood-name');
    const selectedEmoji = document.querySelector('.emoji-option.selected');
    const colorInput = document.querySelector('#custom-mood-color');
    
    if (!nameInput.value || !selectedEmoji) {
        alert('Please provide a name and select an emoji');
        return;
    }
    
    const newMood = {
        name: nameInput.value,
        emoji: selectedEmoji.textContent,
        color: colorInput.value
    };
    
    // Add to custom moods array
    customMoods.push(newMood);
    
    // Save to localStorage
    localStorage.setItem('customMoods', JSON.stringify(customMoods));
    
    // Add to mood selector
    addCustomMoodToSelector(newMood);
    
    // Close modal
    closeCustomMoodModal();
    
    // Show notification
    showNotification('Custom mood added!');
}

// Add custom mood to selector
function addCustomMoodToSelector(mood) {
    const moodSelector = document.querySelector('.mood-selector');
    const addCustomBtn = document.querySelector('.add-custom');
    
    const newMoodOption = document.createElement('div');
    newMoodOption.className = 'mood-option';
    newMoodOption.innerHTML = `
        <div class="mood-emoji" style="background: linear-gradient(135deg, ${mood.color}, ${adjustColor(mood.color, 20)});">${mood.emoji}</div>
        <div class="mood-name">${mood.name}</div>
    `;
    
    // Add click event
    newMoodOption.addEventListener('click', function() {
        const moodOptions = document.querySelectorAll('.mood-option');
        moodOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        const moodName = this.querySelector('.mood-name').textContent;
        const moodEmoji = this.querySelector('.mood-emoji').textContent;
        
        document.querySelector('.mood-value').textContent = moodName;
        document.querySelector('.emoji div').textContent = moodEmoji;
    });
    
    // Insert before the add custom button
    moodSelector.insertBefore(newMoodOption, addCustomBtn);
}

// Load custom moods from localStorage
function loadCustomMoods() {
    const savedCustomMoods = localStorage.getItem('customMoods');
    if (savedCustomMoods) {
        customMoods = JSON.parse(savedCustomMoods);
        
        // Add each custom mood to selector
        customMoods.forEach(mood => {
            addCustomMoodToSelector(mood);
        });
    }
}

// Generate mood history timeline
function generateMoodHistory() {
    const container = document.querySelector('.mood-history .timeline-container');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Get sorted entries (most recent first)
    const entries = Object.entries(moodData)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5); // Show only the 5 most recent entries
    
    if (entries.length === 0) {
        container.innerHTML = '<p class="no-data">No mood entries yet. Start tracking your mood!</p>';
        return;
    }
    
    // Create timeline items
    entries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">${formattedDate}</div>
                <div class="timeline-mood">
                    <span class="timeline-emoji">${entry.emoji}</span>
                    ${entry.mood}
                </div>
            </div>
        `;
        
        container.appendChild(timelineItem);
    });
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
    // Remove # if present
    color = color.replace('#', '');
    
    // Parse the color
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    // Adjust the color
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
