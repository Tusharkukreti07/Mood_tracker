// Enhanced Calendar View JavaScript

// Notes storage
const notesData = {};

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update icon
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
}

// Check for saved dark mode preference
function checkDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle').innerHTML = '☀️';
    }
}

// Notes modal functionality
function openNotesModal(date, dateKey) {
    const modal = document.querySelector('.notes-modal');
    const dateElement = document.querySelector('.notes-date');
    const textarea = document.querySelector('.notes-textarea');
    
    // Format date for display
    dateElement.textContent = date;
    
    // Load existing notes if any
    textarea.value = notesData[dateKey] || '';
    
    // Store current date key for saving
    modal.setAttribute('data-date-key', dateKey);
    
    // Show modal
    modal.classList.add('active');
}

function closeNotesModal() {
    const modal = document.querySelector('.notes-modal');
    modal.classList.remove('active');
}

function saveNotes() {
    const modal = document.querySelector('.notes-modal');
    const textarea = document.querySelector('.notes-textarea');
    const dateKey = modal.getAttribute('data-date-key');
    
    // Save notes
    notesData[dateKey] = textarea.value;
    
    // Update UI to show note indicator
    if (textarea.value.trim() !== '') {
        const dayEl = document.querySelector(`.day[data-date="${dateKey}"]`);
        if (dayEl) {
            dayEl.classList.add('has-notes');
        }
    } else {
        const dayEl = document.querySelector(`.day[data-date="${dateKey}"]`);
        if (dayEl) {
            dayEl.classList.remove('has-notes');
        }
    }
    
    // Close modal
    closeNotesModal();
    
    // Save to localStorage
    localStorage.setItem('moodNotes', JSON.stringify(notesData));
}

// Load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('moodNotes');
    if (savedNotes) {
        Object.assign(notesData, JSON.parse(savedNotes));
    }
}

// Share functionality
function shareMoodData() {
    // Count moods for the current month
    const moodCounts = {
        "great": 0,
        "good": 0,
        "neutral": 0,
        "bad": 0,
        "awful": 0
    };
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Count moods for current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
        const mood = moodData[dateKey];
        if (mood) {
            moodCounts[mood]++;
        }
    }
    
    // Create share text
    const shareText = `My Mood Summary for ${monthNames[currentMonth]} ${currentYear}:\n\n` +
        `😁 Great: ${moodCounts.great} days\n` +
        `😊 Good: ${moodCounts.good} days\n` +
        `😐 Neutral: ${moodCounts.neutral} days\n` +
        `😔 Bad: ${moodCounts.bad} days\n` +
        `😢 Awful: ${moodCounts.awful} days\n\n` +
        `Tracked with Mood Tracker App`;
    
    // Use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: `Mood Summary - ${monthNames[currentMonth]} ${currentYear}`,
            text: shareText
        }).catch(err => {
            console.error('Error sharing:', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// Fallback share method
function fallbackShare(text) {
    // Create a temporary textarea to copy text
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    alert('Summary copied to clipboard! You can now paste it wherever you want to share.');
}

// Create mood summary chart
function createMoodSummaryChart() {
    // Count moods for the current month
    const moodCounts = {
        "great": 0,
        "good": 0,
        "neutral": 0,
        "bad": 0,
        "awful": 0
    };
    
    // Count moods for current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
        const mood = moodData[dateKey];
        if (mood) {
            moodCounts[mood]++;
        }
    }
    
    // Get the canvas element
    const canvas = document.getElementById('mood-chart');
    const ctx = canvas.getContext('2d');
    
    // Clear previous chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 250;
    
    // Chart dimensions
    const chartWidth = canvas.width * 0.8;
    const chartHeight = canvas.height * 0.7;
    const barWidth = chartWidth / 5 * 0.7;
    const spacing = chartWidth / 5 * 0.3;
    const startX = (canvas.width - chartWidth) / 2;
    const startY = canvas.height * 0.1;
    
    // Find maximum value for scaling
    const maxValue = Math.max(...Object.values(moodCounts), 1);
    
    // Colors for each mood
    const colors = {
        "great": getComputedStyle(document.documentElement).getPropertyValue('--mood-great').trim(),
        "good": getComputedStyle(document.documentElement).getPropertyValue('--mood-good').trim(),
        "neutral": getComputedStyle(document.documentElement).getPropertyValue('--mood-neutral').trim(),
        "bad": getComputedStyle(document.documentElement).getPropertyValue('--mood-bad').trim(),
        "awful": getComputedStyle(document.documentElement).getPropertyValue('--mood-awful').trim()
    };
    
    // Draw bars
    let index = 0;
    for (const mood in moodCounts) {
        const value = moodCounts[mood];
        const barHeight = (value / maxValue) * chartHeight;
        const x = startX + index * (barWidth + spacing);
        const y = startY + chartHeight - barHeight;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, colors[mood]);
        gradient.addColorStop(1, adjustColor(colors[mood], -30));
        
        // Draw bar
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 10);
        ctx.fill();
        
        // Draw value on top of bar
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, y - 10);
        
        // Draw mood label
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim();
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        
        // Emoji for mood
        const moodEmojis = {
            "great": "😁",
            "good": "😊",
            "neutral": "😐",
            "bad": "😔",
            "awful": "😢"
        };
        
        ctx.fillText(moodEmojis[mood], x + barWidth / 2, startY + chartHeight + 25);
        ctx.fillText(mood.charAt(0).toUpperCase() + mood.slice(1), x + barWidth / 2, startY + chartHeight + 45);
        
        index++;
    }
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

// Update the renderCalendar function to include notes indicators
function updateRenderCalendar() {
    const originalRenderCalendar = window.renderCalendar;
    
    window.renderCalendar = function() {
        originalRenderCalendar();
        
        // Add date attributes and notes indicators
        const calendarGrid = document.getElementById('calendar-grid');
        const days = calendarGrid.querySelectorAll('.day:not(.empty)');
        
        days.forEach((dayEl, index) => {
            const day = index + 1;
            const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
            
            // Add date attribute
            dayEl.setAttribute('data-date', dateKey);
            
            // Add notes indicator if needed
            if (notesData[dateKey] && notesData[dateKey].trim() !== '') {
                dayEl.classList.add('has-notes');
            }
            
            // Add double-click event for notes
            dayEl.addEventListener('dblclick', function() {
                const date = `${currentYear}-${currentMonth + 1}-${day}`;
                const formattedDate = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                openNotesModal(formattedDate, date);
            });
        });
        
        // Update mood summary chart
        createMoodSummaryChart();
    };
}
