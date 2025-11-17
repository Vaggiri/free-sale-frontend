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
        
        const applyFilters = document.getElementById('apply-filters');
        if (applyFilters) {
            applyFilters.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        const sellForm = document.getElementById('sell-form');
        if (sellForm) {
            sellForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSellProduct();
            });
        }
    }
    
    async testConnection() {
        try {
            const response = await fetch(`${this.API_BASE}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ API connection test passed:', data.status);
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
        // Use window.uiManager instead of just uiManager
        if (window.uiManager) {
            window.uiManager.showLoading();
        }
        
        try {
            const queryParams = new URLSearchParams();
            
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
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.products = data.products || [];
                console.log(`✅ Loaded ${this.products.length} products`);
                this.displayProducts(this.products);
            } else {
                if (window.uiManager) {
                    window.uiManager.showMessage(data.message || 'Failed to load products', 'error');
                }
                this.products = [];
                this.displayProducts([]);
            }
        } catch (error) {
            console.error('❌ Load products error:', error);
            if (window.uiManager) {
                window.uiManager.showMessage('Failed to load products from server. Using sample data.', 'warning');
            }
            this.loadSampleProductsWithImages();
        } finally {
            if (window.uiManager) {
                window.uiManager.hideLoading();
            }
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
                    <button class="btn-primary" onclick="window.productManager.resetFilters()" style="margin-top: 1rem;">
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
            
            console.log(`🖼️ Product "${product.title}" image:`, imageUrl); // Debug log
            
            return `
                <div class="product-card" data-id="${product._id || product.id}" 
                     style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease; cursor: pointer;">
                    <div class="product-image" 
                         style="height: 200px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                        ${firstImage ? 
                            `<img src="${imageUrl}" 
                                  alt="${product.title}"
                                  style="width: 100%; height: 100%; object-fit: cover;"
                                  onerror="console.error('❌ Image failed to load:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex'">
                             <div class="image-fallback" style="display: none; flex-direction: column; align-items: center; justify-content: center; color: #6c757d; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #f8f9fa;">
                                 <i class="fas fa-image" style="font-size: 2rem;"></i>
                                 <small>Image not available</small>
                             </div>` : 
                            `<div class="no-image" style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6c757d;">
                                 <i class="fas fa-image" style="font-size: 2rem;"></i>
                                 <small>No image</small>
                             </div>`
                        }
                    </div>
                    <div class="product-info" style="padding: 1.5rem;">
                        <h3 class="product-title" style="font-weight: 600; margin-bottom: 0.5rem; color: #212529; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
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
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click events to product cards
        this.attachProductClickEvents();
    }
    
    attachProductClickEvents() {
        const container = document.getElementById('products-container');
        if (!container) return;
        
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
                    return;
                }
                
                const productId = card.getAttribute('data-id');
                const product = this.products.find(p => (p._id || p.id) === productId);
                if (product && window.uiManager) {
                    window.uiManager.showProductDetail(product);
                }
            });
        });
    }
    
    async handleSellProduct() {
        if (!authManager.isLoggedIn()) {
            if (window.uiManager) {
                window.uiManager.showAuthModal();
                window.uiManager.showMessage('Please login to sell products', 'error');
            }
            return;
        }
        
        const title = document.getElementById('product-title').value.trim();
        const description = document.getElementById('product-description').value.trim();
        const price = document.getElementById('product-price').value;
        const category = document.getElementById('product-category').value;
        const meetupLocation = document.getElementById('meetup-location').value;
        const condition = 'good';
        
        const imageFiles = document.getElementById('product-images').files;
        console.log('📝 Form data:', {
            title, description, price, category, meetupLocation, condition,
            imageCount: imageFiles.length
        });
        
        // Debug: Log all files
        for (let i = 0; i < imageFiles.length; i++) {
            console.log(`📁 File ${i + 1}:`, imageFiles[i].name, imageFiles[i].size, imageFiles[i].type);
        }
        
        if (!title || !description || !price || !category || !meetupLocation) {
            if (window.uiManager) {
                window.uiManager.showMessage('Please fill in all required fields', 'error');
            }
            return;
        }
        
        if (price <= 0 || isNaN(price)) {
            if (window.uiManager) {
                window.uiManager.showMessage('Price must be a valid number greater than 0', 'error');
            }
            return;
        }
        
        try {
            if (window.uiManager) {
                window.uiManager.showLoading();
            }
            
            const token = authManager.getAuthToken();
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', parseFloat(price));
            formData.append('category', category);
            formData.append('meetupLocation', meetupLocation);
            formData.append('condition', condition);
            
            for (let i = 0; i < imageFiles.length; i++) {
                formData.append('images', imageFiles[i]);
            }
            
            const response = await fetch(`${this.API_BASE}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (window.uiManager) {
                    window.uiManager.showMessage('✅ Product listed successfully!');
                }
                this.resetSellForm();
                
                setTimeout(() => {
                    if (window.uiManager) {
                        window.uiManager.navigateToPage('find');
                    }
                    this.loadProducts();
                }, 1000);
                
            } else {
                throw new Error(data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('❌ Sell product error:', error);
            if (window.uiManager) {
                window.uiManager.showMessage(error.message, 'error');
            }
        } finally {
            if (window.uiManager) {
                window.uiManager.hideLoading();
            }
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
    }
    
    applySearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            this.filters.search = searchTerm;
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
        
        this.applyAllFilters();
    }
    
    resetFilters() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (priceMin) priceMin.value = '';
        if (priceMax) priceMax.value = '';
        
        this.filters = {
            category: '',
            minPrice: '',
            maxPrice: '',
            search: ''
        };
        
        this.loadProducts();
    }
    
    applyAllFilters() {
        this.loadProducts();
    }
    
    getImageUrl(imagePath) {
        if (!imagePath) return '';
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) return imagePath;
        
        // If it's a data URL (base64), return as is
        if (imagePath.startsWith('data:image')) return imagePath;
        
        // For uploaded images, construct the proper URL
        // Use the same base URL as your API
        const baseUrl = 'https://free-sale-backend.onrender.com';
        
        // Check if the image path already includes the uploads folder
        if (imagePath.includes('uploads/')) {
            return `${baseUrl}/${imagePath}`;
        } else {
            return `${baseUrl}/uploads/${imagePath}`;
        }
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatCategory(category) {
        const categoryMap = {
            'books': 'Books', 'electronics': 'Electronics', 'cycles': 'Cycles',
            'hostel-needs': 'Hostel Needs', 'accessories': 'Accessories', 'other': 'Other'
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
}

// Initialize Product Manager
const productManager = new ProductManager();
window.productManager = productManager; // Make it globally available