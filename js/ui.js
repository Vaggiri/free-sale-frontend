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
    
    setupPageTransitions() {
        console.log('🎭 Setting up page transitions...');
        // Add transition classes to page elements
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('fade-in');
        });
        console.log('✅ Page transitions setup complete');
    }
    
    setupMobileEventListeners() {
        console.log('📱 Setting up mobile event listeners...');
        
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const mobileOverlay = document.querySelector('.mobile-overlay');

        // Hamburger menu toggle
        if (navToggle) {
            console.log('🍔 Hamburger element found');
            
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
        } else {
            console.error('❌ Hamburger element not found!');
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

        console.log('✅ Mobile event listeners setup complete');
    }
    // Add this method to your UIManager class
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 768
            || 'ontouchstart' in window;
        }
    
    setupModalHandlers() {
        console.log('🎪 Setting up modal handlers...');
        
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
        
        console.log('✅ Modal handlers setup complete');
    }
    
    setupImageUpload() {
        console.log('🖼️ Setting up image upload...');
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('product-images');
        const imagePreview = document.getElementById('image-preview');
        const mobileUploadButton = document.getElementById('mobile-upload-button');
        const uploadText = document.getElementById('upload-text');
        
        if (uploadArea && fileInput && imagePreview) {
            console.log('📱 Device type:', this.isMobile() ? 'Mobile' : 'Desktop');
            
            // Show mobile-specific UI
            if (this.isMobile()) {
                if (mobileUploadButton) {
                    mobileUploadButton.style.display = 'block';
                }
                if (uploadText) {
                    uploadText.textContent = 'Tap below to choose photos';
                }
                console.log('📱 Mobile upload interface activated');
            }
            
            // Reset upload area content
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p id="upload-text">${this.isMobile() ? 'Tap below to choose photos' : 'Click to upload or drag and drop'}</p>
                <span>PNG, JPG, JPEG up to 5MB</span>
                <input type="file" id="product-images" name="images" multiple accept="image/*" style="display: none;">
                <button type="button" id="mobile-upload-button" style="${this.isMobile() ? 'display: block;' : 'display: none;'} margin-top: 10px; padding: 10px 15px; background: #4361ee; color: white; border: none; border-radius: 5px; font-size: 14px;">
                    <i class="fas fa-camera"></i> Choose Photos
                </button>
            `;
            
            // Get fresh references after innerHTML
            const freshFileInput = uploadArea.querySelector('#product-images');
            const freshMobileButton = uploadArea.querySelector('#mobile-upload-button');
            
            // Enhanced mobile detection
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            console.log('📱 Touch device:', isTouchDevice);
            
            // Style upload area for mobile
            uploadArea.style.cssText = `
                position: relative !important;
                border: 2px dashed #e9ecef !important;
                border-radius: 8px !important;
                padding: ${this.isMobile() ? '1.5rem' : '2rem'} !important;
                text-align: center !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                min-height: ${this.isMobile() ? '120px' : '150px'} !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                background: #f8f9fa !important;
                -webkit-tap-highlight-color: transparent !important;
            `;
            
            // Style file input
            freshFileInput.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                opacity: 0 !important;
                cursor: pointer !important;
                z-index: 10 !important;
                font-size: 16px !important; /* Prevent zoom on iOS */
            `;
            
            // MOBILE-SPECIFIC FIXES:
            
            // 1. Mobile button click handler
            if (freshMobileButton) {
                freshMobileButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('📱 Mobile upload button clicked');
                    freshFileInput.click();
                });
                
                // Add touch feedback
                freshMobileButton.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.95)';
                    this.style.opacity = '0.8';
                });
                
                freshMobileButton.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                    this.style.opacity = '1';
                });
            }
            
            // 2. Enhanced click/touch handler for upload area
            const handleUploadClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📱 Upload area triggered');
                
                // Force file input click with timeout for mobile
                setTimeout(() => {
                    freshFileInput.click();
                }, 100);
            };
            
            // Use both click and touch events for mobile
            if (isTouchDevice) {
                uploadArea.addEventListener('touchstart', handleUploadClick, { passive: false });
                uploadArea.addEventListener('touchend', (e) => e.preventDefault());
            } else {
                uploadArea.addEventListener('click', handleUploadClick);
            }
            
            // 3. Enhanced file input change handler
            const handleFileChange = (e) => {
                console.log('📁 File input changed on:', this.isMobile() ? 'Mobile' : 'Desktop');
                console.log('📁 Files:', e.target.files);
                
                if (e.target.files && e.target.files.length > 0) {
                    console.log('📁 Processing files:', e.target.files.length);
                    this.handleImageFiles(e.target.files);
                } else {
                    console.warn('⚠️ No files selected or files array empty');
                }
            };
            
            freshFileInput.addEventListener('change', handleFileChange);
            
            // 4. Mobile-specific event for camera capture
            freshFileInput.setAttribute('capture', 'environment'); // Rear camera
            freshFileInput.setAttribute('accept', 'image/*');
            
            // 5. Add visual feedback for mobile
            uploadArea.addEventListener('touchstart', function() {
                this.style.backgroundColor = '#e3f2fd';
                this.style.borderColor = '#2196f3';
            });
            
            uploadArea.addEventListener('touchend', function() {
                this.style.backgroundColor = '#f8f9fa';
                this.style.borderColor = '#e9ecef';
            });
            
            console.log('✅ Mobile image upload setup complete');
            
        } else {
            console.error('❌ Image upload elements not found');
        }
    }
    
    handleImageFiles(files) {
        console.log('🖼️ Handling image files on:', this.isMobile() ? 'Mobile' : 'Desktop');
        console.log('📁 Files received:', files.length);
        
        const imagePreview = document.getElementById('image-preview');
        const fileInput = document.getElementById('product-images');
        
        if (!imagePreview) {
            console.error('❌ Image preview container not found');
            this.showMessage('Image preview area not found', 'error');
            return;
        }
        
        if (!files || files.length === 0) {
            console.warn('⚠️ No files to process');
            this.showMessage('No images selected', 'warning');
            return;
        }
        
        // Clear existing previews
        imagePreview.innerHTML = '';
        
        let processedFiles = 0;
        const maxFiles = 5;
        
        if (files.length > maxFiles) {
            this.showMessage(`Maximum ${maxFiles} images allowed`, 'warning');
        }
        
        // Convert FileList to Array for mobile compatibility
        const filesArray = Array.from(files).slice(0, maxFiles);
        
        console.log('🖼️ Processing files:', filesArray.length);
        
        filesArray.forEach((file, index) => {
            // Enhanced file validation
            if (!file.type.startsWith('image/')) {
                console.log('❌ Skipping non-image file:', file.type, file.name);
                this.showMessage(`Skipped non-image: ${file.name}`, 'warning');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                console.log('❌ File too large:', file.name, file.size);
                this.showMessage(`Too large: ${file.name}`, 'error');
                return;
            }
            
            console.log(`✅ Processing image ${index + 1}:`, file.name, file.type, file.size);
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                processedFiles++;
                console.log(`✅ Image ${index + 1} loaded successfully`);
                
                this.createImagePreview(e.target.result, file.name, imagePreview);
                this.updateImageCounter();
            };
            
            reader.onerror = (error) => {
                console.error('❌ Error reading file:', error, file.name);
                this.showMessage(`Error reading: ${file.name}`, 'error');
            };
            
            reader.onabort = () => {
                console.warn('⚠️ File reading aborted:', file.name);
            };
            
            // Read the file
            try {
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('❌ Failed to read file:', error, file.name);
                this.showMessage(`Failed to read: ${file.name}`, 'error');
            }
        });
        
        // Update success message
        setTimeout(() => {
            if (processedFiles > 0) {
                const message = `✅ ${processedFiles} image(s) selected`;
                console.log(message);
                this.showMessage(message, 'success');
            } else {
                console.warn('⚠️ No files were processed successfully');
                this.showMessage('No valid images selected', 'warning');
            }
        }, 1000);
    }
    
    // Helper method to create image preview
    createImagePreview(dataUrl, fileName, container) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'preview-image';
        previewDiv.style.cssText = `
            width: 100px;
            height: 100px;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            border: 2px solid #e9ecef;
            background: white;
        `;
        
        previewDiv.innerHTML = `
            <img src="${dataUrl}" 
                 alt="Preview" 
                 style="width: 100%; height: 100%; object-fit: cover;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="image-fallback" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; background: #f8f9fa; color: #6c757d;">
                <i class="fas fa-image"></i>
            </div>
            <button class="remove-image" 
                    type="button"
                    style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 11;">
                ×
            </button>
        `;
        
        // Remove image functionality
        const removeBtn = previewDiv.querySelector('.remove-image');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            previewDiv.remove();
            this.removeFileFromInput(fileName);
            this.updateImageCounter();
        });
        
        container.appendChild(previewDiv);
    }
    
    // Helper method to update file input
    updateFileInput(newFiles, currentFiles) {
        const fileInput = document.getElementById('product-images');
        const dt = new DataTransfer();
        
        // Add current files
        currentFiles.forEach(file => dt.items.add(file));
        
        // Add new files (avoid duplicates)
        newFiles.forEach(newFile => {
            if (!currentFiles.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)) {
                dt.items.add(newFile);
            }
        });
        
        fileInput.files = dt.files;
        console.log('📁 Updated file input with files:', dt.files.length);
    }
    
    // Helper method to remove file from input
    removeFileFromInput(fileName) {
        const fileInput = document.getElementById('product-images');
        const dt = new DataTransfer();
        
        // Add all files except the one to remove
        for (let file of fileInput.files) {
            if (file.name !== fileName) {
                dt.items.add(file);
            }
        }
        
        fileInput.files = dt.files;
        console.log('🗑️ Removed file from input:', fileName);
    }
    
    // ADD THIS HELPER METHOD
    updateImageCounter() {
        const imagePreview = document.getElementById('image-preview');
        const previewImages = imagePreview.querySelectorAll('.preview-image');
        const uploadArea = document.getElementById('upload-area');
        
        if (uploadArea) {
            const originalText = uploadArea.querySelector('p');
            if (originalText) {
                if (previewImages.length > 0) {
                    originalText.textContent = `${previewImages.length} image(s) selected. Click to add more.`;
                } else {
                    originalText.textContent = 'Click to upload or drag and drop';
                }
            }
        }
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
            // Remove any inline styles that might be causing issues
            navMenu.removeAttribute('style');
            mobileOverlay.removeAttribute('style');
            
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            
            console.log('✅ Mobile menu opened - Using display flex');
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
            document.body.classList.remove('menu-open');
            
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

// Initialize UI Manager - MAKE SURE THIS IS AT THE BOTTOM
const uiManager = new UIManager();
window.uiManager = uiManager;
console.log('🌐 UIManager added to window');