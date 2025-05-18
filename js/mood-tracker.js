// Mood Tracker JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mood selector functionality
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
    
    // Floating button effect
    const floatingBtn = document.querySelector('.floating-btn');
    
    floatingBtn.addEventListener('click', function() {
        this.style.transform = 'scale(1.2) rotate(45deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(45deg)';
        }, 200);
        
        // Create notification effect
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '100px';
        notification.style.right = '30px';
        notification.style.backgroundColor = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        notification.style.color = '#1e293b';
        notification.style.fontWeight = '600';
        notification.style.zIndex = '99';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease-out';
        notification.textContent = 'New mood entry added!';
        
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
            }, 300);
        }, 3000);
    });
});
