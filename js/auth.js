// Authentication Management with Real Backend API
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.API_BASE = 'https://free-sale-backend.onrender.com/api';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }
    
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }
    }
    
    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            uiManager.showLoading();
            
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                localStorage.setItem('token', data.token);
                // Store user ID properly - use _id if available, otherwise id
                const userId = data.user._id || data.user.id;
                localStorage.setItem('userId', userId);
                
                console.log('✅ Login successful, user ID:', userId);
                
                this.updateUI();
                uiManager.closeAllModals();
                uiManager.showMessage('Login successful!');
                
            } else {
                uiManager.showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            uiManager.showMessage('Login failed. Please check your connection.', 'error');
        } finally {
            uiManager.hideLoading();
        }
    }
    
    async handleSignup() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const college = document.getElementById('signup-college').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (!this.isValidPhoneNumber(phone)) {
            uiManager.showMessage('Please enter a valid WhatsApp number with country code (e.g., +919876543210)', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            uiManager.showMessage('Passwords do not match', 'error');
            return;
        }
        
        if (!this.isValidCollegeEmail(email)) {
            if (!confirm('This email doesn\'t appear to be a college email. Continue anyway?')) {
                return;
            }
        }
        
        try {
            uiManager.showLoading();
            
            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    college, 
                    phone,
                    password,
                    studentId: this.generateStudentId()
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                uiManager.showMessage('Account created successfully! Please login.');
                uiManager.switchAuthTab('login');
                document.getElementById('login-email').value = email;
            } else {
                uiManager.showMessage(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            uiManager.showMessage('Registration failed. Please try again.', 'error');
        } finally {
            uiManager.hideLoading();
        }
    }
    
    isValidCollegeEmail(email) {
        const collegeDomains = ['.edu', 'ac.in', 'college', 'university'];
        return collegeDomains.some(domain => email.includes(domain));
    }
    
    isValidPhoneNumber(phone) {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }
    
    generateStudentId() {
        return 'STU' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    getAuthToken() {
        return localStorage.getItem('token');
    }
    
    getUserId() {
        // First try to get from currentUser, then from localStorage
        if (this.currentUser && (this.currentUser._id || this.currentUser.id)) {
            return this.currentUser._id || this.currentUser.id;
        }
        return localStorage.getItem('userId');
    }
    
    async checkAuthStatus() {
        const token = this.getAuthToken();
        if (token) {
            try {
                const response = await fetch(`${this.API_BASE}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                    // Store user ID properly
                    const userId = data.user._id || data.user.id;
                    localStorage.setItem('userId', userId);
                    
                    console.log('✅ Auth status: User is logged in, ID:', userId);
                    this.updateUI();
                } else {
                    console.log('❌ Auth status: Token invalid');
                    this.logout();
                }
            } catch (error) {
                console.error('Auth check error:', error);
                this.logout();
            }
        } else {
            console.log('🔐 Auth status: No token found');
        }
        this.updateUI();
    }
    
    updateUI() {
        const authButton = document.getElementById('auth-button');
        if (!authButton) return;
        
        if (this.isLoggedIn()) {
            authButton.textContent = 'Logout';
            authButton.onclick = () => this.logout();
            
            if (uiManager.currentPage === 'profile') {
                if (ProfileManager && typeof ProfileManager.loadUserProfile === 'function') {
                    ProfileManager.loadUserProfile();
                }
                if (ProfileManager && typeof ProfileManager.loadUserListings === 'function') {
                    ProfileManager.loadUserListings();
                }
            }
        } else {
            authButton.textContent = 'Login';
            authButton.onclick = () => uiManager.showAuthModal();
        }
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.updateUI();
        uiManager.showMessage('Logged out successfully');
        
        if (uiManager.currentPage === 'profile') {
            uiManager.navigateToPage('home');
        }
        
        console.log('👋 User logged out');
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
}

const authManager = new AuthManager();