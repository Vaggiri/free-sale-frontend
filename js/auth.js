// Authentication Management with Real Backend API
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.API_BASE = 'http://localhost:5000/api';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }
    
    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Signup form
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
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
                this.updateUI();
                uiManager.closeAllModals();
                uiManager.showMessage('Login successful!');
                
                // Refresh page content
                if (uiManager.currentPage === 'profile') {
                    ProfileManager.loadUserProfile();
                    ProfileManager.loadUserListings();
                }
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
        
        // WhatsApp number validation
        if (!this.isValidPhoneNumber(phone)) {
            uiManager.showMessage('Please enter a valid WhatsApp number with country code (e.g., +919876543210)', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            uiManager.showMessage('Passwords do not match', 'error');
            return;
        }
        
        // Basic college email validation
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
                // Pre-fill login form
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
    
    // Add phone validation method
    isValidPhoneNumber(phone) {
        // Basic international phone number validation
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }
    
    isValidCollegeEmail(email) {
        // Basic college email validation
        const collegeDomains = ['.amrita.edu', '.edu', '.ac.in'];
        return collegeDomains.some(domain => email.includes(domain));
    }
    
    generateStudentId() {
        // Generate a random student ID for testing
        return 'STU' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    getAuthToken() {
        return localStorage.getItem('token');
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
                    this.updateUI();
                } else {
                    // Token is invalid
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('token');
            }
        }
        this.updateUI();
    }
    
    updateUI() {
        const authButton = document.getElementById('auth-button');
        
        if (this.isLoggedIn()) {
            authButton.textContent = 'Logout';
            authButton.onclick = () => this.logout();
            
            // Update profile if on profile page
            if (uiManager.currentPage === 'profile') {
                ProfileManager.loadUserProfile();
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
        this.updateUI();
        uiManager.showMessage('Logged out successfully');
        
        // If on profile page, redirect to home
        if (uiManager.currentPage === 'profile') {
            uiManager.navigateToPage('home');
        }
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize Auth Manager
const authManager = new AuthManager();