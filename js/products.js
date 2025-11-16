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
        this.API_BASE = 'http://localhost:5000/api';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadProducts(); // Load products on initialization
    }
    
    setupEventListeners() {
        // Search
        document.getElementById('search-button').addEventListener('click', () => {
            this.applySearch();
        });
        
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applySearch();
            }
        });
        
        // Filters
        document.getElementById('apply-filters').addEventListener('click', () => {
            this.applyFilters();
        });
        
        // Sell form
        document.getElementById('sell-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSellProduct();
        });

        // Reset filters
        document.getElementById('reset-filters')?.addEventListener('click', () => {
            this.resetFilters();
        });
    }
    
    async loadProducts() {
        uiManager.showLoading();
        
        try {
            const queryParams = new URLSearchParams();
            
            // Add filters to query
            if (this.filters.category) queryParams.append('category', this.filters.category);
            if (this.filters.minPrice) queryParams.append('minPrice', this.filters.minPrice);
            if (this.filters.maxPrice) queryParams.append('maxPrice', this.filters.maxPrice);
            if (this.filters.search) queryParams.append('search', this.filters.search);
            
            const response = await fetch(`${this.API_BASE}/products?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.products = data.products || [];
                this.displayProducts(this.products);
            } else {
                uiManager.showMessage(data.message || 'Failed to load products', 'error');
                this.products = [];
                this.displayProducts([]);
            }
        } catch (error) {
            console.error('Load products error:', error);
            uiManager.showMessage('Failed to load products. Please check your connection.', 'error');
            this.products = [];
            this.displayProducts([]);
        } finally {
            uiManager.hideLoading();
        }
    }
    
    // In the displayProducts method, update the image section:
displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (!container) return;
    
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
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product._id || product.id}">
            <div class="product-image" style="height: 200px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px 8px 0 0;">
                ${product.images && product.images.length > 0 ? 
                    `<img src="${this.getImageUrl(product.images[0])}" alt="${product.title}" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"> 
                     <div class="image-placeholder" style="display: none; flex-direction: column; align-items: center; justify-content: center; color: #6c757d;">
                         <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                         <span>No Image</span>
                     </div>` : 
                    `<div class="image-placeholder" style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6c757d;">
                         <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                         <span>No Image</span>
                     </div>`
                }
            </div>
            <div class="product-info" style="padding: 1.5rem;">
                <h3 class="product-title" style="font-weight: 600; margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${this.escapeHtml(product.title)}</h3>
                <p class="product-price" style="font-size: 1.25rem; font-weight: 600; color: #4361ee; margin-bottom: 0.5rem;">₹${product.price}</p>
                <span class="product-category" style="display: inline-block; background: #e9ecef; color: #6c757d; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin-bottom: 1rem;">${this.formatCategory(product.category)}</span>
                <div class="product-seller" style="display: flex; align-items: center; gap: 0.5rem; color: #6c757d; font-size: 0.9rem;">
                    <i class="fas fa-user"></i>
                    <span>${product.seller?.name || 'Unknown Seller'}</span>
                    <div class="seller-rating">
                        ${this.generateStarRating(product.seller?.rating)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click events
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-id');
            const product = this.products.find(p => (p._id || p.id) === productId);
            if (product) {
                uiManager.showProductDetail(product);
            }
        });
    });
}

// Add this helper method
getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
        return imagePath;
    } else if (imagePath.startsWith('/')) {
        return `http://localhost:5000${imagePath}`;
    } else {
        return `http://localhost:5000/uploads/${imagePath}`;
    }
}
    
    escapeHtml(text) {
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
    
    applySearch() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
        this.filters.search = searchTerm;
        this.applyAllFilters();
    }
    
    applyFilters() {
        const category = document.getElementById('category-filter').value;
        const minPrice = document.getElementById('price-min').value;
        const maxPrice = document.getElementById('price-max').value;
        
        this.filters.category = category;
        this.filters.minPrice = minPrice;
        this.filters.maxPrice = maxPrice;
        
        this.applyAllFilters();
    }
    
    resetFilters() {
        // Reset filter values
        document.getElementById('search-input').value = '';
        document.getElementById('category-filter').value = '';
        document.getElementById('price-min').value = '';
        document.getElementById('price-max').value = '';
        
        // Reset filter state
        this.filters = {
            category: '',
            minPrice: '',
            maxPrice: '',
            search: ''
        };
        
        // Reload all products
        this.loadProducts();
    }
    
    applyAllFilters() {
        // For now, we'll reload from server with filters
        // This is more efficient than client-side filtering for large datasets
        this.loadProducts();
    }
    
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
        const condition = document.getElementById('product-condition').value;
        
        console.log('Form data:', { title, description, price, category, meetupLocation });
        
        // Validation
        if (!title || !description || !price || !category || !meetupLocation) {
            uiManager.showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        if (price <= 0) {
            uiManager.showMessage('Price must be greater than 0', 'error');
            return;
        }
        
        try {
            uiManager.showLoading();
            
            const token = authManager.getAuthToken();
            const productData = {
                title,
                description,
                price: parseFloat(price),
                category,
                meetupLocation,
                condition: condition || 'good'
            };
            
            console.log('Sending product data:', productData);
            
            const response = await fetch(`${this.API_BASE}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            
            const data = await response.json();
            
            console.log('Backend response:', data);
            
            if (!response.ok) {
                // Show actual validation errors from backend
                if (data.errors) {
                    const errorMessages = data.errors.map(error => error.msg).join(', ');
                    throw new Error(`Validation failed: ${errorMessages}`);
                }
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            if (data.success) {
                uiManager.showMessage('Product listed successfully!');
                this.resetSellForm();
                
                // Navigate to find page and reload products
                uiManager.navigateToPage('find');
                setTimeout(() => {
                    this.loadProducts();
                }, 500);
                
            } else {
                throw new Error(data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Sell product error:', error);
            uiManager.showMessage(error.message || 'Failed to list product. Please try again.', 'error');
        } finally {
            uiManager.hideLoading();
        }
    }
    
    resetSellForm() {
        document.getElementById('sell-form').reset();
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = '';
        }
    }
    
    async getUserProducts(userId) {
        try {
            const token = authManager.getAuthToken();
            const response = await fetch(`${this.API_BASE}/users/${userId}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.products || [];
            } else {
                console.error('Failed to fetch user products:', data.message);
                return [];
            }
        } catch (error) {
            console.error('Get user products error:', error);
            return [];
        }
    }
    
    async markAsSold(productId) {
        try {
            const token = authManager.getAuthToken();
            const response = await fetch(`${this.API_BASE}/products/${productId}/sold`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                uiManager.showMessage('Product marked as sold');
                return true;
            } else {
                uiManager.showMessage(data.message || 'Failed to update product', 'error');
                return false;
            }
        } catch (error) {
            console.error('Mark as sold error:', error);
            uiManager.showMessage('Failed to update product. Please try again.', 'error');
            return false;
        }
    }
    
    async deleteProduct(productId) {
        try {
            const token = authManager.getAuthToken();
            const response = await fetch(`${this.API_BASE}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                uiManager.showMessage('Product deleted successfully');
                return true;
            } else {
                uiManager.showMessage(data.message || 'Failed to delete product', 'error');
                return false;
            }
        } catch (error) {
            console.error('Delete product error:', error);
            uiManager.showMessage('Failed to delete product. Please try again.', 'error');
            return false;
        }
    }
    
    async getProductById(productId) {
        try {
            const response = await fetch(`${this.API_BASE}/products/${productId}`);
            const data = await response.json();
            
            if (data.success) {
                return data.product;
            } else {
                console.error('Failed to fetch product:', data.message);
                return null;
            }
        } catch (error) {
            console.error('Get product error:', error);
            return null;
        }
    }
}

// Initialize Product Manager
const productManager = new ProductManager();