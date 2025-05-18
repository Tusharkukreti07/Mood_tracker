// Calendar View JavaScript

// Current date
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// Mock mood data from January 2025 to today
const moodData = {};
const moods = ["great", "good", "neutral", "bad", "awful"];
const moodEmojis = {
    "great": "😁",
    "good": "😊",
    "neutral": "😐",
    "bad": "😔",
    "awful": "😢"
};

// Generate mood data from January 1, 2025 to today
const startDate = new Date(2025, 0, 1); // January 1, 2025
const endDate = new Date(); // Today

// Pattern seed for realistic but random-looking data
// People tend to have mood patterns, not completely random moods
const patterns = [
    // Mostly good mood pattern
    [0.4, 0.4, 0.1, 0.05, 0.05],
    // Mixed mood pattern
    [0.2, 0.3, 0.3, 0.1, 0.1],
    // Downward trend pattern
    [0.1, 0.2, 0.3, 0.3, 0.1],
    // Upward trend pattern
    [0.3, 0.3, 0.2, 0.1, 0.1]
];

// Choose a pattern every 2-3 weeks
let currentPattern = 0;
let patternDaysLeft = Math.floor(Math.random() * 7) + 14; // 14-21 days

// Populate mock data
for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Change pattern periodically
    if (patternDaysLeft <= 0) {
        currentPattern = Math.floor(Math.random() * patterns.length);
        patternDaysLeft = Math.floor(Math.random() * 7) + 14; // 14-21 days
    }
    patternDaysLeft--;
    
    // Generate mood based on current pattern
    const rand = Math.random();
    let cumulativeProbability = 0;
    let selectedMood = 0;
    
    for (let i = 0; i < patterns[currentPattern].length; i++) {
        cumulativeProbability += patterns[currentPattern][i];
        if (rand <= cumulativeProbability) {
            selectedMood = i;
            break;
        }
    }
    
    // Weekend boost - tend to be a bit happier on weekends
    if (d.getDay() === 0 || d.getDay() === 6) {
        selectedMood = Math.max(0, selectedMood - 1); // Shift up by one mood level
    }
    
    // Add some randomness to make it realistic
    if (Math.random() < 0.2) { // 20% chance of mood shift
        selectedMood += Math.random() < 0.5 ? -1 : 1;
        selectedMood = Math.max(0, Math.min(4, selectedMood)); // Keep in range 0-4
    }
    
    const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    moodData[dateKey] = moods[selectedMood];
}

// Render calendar
function renderCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Update month and year display
    document.querySelector('.month-year').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Get the first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Get the last day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Clear previous calendar days
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('day', 'empty');
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
        const mood = moodData[dateKey];
        
        const dayEl = document.createElement('div');
        dayEl.classList.add('day');
        if (mood) {
            dayEl.setAttribute('data-mood', mood);
        } else {
            dayEl.setAttribute('data-mood', 'none');
        }
        
        const dayContent = document.createElement('div');
        dayContent.classList.add('day-content');
        
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
        dayContent.appendChild(dayNumber);
        
        const dayEmoji = document.createElement('div');
        dayEmoji.classList.add('day-emoji');
        dayEmoji.textContent = mood ? moodEmojis[mood] : "";
        dayContent.appendChild(dayEmoji);
        
        dayEl.appendChild(dayContent);
        
        // Check if this is today
        const currentDate = new Date(currentYear, currentMonth, day);
        if (
            currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        ) {
            dayEl.classList.add('active');
        }
        
        // Add click handler
        dayEl.addEventListener('click', function() {
            const selectedMood = document.querySelector('.mood-btn.selected')?.getAttribute('data-mood');
            if (selectedMood) {
                this.setAttribute('data-mood', selectedMood);
                const emojiEl = this.querySelector('.day-emoji');
                if (emojiEl) {
                    emojiEl.textContent = moodEmojis[selectedMood];
                }
                moodData[dateKey] = selectedMood;
                updateStats();
            }
        });
        
        calendarGrid.appendChild(dayEl);
    }
    
    // Update stats after rendering calendar
    updateStats();
}
