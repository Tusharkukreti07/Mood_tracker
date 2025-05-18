// Shared JavaScript for Professional UI

// Global variables
const APP_NAME = 'Mood Tracker';
const APP_VERSION = '1.0.0';
let isDarkMode = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initThemeToggle();
    initNavigation();
    initModals();
    initTooltips();
    initDropdowns();
    
    // Show page content after loading
    setTimeout(() => {
        document.querySelector('.loading-overlay')?.classList.remove('active');
        document.querySelector('main')?.classList.add('animate-fade-in');
    }, 300);
});

// Initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '☀️';
        isDarkMode = true;
    }
    
    // Toggle dark mode
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        this.innerHTML = isDarkMode ? '☀️' : '🌙';
        
        // Dispatch event for other components to react
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDarkMode } }));
    });
}

// Initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;
    
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        
        // Add transition effect when navigating
        link.addEventListener('click', function(e) {
            // Only for internal links
            if (this.getAttribute('href').startsWith('#')) return;
            
            e.preventDefault();
            const target = this.getAttribute('href');
            
            // Show loading overlay
            const loadingOverlay = document.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
            }
            
            // Animate current page out
            document.querySelector('main').classList.add('animate-fade-out');
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = target;
            }, 300);
        });
    });
}

// Initialize modals
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    if (!modalTriggers.length) return;
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            openModal(modal);
        });
    });
    
    // Close modal when clicking outside content
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
            closeModal(e.target);
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close, [data-close-modal]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
}

// Open modal
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Initialize tooltips
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    if (!tooltipTriggers.length) return;
    
    tooltipTriggers.forEach(trigger => {
        const tooltipText = trigger.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        trigger.addEventListener('mouseenter', function() {
            document.body.appendChild(tooltip);
            const rect = this.getBoundingClientRect();
            
            tooltip.style.position = 'absolute';
            tooltip.style.top = `${rect.bottom + 10}px`;
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.backgroundColor = 'var(--bg-dark)';
            tooltip.style.color = 'var(--text-white)';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '14px';
            tooltip.style.zIndex = '1000';
            tooltip.style.boxShadow = 'var(--shadow-md)';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
        });
        
        trigger.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            }
        });
    });
}

// Initialize dropdowns
function initDropdowns() {
    const dropdownTriggers = document.querySelectorAll('[data-dropdown]');
    if (!dropdownTriggers.length) return;
    
    dropdownTriggers.forEach(trigger => {
        const dropdownId = trigger.getAttribute('data-dropdown');
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close other open dropdowns
            document.querySelectorAll('.dropdown.active').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });
            
            dropdown.classList.toggle('active');
            
            // Position dropdown
            const rect = this.getBoundingClientRect();
            dropdown.style.position = 'absolute';
            dropdown.style.top = `${rect.bottom + 10}px`;
            dropdown.style.left = `${rect.left}px`;
            dropdown.style.minWidth = `${rect.width}px`;
            dropdown.style.zIndex = '100';
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✅';
            break;
        case 'error':
            icon = '❌';
            break;
        case 'warning':
            icon = '⚠️';
            break;
        default:
            icon = 'ℹ️';
    }
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
    `;
    
    // Style notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--bg-card)';
    notification.style.color = 'var(--text-dark)';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = 'var(--radius-md)';
    notification.style.boxShadow = 'var(--shadow-lg)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateY(20px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    // Add border based on type
    switch (type) {
        case 'success':
            notification.style.borderLeft = '4px solid var(--happy)';
            break;
        case 'error':
            notification.style.borderLeft = '4px solid var(--sad)';
            break;
        case 'warning':
            notification.style.borderLeft = '4px solid var(--accent)';
            break;
        default:
            notification.style.borderLeft = '4px solid var(--primary)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Format date
function formatDate(date, format = 'full') {
    const d = new Date(date);
    
    switch (format) {
        case 'short':
            return d.toLocaleDateString();
        case 'time':
            return d.toLocaleTimeString();
        case 'datetime':
            return d.toLocaleString();
        case 'relative':
            return getRelativeTimeString(d);
        default:
            return d.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
    }
}

// Get relative time string
function getRelativeTimeString(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) {
        return 'just now';
    } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
        return formatDate(date, 'short');
    }
}
