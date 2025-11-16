// UI Management and Animations
class UIManager {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing UIManager...');
        this.setupEventListeners();
        this.setupPageTransitions();
        this.setupMobileEventListeners();
        this.setupModalHandlers();
        this.setupImageUpload();
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
        
        // Initialize mobile overlay if it doesn't exist
        this.ensureMobileOverlay();
        
        console.log('✅ UIManager initialized successfully');
    }
    
    ensureMobileOverlay() {
        if (!document.querySelector('.mobile-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            document.body.appendChild(overlay);
            console.log('✅ Mobile overlay created');
        }
    }
    
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
        
        // Auth button
        const authButton = document.getElementById('auth-button');
        if (authButton) {
            authButton.addEventListener('click', () => {
                this.showAuthModal();
            });
        }
        
        // Hero buttons
        document.querySelectorAll('.hero-buttons button').forEach(button => {
            button.addEventListener('click', (e) => {
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
        
        console.log('✅ Event listeners setup complete');
    }
    
    setupMobileEventListeners() {
        console.log('📱 Setting up mobile event listeners...');
        
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const mobileOverlay = document.querySelector('.mobile-overlay');

        // Hamburger menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🍔 Hamburger clicked');
                this.toggleMobileMenu();
            });
            
            // Add touch feedback
            navToggle.addEventListener('touchstart', () => {
                navToggle.style.transform = 'scale(0.95)';
            });
            
            navToggle.addEventListener('touchend', () => {
                navToggle.style.transform = 'scale(1)';
            });
        }

        // Mobile overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                console.log('📱 Overlay clicked');
                this.closeMobileMenu();
            });
        }

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen()) {
                this.closeMobileMenu();
            }
        });

        console.log('✅ Mobile event listeners setup complete');
    }
    
    setupPageTransitions() {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('fade-in');
        });
    }
    
    setupModalHandlers() {
        // Auth modal tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchAuthTab(tab);
            });
        });
        
        // Close buttons
        document.querySelectorAll('.close').forEach(button => {
            button.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
        
        // Profile tabs
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchProfileTab(tabName);
            });
        });
    }
    
    setupImageUpload() {
        console.log('🖼️ Setting up image upload...');
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('product-images');
        const imagePreview = document.getElementById('image-preview');
        
        if (uploadArea && fileInput && imagePreview) {
            console.log('✅ Image upload elements found');
            
            // Make upload area touch-friendly
            uploadArea.style.cursor = 'pointer';
            uploadArea.style.minHeight = '150px';
            uploadArea.style.display = 'flex';
            uploadArea.style.flexDirection = 'column';
            uploadArea.style.alignItems = 'center';
            uploadArea.style.justifyContent = 'center';
            
            // Click handler
            uploadArea.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📱 Upload area clicked');
                fileInput.click();
            });
            
            // Enhanced touch events for mobile
            uploadArea.addEventListener('touchstart', (e) => {
                e.preventDefault();
                console.log('📱 Touch start on upload area');
                uploadArea.classList.add('drag-over');
                uploadArea.style.backgroundColor = '#f0f8ff';
            });
            
            uploadArea.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });
            
            uploadArea.addEventListener('touchend', (e) => {
                e.preventDefault();
                console.log('📱 Touch end on upload area');
                uploadArea.classList.remove('drag-over');
                uploadArea.style.backgroundColor = '';
                
                // Trigger file input click
                setTimeout(() => {
                    fileInput.click();
                }, 100);
            });
            
            // Desktop drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                console.log('📁 Files dropped:', files.length);
                this.handleImageFiles(files);
            });
            
            // File input change
            fileInput.addEventListener('change', (e) => {
                console.log('📁 File input changed:', e.target.files.length);
                this.handleImageFiles(e.target.files);
                
                // Reset the input to allow selecting same file again
                fileInput.value = '';
            });
            
            // Prevent default behavior
            fileInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            console.log('✅ Image upload setup complete');
        } else {
            console.error('❌ Image upload elements not found');
        }
    }
    
    handleImageFiles(files) {
        console.log('🖼️ Handling image files:', files.length);
        const imagePreview = document.getElementById('image-preview');
        if (!imagePreview) {
            console.error('❌ Image preview container not found');
            return;
        }
        
        // Clear existing previews if needed
        // imagePreview.innerHTML = '';
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                console.log('❌ Skipping non-image file:', file.type);
                return;
            }
            
            console.log('✅ Processing image file:', file.name, file.type, file.size);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'preview-image';
                previewDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
                    <span class="remove-image" style="position: absolute; top: 5px; right: 5px; background: rgba(255,0,0,0.8); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; cursor: pointer;">×</span>
                `;
                
                // Remove image on click
                previewDiv.querySelector('.remove-image').addEventListener('click', (e) => {
                    e.stopPropagation();
                    previewDiv.remove();
                    console.log('🗑️ Image removed from preview');
                });
                
                imagePreview.appendChild(previewDiv);
                console.log('✅ Image preview added');
            };
            
            reader.onerror = (error) => {
                console.error('❌ Error reading file:', error);
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // MOBILE MENU METHODS
    isMobileMenuOpen() {
        const navMenu = document.querySelector('.nav-menu');
        return navMenu && navMenu.classList.contains('active');
    }
    
    toggleMobileMenu() {
        console.log('🍔 Toggling mobile menu');
        if (this.isMobileMenuOpen()) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        console.log('📱 Opening mobile menu');
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        
        if (navMenu && navToggle && mobileOverlay) {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('✅ Mobile menu opened');
        } else {
            console.error('❌ Mobile menu elements not found');
        }
    }
    
    closeMobileMenu() {
        console.log('📱 Closing mobile menu');
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        
        if (navMenu && navToggle && mobileOverlay) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('✅ Mobile menu closed');
        }
    }
    
    navigateToPage(page) {
        console.log(`🔄 Navigating to page: ${page}`);
        
        // Hide current page
        const currentPageElement = document.getElementById(`${this.currentPage}-page`);
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }
        
        // Show new page
        const newPageElement = document.getElementById(`${page}-page`);
        if (newPageElement) {
            newPageElement.classList.add('active');
        }
        
        // Update current page
        this.currentPage = page;
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
        
        // Close mobile menu
        this.closeMobileMenu();
        
        // Load page-specific content
        this.loadPageContent(page);
    }
    
    loadPageContent(page) {
        console.log(`🔄 Loading page content: ${page}`);
        
        switch(page) {
            case 'find':
                if (window.productManager && typeof window.productManager.loadProducts === 'function') {
                    window.productManager.loadProducts();
                } else {
                    console.error('❌ ProductManager not available for find page');
                }
                break;
            case 'profile':
                if (authManager && authManager.isLoggedIn()) {
                    if (window.ProfileManager && typeof window.ProfileManager.loadUserProfile === 'function') {
                        window.ProfileManager.loadUserProfile();
                    }
                    if (window.ProfileManager && typeof window.ProfileManager.loadUserListings === 'function') {
                        window.ProfileManager.loadUserListings();
                    }
                } else {
                    this.showAuthModal();
                    this.navigateToPage('home');
                }
                break;
        }
    }
    
    showAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.add('active');
        }
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    switchAuthTab(tab) {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        const activeTabButton = document.querySelector(`[data-tab="${tab}"]`);
        if (activeTabButton) {
            activeTabButton.classList.add('active');
        }
        
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        const activeForm = document.getElementById(`${tab}-form`);
        if (activeForm) {
            activeForm.classList.add('active');
        }
    }
    
    switchProfileTab(tab) {
        document.querySelectorAll('.profile-tab').forEach(button => {
            button.classList.remove('active');
        });
        const activeTabButton = document.querySelector(`[data-tab="${tab}"]`);
        if (activeTabButton) {
            activeTabButton.classList.add('active');
        }
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${tab}-tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }
    
    showProductDetail(product) {
        console.log('👆 Showing product detail:', product.title);
        const modal = document.getElementById('product-modal');
        const content = document.getElementById('product-detail-content');
        
        if (!modal || !content) {
            console.error('❌ Product modal elements not found');
            return;
        }
        
        const categoryMap = {
            'books': 'Books', 'electronics': 'Electronics', 'cycles': 'Cycles',
            'hostel-needs': 'Hostel Needs', 'accessories': 'Accessories', 'other': 'Other'
        };
        
        const locationMap = {
            'canteen': 'College Canteen', 'library': 'Library Entrance',
            'main-gate': 'Main Gate', 'hostel': 'Hostel Common Area', 'other': 'Other Location'
        };

        content.innerHTML = `
            <div class="product-detail-mobile-header" style="display: none; padding: 1rem; border-bottom: 1px solid #e9ecef;">
                <button class="back-button" onclick="window.uiManager.closeAllModals()" style="background: none; border: none; color: #4361ee; font-size: 1rem; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
            <div class="product-detail-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 1rem;">
                <div class="product-detail-images">
                    <div class="main-image" style="background: #f8f9fa; border-radius: 12px; padding: 2rem; text-align: center; margin-bottom: 1rem;">
                        ${product.images && product.images.length > 0 ? 
                            `<img src="${this.getImageUrl(product.images[0])}" alt="${product.title}" 
                                 style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px;"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlY2VmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzljYTNkZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">` : 
                            `<div style="color: #6c757d; padding: 3rem;">
                                <i class="fas fa-image" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                                <p>No Image Available</p>
                            </div>`
                        }
                    </div>
                </div>
                
                <div class="product-detail-info">
                    <h2 style="color: #212529; margin-bottom: 0.5rem; font-size: 1.8rem;">${product.title}</h2>
                    <p class="product-price" style="font-size: 2rem; font-weight: 700; color: #4361ee; margin-bottom: 1rem;">₹${product.price}</p>
                    
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                        <span class="product-category" style="background: #4361ee; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
                            ${categoryMap[product.category] || product.category}
                        </span>
                        <span class="product-status" style="background: #28a745; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
                            ${product.status || 'Available'}
                        </span>
                    </div>
                    
                    <div class="product-description" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <h3 style="color: #495057; margin-bottom: 0.5rem;">Description</h3>
                        <p style="color: #6c757d; line-height: 1.6; white-space: pre-wrap;">${product.description}</p>
                    </div>
                    
                    <div class="seller-info" style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h3 style="color: #495057; margin-bottom: 1rem;">Seller Information</h3>
                        <div class="seller-details" style="display: flex; align-items: center; gap: 1rem;">
                            <div class="seller-avatar" style="width: 50px; height: 50px; background: #4361ee; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-user" style="color: white; font-size: 1.2rem;"></i>
                            </div>
                            <div class="seller-text">
                                <p class="seller-name" style="font-weight: 600; color: #212529; margin-bottom: 0.25rem;">${product.seller?.name || 'Unknown Seller'}</p>
                                <p class="seller-college" style="color: #6c757d; margin-bottom: 0.5rem;">${product.seller?.college || 'College not specified'}</p>
                                <div class="seller-rating" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div class="stars">
                                        ${this.generateStarRating(product.seller?.rating)}
                                    </div>
                                    <span style="color: #6c757d; font-size: 0.9rem;">${product.seller?.rating || 'No ratings yet'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="meetup-info" style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h3 style="color: #495057; margin-bottom: 1rem;">Meetup Location</h3>
                        <p style="color: #6c757d; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-map-marker-alt" style="color: #dc3545;"></i>
                            ${locationMap[product.meetupLocation] || product.meetupLocation}
                        </p>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-primary btn-large" id="contact-seller" 
                                style="width: 100%; padding: 1rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i>
                            Contact Seller on WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const contactButton = document.getElementById('contact-seller');
        if (contactButton) {
            contactButton.addEventListener('click', () => {
                this.contactSeller(product);
            });
        }
        
        if (window.innerWidth <= 768) {
            content.querySelector('.product-detail-mobile-header').style.display = 'block';
            content.querySelector('.product-detail-container').style.gridTemplateColumns = '1fr';
        }

        modal.classList.add('active');
    }

    getImageUrl(imagePath) {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/')) return `https://free-sale-backend.onrender.com${imagePath}`;
        return `https://free-sale-backend.onrender.com/uploads/${imagePath}`;
    }

    contactSeller(product) {
        const user = authManager.getCurrentUser();
        const sellerPhone = product.seller?.phone || '';
        const productTitle = encodeURIComponent(product.title);
        const userName = user ? encodeURIComponent(user.name) : 'Potential Buyer';
        
        if (!sellerPhone) {
            this.showMessage('Seller contact information not available', 'error');
            return;
        }
        
        const message = `Hi! I'm ${userName} from CampusTrade. I'm interested in your product "${productTitle}" (₹${product.price}). Is it still available?`;
        const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }

    generateStarRating(rating) {
        if (!rating || rating === 0) {
            return '<span style="color: #6c757d; font-size: 0.9rem;">No ratings</span>';
        }
        
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star" style="color: #ffc107;"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt" style="color: #ffc107;"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star" style="color: #ffc107;"></i>';
        }
        
        return stars;
    }

    isMobile() {
        return window.innerWidth <= 768;
    }
    
    handleResize() {
        if (this.isMobile() && this.isMobileMenuOpen()) {
            this.closeMobileMenu();
        }
    }

    showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('active');
        }
    }

    hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('active');
        }
    }

    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}

// Initialize UI Manager
const uiManager = new UIManager();
window.uiManager = uiManager;
console.log('🌐 UIManager added to window');