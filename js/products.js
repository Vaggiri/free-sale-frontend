// Product Management with Real Backend API
class ProductManager {
    constructor() {
        this.products = [];
        this.filters = {
            category: '',
            minPrice: '',
            maxPrice: '',
            search: ''
        };
        this.API_BASE = 'https://free-sale-backend.onrender.com/api';
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing ProductManager...');
        this.setupEventListeners();
        this.testConnection().then(success => {
            if (success) {
                this.loadProducts();
            } else {
                console.log('🔄 Loading sample products due to connection issues');
                this.loadSampleProductsWithImages();
            }
        });
    }
    
    setupEventListeners() {
        console.log('🔧 Setting up product event listeners...');
        
        // Search
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');
        
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.applySearch();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applySearch();
                }
            });
        }
        
        // Filters
        const applyFilters = document.getElementById('apply-filters');
        if (applyFilters) {
            applyFilters.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        // Sell form
        const sellForm = document.getElementById('sell-form');
        if (sellForm) {
            sellForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSellProduct();
            });
        }
        
        console.log('✅ Product event listeners setup complete');
    }
    
    async testConnection() {
        try {
            console.log('🔧 Testing API connection...');
            const response = await fetch(`${this.API_BASE}/cors-test`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ API connection test passed:', data.message);
                return true;
            } else {
                console.warn('⚠️ API connection test failed with status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ API connection test failed:', error.message);
            return false;
        }
    }
    
    async loadProducts() {
        if (!uiManager) {
            console.error('❌ UIManager not available');
            return;
        }
        
        uiManager.showLoading();
        
        try {
            const queryParams = new URLSearchParams();
            
            // Add filters to query
            if (this.filters.category) queryParams.append('category', this.filters.category);
            if (this.filters.minPrice) queryParams.append('minPrice', this.filters.minPrice);
            if (this.filters.maxPrice) queryParams.append('maxPrice', this.filters.maxPrice);
            if (this.filters.search) queryParams.append('search', this.filters.search);
            
            console.log('🔄 Loading products from:', `${this.API_BASE}/products?${queryParams}`);
            
            const response = await fetch(`${this.API_BASE}/products?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });
            
            console.log('📨 Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.products = data.products || [];
                console.log(`✅ Loaded ${this.products.length} products`);
                this.displayProducts(this.products);
                
                // DEBUG: Check images
                setTimeout(() => {
                    this.debugProductImages();
                }, 500);
                
            } else {
                uiManager.showMessage(data.message || 'Failed to load products', 'error');
                this.products = [];
                this.displayProducts([]);
            }
        } catch (error) {
            console.error('❌ Load products error:', error);
            uiManager.showMessage('Failed to load products from server. Using sample data.', 'warning');
            this.loadSampleProductsWithImages();
        } finally {
            uiManager.hideLoading();
        }
    }
    
    loadSampleProductsWithImages() {
        console.log('📦 Loading sample products for testing...');
        this.products = [
            {
                _id: 'sample-1',
                title: 'Calculus Textbook - 2nd Edition',
                description: 'Hardly used calculus textbook in excellent condition. Includes all chapters and practice problems.',
                price: 25.99,
                category: 'books',
                images: [
                    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
                ],
                seller: { 
                    name: 'John Doe', 
                    rating: 4.5, 
                    college: 'Example University',
                    phone: '+919876543210'
                },
                meetupLocation: 'library',
                status: 'active',
                condition: 'good'
            },
            {
                _id: 'sample-2',
                title: 'MacBook Pro 2019',
                description: '13-inch MacBook Pro, 256GB SSD, 8GB RAM. Good condition, minor scratches on casing.',
                price: 750.00,
                category: 'electronics',
                images: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop'
                ],
                seller: { 
                    name: 'Jane Smith', 
                    rating: 4.8, 
                    college: 'Tech College',
                    phone: '+919876543211'
                },
                meetupLocation: 'canteen',
                status: 'active',
                condition: 'good'
            },
            {
                _id: 'sample-3',
                title: 'Mountain Bike',
                description: '21-speed mountain bike, recently serviced. Comes with lock and helmet.',
                price: 120.00,
                category: 'cycles',
                images: [
                    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop'
                ],
                seller: { 
                    name: 'Mike Johnson', 
                    rating: 4.2, 
                    college: 'Sports University',
                    phone: '+919876543212'
                },
                meetupLocation: 'main-gate',
                status: 'active',
                condition: 'good'
            }
        ];
        this.displayProducts(this.products);
        console.log('✅ Sample products loaded');
    }
    
    displayProducts(products) {
        const container = document.getElementById('products-container');
        
        if (!container) {
            console.error('❌ Products container not found');
            return;
        }
        
        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                    <h3 style="color: #495057; margin-bottom: 0.5rem;">No products found</h3>
                    <p style="color: #6c757d;">Try adjusting your search or filters</p>
                    <button class="btn-primary" onclick="productManager.resetFilters()" style="margin-top: 1rem;">
                        Reset Filters
                    </button>
                </div>
            `;
            return;
        }
        
        console.log(`🎨 Rendering ${products.length} products...`);
        
        container.innerHTML = products.map(product => {
            const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
            const imageUrl = firstImage ? this.getImageUrl(firstImage) : null;
            
            return `
                <div class="product-card" data-id="${product._id || product.id}" 
                     style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease; cursor: pointer;"
                     onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 15px rgba(0,0,0,0.1)'"
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                    <div class="product-image" 
                         style="height: 200px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                        ${firstImage ? 
                            `<img src="${imageUrl}" 
                                  alt="${product.title}"
                                  style="width: 100%; height: 100%; object-fit: cover; transition: all 0.3s ease;"
                                  onload="console.log('✅ Image loaded successfully: ${product.title}')"
                                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; console.log('❌ Image failed to load: ${imageUrl}')"
                             >
                             <div class="image-fallback" style="display: none; flex-direction: column; align-items: center; justify-content: center; color: #6c757d; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #f8f9fa;">
                                 <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                                 <span>Image not available</span>
                             </div>` : 
                            `<div class="no-image" style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6c757d; width: 100%; height: 100%;">
                                 <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                                 <span>No image</span>
                             </div>`
                        }
                    </div>
                    <div class="product-info" style="padding: 1.5rem;">
                        <h3 class="product-title" style="font-weight: 600; margin-bottom: 0.5rem; color: #212529; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.8rem;">
                            ${this.escapeHtml(product.title)}
                        </h3>
                        <p class="product-price" style="font-size: 1.25rem; font-weight: 700; color: #4361ee; margin-bottom: 0.5rem;">
                            ₹${product.price}
                        </p>
                        <span class="product-category" style="display: inline-block; background: #e9ecef; color: #6c757d; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; margin-bottom: 1rem;">
                            ${this.formatCategory(product.category)}
                        </span>
                        <div class="product-seller" style="display: flex; align-items: center; gap: 0.5rem; color: #6c757d; font-size: 0.9rem;">
                            <i class="fas fa-user" style="color: #4361ee;"></i>
                            <span>${product.seller?.name || 'Unknown Seller'}</span>
                            <div class="seller-rating" style="margin-left: auto;">
                                ${this.generateStarRating(product.seller?.rating)}
                            </div>
                        </div>
                        ${product.status && product.status !== 'active' ? 
                            `<div class="product-status" style="background: #dc3545; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; margin-top: 0.5rem; display: inline-block;">
                                ${product.status}
                            </div>` : ''
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click events to product cards
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on buttons or links
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
                
                const productId = card.getAttribute('data-id');
                const product = this.products.find(p => (p._id || p.id) === productId);
                if (product) {
                    console.log('👆 Clicked product:', product.title);
                    uiManager.showProductDetail(product);
                }
            });
        });
        
        console.log('✅ Products rendered successfully');
    }
    
    // ... (Include all the other methods from the previous products.js version)
    // Make sure to include: handleSellProduct, applySearch, applyFilters, resetFilters, 
    // getImageUrl, escapeHtml, formatCategory, generateStarRating, debugProductImages, etc.
    
    async handleSellProduct() {
        if (!authManager.isLoggedIn()) {
            uiManager.showAuthModal();
            uiManager.showMessage('Please login to sell products', 'error');
            return;
        }
        
        // Get form data
        const title = document.getElementById('product-title').value.trim();
        const description = document.getElementById('product-description').value.trim();
        const price = document.getElementById('product-price').value;
        const category = document.getElementById('product-category').value;
        const meetupLocation = document.getElementById('meetup-location').value;
        const condition = 'good'; // Default condition
        
        const imageFiles = document.getElementById('product-images').files;
        
        console.log('📝 Form data:', { title, description, price, category, meetupLocation, condition });
        console.log('🖼️ Image files to upload:', imageFiles.length);
        
        // Validation
        if (!title || !description || !price || !category || !meetupLocation) {
            uiManager.showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        if (price <= 0 || isNaN(price)) {
            uiManager.showMessage('Price must be a valid number greater than 0', 'error');
            return;
        }
        
        try {
            uiManager.showLoading();
            
            const token = authManager.getAuthToken();
            
            // Use FormData for file uploads
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', parseFloat(price));
            formData.append('category', category);
            formData.append('meetupLocation', meetupLocation);
            formData.append('condition', condition);
            
            // Append each image file
            for (let i = 0; i < imageFiles.length; i++) {
                formData.append('images', imageFiles[i]);
            }
            
            console.log('🚀 Sending FormData with', imageFiles.length, 'images');
            
            const response = await fetch(`${this.API_BASE}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                uiManager.showMessage('✅ Product listed successfully!');
                this.resetSellForm();
                
                // Navigate to find page and reload products
                setTimeout(() => {
                    uiManager.navigateToPage('find');
                    this.loadProducts();
                }, 1000);
                
            } else {
                throw new Error(data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('❌ Sell product error:', error);
            uiManager.showMessage(error.message, 'error');
        } finally {
            uiManager.hideLoading();
        }
    }
    
    resetSellForm() {
        const sellForm = document.getElementById('sell-form');
        if (sellForm) {
            sellForm.reset();
        }
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = '';
        }
        console.log('🧹 Sell form reset');
    }
    
    applySearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            this.filters.search = searchTerm;
            console.log('🔍 Applying search:', searchTerm);
            this.applyAllFilters();
        }
    }
    
    applyFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        
        if (categoryFilter) this.filters.category = categoryFilter.value;
        if (priceMin) this.filters.minPrice = priceMin.value;
        if (priceMax) this.filters.maxPrice = priceMax.value;
        
        console.log('🎛️ Applying filters:', this.filters);
        this.applyAllFilters();
    }
    
    resetFilters() {
        // Reset filter values
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (priceMin) priceMin.value = '';
        if (priceMax) priceMax.value = '';
        
        // Reset filter state
        this.filters = {
            category: '',
            minPrice: '',
            maxPrice: '',
            search: ''
        };
        
        console.log('🔄 Filters reset');
        this.loadProducts();
    }
    
    applyAllFilters() {
        this.loadProducts();
    }
    
    getImageUrl(imagePath) {
        if (!imagePath) return '';
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        if (imagePath.startsWith('data:image')) {
            return imagePath;
        }
        
        // Use the config for uploads URL
        return `${Config.UPLOADS_BASE}/${imagePath}`;
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatCategory(category) {
        const categoryMap = {
            'books': 'Books',
            'electronics': 'Electronics',
            'cycles': 'Cycles',
            'hostel-needs': 'Hostel Needs',
            'accessories': 'Accessories',
            'other': 'Other'
        };
        return categoryMap[category] || category;
    }
    
    generateStarRating(rating) {
        if (!rating || rating === 0) {
            return '<span style="color: #6c757d; font-size: 0.8rem;">No ratings</span>';
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
    
    debugProductImages() {
        console.log('=== 🖼️ PRODUCT IMAGES DEBUG ===');
        if (!this.products || this.products.length === 0) {
            console.log('❌ No products to debug');
            return;
        }
        
        this.products.forEach((product, index) => {
            console.log(`📦 Product ${index + 1}: "${product.title}"`);
            console.log('   ID:', product._id || product.id);
            console.log('   Images array:', product.images);
            
            if (product.images && product.images.length > 0) {
                product.images.forEach((img, imgIndex) => {
                    const fullUrl = this.getImageUrl(img);
                    console.log(`   Image ${imgIndex + 1}:`, {
                        storedValue: img,
                        constructedUrl: fullUrl,
                        isBase64: img.startsWith('data:image'),
                        isUrl: img.startsWith('http'),
                        isFilename: !img.startsWith('http') && !img.startsWith('data:')
                    });
                    
                    // Test image loading
                    this.testImageLoad(fullUrl, `Product ${index+1} - Image ${imgIndex+1}`);
                });
            } else {
                console.log('   ❌ No images in this product');
            }
            console.log('   ---');
        });
    }
    
    testImageLoad(url, label) {
        const img = new Image();
        img.onload = () => console.log(`   ✅ ${label}: Loads successfully`);
        img.onerror = () => console.log(`   ❌ ${label}: Failed to load`);
        img.src = url;
    }
}

// Initialize Product Manager - Make sure this is at the end
console.log('🚀 Initializing ProductManager...');
const productManager = new ProductManager();
console.log('✅ ProductManager initialized successfully');

window.productManager = productManager;

// If productManager fails to initialize, create a simple fallback
if (typeof productManager === 'undefined') {
    console.warn('⚠️ ProductManager failed to initialize, creating fallback');
    window.productManager = {
        loadProducts: function() {
            console.log('🔄 Fallback: Loading products');
            // Simple fallback implementation
        },
        loadSampleProductsWithImages: function() {
            console.log('🔄 Fallback: Loading sample products');
            // Simple fallback implementation
        }
    };
}