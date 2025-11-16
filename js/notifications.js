// Notifications Manager with Better Permission Handling
class NotificationsManager {
    constructor() {
        this.socket = null;
        this.notificationCount = 0;
        this.permissionStatus = 'default';
        this.init();
    }
    
    init() {
        this.checkNotificationPermission();
        this.setupEventListeners();
        this.setupNotificationUI();
    }
    
    checkNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('🔕 Browser does not support notifications');
            this.permissionStatus = 'unsupported';
            return;
        }
        
        this.permissionStatus = Notification.permission;
        console.log('🔔 Notification permission status:', this.permissionStatus);
        
        // If permission was previously denied, don't ask again
        if (this.permissionStatus === 'denied') {
            console.log('🔕 Notifications blocked by user');
        }
    }
    
    setupEventListeners() {
        // Initialize socket when user logs in
        if (authManager.isLoggedIn()) {
            this.initializeSocket();
        }
        
        // Listen for auth changes
        const originalLogout = authManager.logout;
        authManager.logout = () => {
            this.disconnectSocket();
            originalLogout.call(authManager);
        };
        
        // Re-initialize when user logs in
        const originalLogin = authManager.handleLogin;
        authManager.handleLogin = async function() {
            await originalLogin.apply(this, arguments);
            if (authManager.isLoggedIn()) {
                notificationsManager.initializeSocket();
            }
        };
    }
    
    initializeSocket() {
        if (this.socket) {
            console.log('🔌 Socket already initialized');
            return;
        }
        
        try {
            this.socket = io('http://localhost:5000', {
                transports: ['websocket', 'polling'],
                timeout: 10000
            });
            
            this.socket.on('connect', () => {
                console.log('🔌 Connected to notifications server');
                
                // Join user room
                const user = authManager.getCurrentUser();
                if (user && user._id) {
                    this.socket.emit('join-user', user._id);
                }
                
                // Join college room
                if (user && user.college) {
                    this.socket.emit('join-college', user.college);
                }
            });
            
            this.socket.on('new-product', (data) => {
                console.log('🔔 New product notification:', data);
                this.showNotification(data);
            });
            
            this.socket.on('disconnect', (reason) => {
                console.log('🔌 Disconnected from notifications server:', reason);
            });
            
            this.socket.on('connect_error', (error) => {
                console.error('🔌 Socket connection error:', error);
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize socket:', error);
        }
    }
    
    disconnectSocket() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('🔌 Socket disconnected');
        }
    }
    
    setupNotificationUI() {
        // Create notification bell in navbar (only if not already exists)
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.getElementById('notification-bell')) {
            const notificationHTML = `
                <div id="notification-container" style="position: relative;">
                    <div id="notification-bell" style="position: relative; cursor: pointer; padding: 0.5rem; margin-left: 1rem; border-radius: 50%; transition: background-color 0.2s;">
                        <i class="fas fa-bell" style="font-size: 1.2rem; color: #4361ee;"></i>
                        <span id="notification-count" 
                              style="position: absolute; top: 0px; right: 0px; background: #dc3545; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: none; align-items: center; justify-content: center; font-weight: bold;">
                        </span>
                    </div>
                    <div id="notification-dropdown" 
                         style="position: absolute; top: 100%; right: 0; background: white; border: 1px solid #e9ecef; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 350px; max-height: 400px; overflow-y: auto; display: none; z-index: 1000;">
                        <div style="padding: 1rem; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; color: #212529; font-size: 1rem;">Notifications</h4>
                            <span id="notification-badge" style="background: #4361ee; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">0</span>
                        </div>
                        <div id="notification-list" style="max-height: 300px; overflow-y: auto;"></div>
                        <div style="padding: 0.75rem; border-top: 1px solid #e9ecef; text-align: center;">
                            <button id="clear-notifications" style="background: none; border: none; color: #4361ee; cursor: pointer; font-size: 0.9rem;">
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            const notificationContainer = document.createElement('div');
            notificationContainer.innerHTML = notificationHTML;
            navMenu.appendChild(notificationContainer);
            
            // Add click handlers
            this.setupNotificationHandlers();
            
            // Add hover effect
            const bell = document.getElementById('notification-bell');
            if (bell) {
                bell.addEventListener('mouseenter', () => {
                    bell.style.backgroundColor = '#f8f9fa';
                });
                
                bell.addEventListener('mouseleave', () => {
                    bell.style.backgroundColor = 'transparent';
                });
            }
        }
    }
    
    setupNotificationHandlers() {
        const bell = document.getElementById('notification-bell');
        const dropdown = document.getElementById('notification-dropdown');
        const clearBtn = document.getElementById('clear-notifications');
        
        if (bell && dropdown) {
            bell.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = dropdown.style.display === 'block';
                dropdown.style.display = isVisible ? 'none' : 'block';
                
                // Reset badge count when dropdown is opened
                if (!isVisible) {
                    this.notificationCount = 0;
                    this.updateNotificationBadge();
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#notification-container')) {
                    dropdown.style.display = 'none';
                }
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearNotifications();
            });
        }
    }
    
    showNotification(data) {
        this.notificationCount++;
        this.updateNotificationBadge();
        
        // Update dropdown badge
        const dropdownBadge = document.getElementById('notification-badge');
        if (dropdownBadge) {
            dropdownBadge.textContent = this.notificationCount;
        }
        
        // Create notification element
        const notificationList = document.getElementById('notification-list');
        if (notificationList) {
            const notificationElement = document.createElement('div');
            notificationElement.className = 'notification-item';
            notificationElement.style.padding = '1rem';
            notificationElement.style.borderBottom = '1px solid #f8f9fa';
            notificationElement.style.cursor = 'pointer';
            notificationElement.style.transition = 'background-color 0.2s';
            
            notificationElement.innerHTML = `
                <div style="display: flex; gap: 0.75rem; align-items: start;">
                    <div style="background: #4361ee; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem;">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div style="flex: 1;">
                        <p style="margin: 0 0 0.25rem 0; color: #212529; font-weight: 500; font-size: 0.9rem;">New Product Available!</p>
                        <p style="margin: 0 0 0.5rem 0; color: #495057; font-size: 0.85rem;"><strong>${data.product.title}</strong> - ₹${data.product.price}</p>
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #6c757d; font-size: 0.75rem;">
                            <i class="fas fa-user"></i>
                            <span>${data.product.seller}</span>
                            <i class="fas fa-tag"></i>
                            <span style="background: #e9ecef; padding: 0.1rem 0.4rem; border-radius: 12px;">${data.product.category}</span>
                            <i class="fas fa-clock"></i>
                            <span>${new Date(data.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Add click handler to view product
            notificationElement.addEventListener('click', () => {
                uiManager.navigateToPage('find');
                setTimeout(() => {
                    uiManager.showMessage(`🔍 Viewing: ${data.product.title}`, 'success');
                }, 500);
                dropdown.style.display = 'none';
            });
            
            // Add hover effect
            notificationElement.addEventListener('mouseenter', () => {
                notificationElement.style.backgroundColor = '#f8f9fa';
            });
            
            notificationElement.addEventListener('mouseleave', () => {
                notificationElement.style.backgroundColor = 'transparent';
            });
            
            // Add to top of list
            if (notificationList.firstChild) {
                notificationList.insertBefore(notificationElement, notificationList.firstChild);
            } else {
                notificationList.appendChild(notificationElement);
            }
        }
        
        // Show toast notification (always works regardless of browser permissions)
        this.showToastNotification(data);
        
        // Show browser notification only if permitted
        if (this.permissionStatus === 'granted') {
            this.showBrowserNotification(data);
        }
    }
    
    showToastNotification(data) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-left: 4px solid #4361ee;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 320px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            cursor: pointer;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; gap: 0.75rem; align-items: start;">
                <div style="background: #4361ee; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem;">
                    <i class="fas fa-bell"></i>
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0 0 0.25rem 0; color: #212529; font-size: 0.9rem; font-weight: 500;">New Product!</p>
                    <p style="margin: 0 0 0.5rem 0; color: #6c757d; font-size: 0.8rem;">${data.product.title} - ₹${data.product.price}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="this.parentElement.parentElement.parentElement.remove(); uiManager.navigateToPage('find');" 
                                style="background: #4361ee; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; flex: 1;">
                            View
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                style="background: #6c757d; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 6 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 6000);
    }
    
    showBrowserNotification(data) {
        try {
            new Notification('CampusTrade - New Product', {
                body: `${data.product.title} - ₹${data.product.price}`,
                icon: '/assets/images/logo.png',
                tag: 'new-product'
            });
        } catch (error) {
            console.log('🔕 Browser notification failed:', error);
        }
    }
    
    updateNotificationBadge() {
        const badge = document.getElementById('notification-count');
        if (badge) {
            badge.textContent = this.notificationCount;
            badge.style.display = this.notificationCount > 0 ? 'flex' : 'none';
        }
    }
    
    clearNotifications() {
        this.notificationCount = 0;
        this.updateNotificationBadge();
        
        const notificationList = document.getElementById('notification-list');
        const dropdownBadge = document.getElementById('notification-badge');
        
        if (notificationList) {
            notificationList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #6c757d;"><i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 0.5rem;"></i><p>No notifications</p></div>';
        }
        
        if (dropdownBadge) {
            dropdownBadge.textContent = '0';
        }
    }
    
    // Don't automatically request permission - let user trigger it
    requestNotificationPermission() {
        if (!('Notification' in window)) {
            uiManager.showMessage('Your browser does not support notifications', 'info');
            return;
        }
        
        if (this.permissionStatus === 'denied') {
            uiManager.showMessage('Notifications are blocked. Please enable them in your browser settings.', 'info');
            return;
        }
        
        if (this.permissionStatus === 'granted') {
            uiManager.showMessage('Notifications are already enabled!', 'success');
            return;
        }
        
        Notification.requestPermission().then(permission => {
            this.permissionStatus = permission;
            if (permission === 'granted') {
                uiManager.showMessage('Notifications enabled! You will now receive alerts for new products.', 'success');
            } else {
                uiManager.showMessage('Notifications not enabled. You can enable them later in browser settings.', 'info');
            }
        });
    }
}

// Initialize Notifications Manager
const notificationsManager = new NotificationsManager();

// Add global helper to request notification permission
window.enableNotifications = () => {
    notificationsManager.requestNotificationPermission();
};