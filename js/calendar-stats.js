// Update stats
function updateStats() {
    // Calculate mood stats for current month
    const moodCounts = {
        "great": 0,
        "good": 0,
        "neutral": 0,
        "bad": 0,
        "awful": 0
    };
    
    let totalDaysTracked = 0;
    let positiveDays = 0;
    let streak = 0;
    let currentStreak = 0;
    
    // Loop through all days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
        const mood = moodData[dateKey];
        
        if (mood) {
            moodCounts[mood]++;
            totalDaysTracked++;
            
            if (mood === "great" || mood === "good") {
                positiveDays++;
            }
        }
    }
    
    // Calculate streak (consecutive days tracked)
    const checkDate = new Date();
    
    while (true) {
        const dateKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
        if (moodData[dateKey]) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    streak = currentStreak;
    
    // Find most common mood
    let mostCommonMood = "none";
    let maxCount = 0;
    
    for (const mood in moodCounts) {
        if (moodCounts[mood] > maxCount) {
            maxCount = moodCounts[mood];
            mostCommonMood = mood;
        }
    }
    
    // Update stats display
    document.getElementById('stat-month-mood').textContent = mostCommonMood.charAt(0).toUpperCase() + mostCommonMood.slice(1);
    document.getElementById('stat-streak').textContent = streak;
    document.getElementById('stat-percent-positive').textContent = totalDaysTracked > 0 ? Math.round((positiveDays / totalDaysTracked) * 100) + '%' : '0%';
}

// Initialize the calendar when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Init
    renderCalendar();
    
    // Event listeners for navigation
    document.querySelector('.prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    document.querySelector('.next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Event listeners for mood buttons
    document.querySelectorAll('.mood-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    // Back button functionality
    document.querySelector('.back-btn').addEventListener('click', function() {
        window.location.href = 'mood-tracker.html';
    });
});
