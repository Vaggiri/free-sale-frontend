// Main Application Controller
class App {
    constructor() {
        this.init();
    }
    
    init() {
        // App initialization
        console.log('CampusTrade app initialized');
        
        // Check if user is logged in on page load
        if (authManager.isLoggedIn && authManager.isLoggedIn()) {
            console.log('User is logged in:', authManager.getCurrentUser()?.name);
        }
        
        // Add any global event listeners or initialization code here
        this.setupGlobalListeners();
    }
    
    setupGlobalListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Page became visible, refresh data if needed
                this.refreshData();
            }
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            uiManager.showMessage('Connection restored', 'success');
            this.refreshData();
        });
        
        window.addEventListener('offline', () => {
            uiManager.showMessage('You are offline', 'error');
        });
    }
    
    refreshData() {
        // Refresh data based on current page
        if (uiManager.currentPage === 'find') {
            if (productManager && productManager.loadProducts) {
                productManager.loadProducts();
            }
        } else if (uiManager.currentPage === 'profile' && authManager.isLoggedIn && authManager.isLoggedIn()) {
            if (ProfileManager && ProfileManager.loadUserListings) {
                ProfileManager.loadUserListings();
            }
        }
    }
}
// Add this to your app.js or create a new mobile-events.js file

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced mobile menu functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mobileOverlay = document.createElement('div');
    
    // Create mobile overlay
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Close menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Enhanced image upload for mobile
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
        // Add touch feedback
        uploadArea.addEventListener('touchstart', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        uploadArea.addEventListener('touchend', function() {
            this.style.backgroundColor = '';
        });
    }

    console.log('📱 Mobile event listeners initialized');
});
// Initialize the app
const app = new App();