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

// Initialize the app
const app = new App();