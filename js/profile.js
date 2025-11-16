// Profile Management
class ProfileManager {
    static API_BASE = 'http://localhost:5000/api';
    
    static async loadUserProfile() {
        if (!authManager.isLoggedIn || !authManager.isLoggedIn()) return;
        
        const user = authManager.getCurrentUser();
        if (user) {
            document.getElementById('profile-name').textContent = user.name;
            document.getElementById('profile-college').textContent = user.college || 'College not set';
            document.getElementById('profile-rating-value').textContent = user.rating || 'No ratings';
        }
    }
    
    static async loadUserListings() {
        if (!authManager.isLoggedIn || !authManager.isLoggedIn()) return;
        
        try {
            const token = authManager.getAuthToken();
            const user = authManager.getCurrentUser();
            
            const response = await fetch(`${this.API_BASE}/users/${user.id}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayUserListings(data.products);
            } else {
                console.error('Failed to load user listings:', data.message);
            }
        } catch (error) {
            console.error('Load user listings error:', error);
        }
    }
    
    static displayUserListings(products) {
        const container = document.getElementById('user-listings');
        if (!container) return;
        
        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="no-listings" style="text-align: center; padding: 3rem; color: #6c757d;">
                    <i class="fas fa-tag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3 style="color: #495057; margin-bottom: 0.5rem;">No listings yet</h3>
                    <p style="margin-bottom: 1.5rem;">Start selling your items to other students</p>
                    <button class="btn-primary" onclick="uiManager.navigateToPage('sell')">
                        Sell an Item
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="listing-card" data-id="${product._id}" style="background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; gap: 1rem; align-items: start;">
                    <div class="listing-image" style="width: 100px; height: 100px; background: #e9ecef; border-radius: 4px; overflow: hidden;">
                        ${product.images && product.images.length > 0 ? 
                            `<img src="${product.images[0]}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                            `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6c757d;">
                                <i class="fas fa-image"></i>
                            </div>`
                        }
                    </div>
                    <div style="flex: 1;">
                        <h3 style="margin-bottom: 0.5rem; color: #212529;">${product.title}</h3>
                        <p class="listing-price" style="font-size: 1.25rem; font-weight: 600; color: #4361ee; margin-bottom: 0.5rem;">₹${product.price}</p>
                        <span class="listing-category" style="background: #e9ecef; color: #6c757d; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin-right: 0.5rem;">
                            ${product.category}
                        </span>
                        <span class="listing-status ${product.status}" style="background: ${product.status === 'active' ? '#28a745' : '#dc3545'}; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">
                            ${product.status}
                        </span>
                    </div>
                    <div class="listing-actions" style="display: flex; gap: 0.5rem; flex-direction: column;">
                        <button class="btn-outline btn-small edit-listing" data-id="${product._id}" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        ${product.status === 'active' ? 
                            `<button class="btn-outline btn-small mark-sold" data-id="${product._id}" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                                <i class="fas fa-check"></i> Mark Sold
                            </button>` : ''
                        }
                        <button class="btn-outline btn-small delete-listing" data-id="${product._id}" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        this.attachListingEventListeners();
    }
    
    static attachListingEventListeners() {
        // Edit listing
        document.querySelectorAll('.edit-listing').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.getAttribute('data-id');
                this.editListing(productId);
            });
        });
        
        // Mark as sold
        document.querySelectorAll('.mark-sold').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.getAttribute('data-id');
                this.markAsSold(productId);
            });
        });
        
        // Delete listing
        document.querySelectorAll('.delete-listing').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.getAttribute('data-id');
                this.deleteListing(productId);
            });
        });
    }
    
    static editListing(productId) {
        uiManager.showMessage('Edit functionality coming soon!');
    }
    
    static async markAsSold(productId) {
        if (confirm('Are you sure you want to mark this item as sold?')) {
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
                    uiManager.showMessage('Item marked as sold');
                    this.loadUserListings();
                } else {
                    uiManager.showMessage(data.message || 'Failed to update item', 'error');
                }
            } catch (error) {
                console.error('Mark as sold error:', error);
                uiManager.showMessage('Failed to update item', 'error');
            }
        }
    }
    
    static async deleteListing(productId) {
        if (confirm('Are you sure you want to delete this listing?')) {
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
                    uiManager.showMessage('Listing deleted');
                    this.loadUserListings();
                } else {
                    uiManager.showMessage(data.message || 'Failed to delete listing', 'error');
                }
            } catch (error) {
                console.error('Delete listing error:', error);
                uiManager.showMessage('Failed to delete listing', 'error');
            }
        }
    }
}