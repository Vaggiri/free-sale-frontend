// Profile Management
class ProfileManager {
    static API_BASE = 'http://localhost:5000/api';
    
    static async loadUserProfile() {
        if (!authManager.isLoggedIn()) {
            console.log('❌ User not logged in for profile');
            return;
        }
        
        const user = authManager.getCurrentUser();
        console.log('👤 Loading user profile:', user);
        
        if (user) {
            const profileName = document.getElementById('profile-name');
            const profileCollege = document.getElementById('profile-college');
            const profileRating = document.getElementById('profile-rating-value');
            
            if (profileName) profileName.textContent = user.name;
            if (profileCollege) profileCollege.textContent = user.college || 'College not set';
            if (profileRating) profileRating.textContent = user.rating || 'No ratings';
        }
    }
    
    static async loadUserListings() {
        if (!authManager.isLoggedIn()) {
            console.log('❌ User not logged in for listings');
            this.displayUserListings([]);
            return;
        }
        
        try {
            const token = authManager.getAuthToken();
            
            if (!token) {
                console.error('❌ No authentication token found');
                this.displayUserListings([]);
                return;
            }
            
            console.log('🔄 Loading user listings with token...');
            
            // Use the correct endpoint that uses auth middleware (no user ID in URL)
            const response = await fetch(`${this.API_BASE}/users/profile/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📨 Profile products response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Profile products error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Profile products data:', data);
            
            if (data.success) {
                console.log(`✅ Loaded ${data.products ? data.products.length : 0} user listings`);
                this.displayUserListings(data.products || []);
            } else {
                console.error('❌ Failed to load user listings:', data.message);
                this.displayUserListings([]);
            }
        } catch (error) {
            console.error('❌ Load user listings error:', error);
            this.displayUserListings([]);
        }
    }
    
    static displayUserListings(products) {
        const container = document.getElementById('user-listings');
        if (!container) {
            console.error('❌ User listings container not found');
            return;
        }
        
        console.log('🎨 Displaying user listings:', products);
        
        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="no-listings" style="text-align: center; padding: 3rem; color: #6c757d; background: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <i class="fas fa-tag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3 style="color: #495057; margin-bottom: 0.5rem;">No listings yet</h3>
                    <p style="margin-bottom: 1.5rem; color: #6c757d;">Start selling your items to other students</p>
                    <button class="btn-primary" onclick="uiManager.navigateToPage('sell')" style="padding: 0.75rem 1.5rem;">
                        <i class="fas fa-plus"></i> Sell an Item
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="listing-card" data-id="${product._id}" style="background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
                <div style="display: flex; gap: 1.5rem; align-items: start;">
                    <!-- Product Image -->
                    <div class="listing-image" style="width: 120px; height: 120px; background: #f8f9fa; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                        ${product.images && product.images.length > 0 ? 
                            `<img src="http://localhost:5000/uploads/${product.images[0]}" alt="${product.title}" 
                                 style="width: 100%; height: 100%; object-fit: cover;"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                             <div style="display: none; align-items: center; justify-content: center; height: 100%; color: #6c757d; background: #e9ecef;">
                                 <i class="fas fa-image"></i>
                             </div>` : 
                            `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6c757d; background: #e9ecef;">
                                <i class="fas fa-image" style="font-size: 1.5rem;"></i>
                            </div>`
                        }
                    </div>
                    
                    <!-- Product Info -->
                    <div style="flex: 1;">
                        <h3 style="margin-bottom: 0.5rem; color: #212529; font-size: 1.2rem;">${product.title}</h3>
                        <p class="listing-price" style="font-size: 1.5rem; font-weight: 700; color: #4361ee; margin-bottom: 0.75rem;">₹${product.price}</p>
                        
                        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                            <span class="listing-category" style="background: #e9ecef; color: #6c757d; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">
                                <i class="fas fa-tag"></i> ${this.formatCategory(product.category)}
                            </span>
                            <span class="listing-status ${product.status}" style="background: ${product.status === 'active' ? '#28a745' : '#dc3545'}; color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">
                                <i class="fas fa-circle"></i> ${product.status}
                            </span>
                        </div>
                        
                        <div style="color: #6c757d; font-size: 0.9rem;">
                            <p style="margin-bottom: 0.25rem;"><i class="fas fa-map-marker-alt"></i> Meet at: ${this.formatLocation(product.meetupLocation)}</p>
                            <p style="margin-bottom: 0.25rem;"><i class="fas fa-calendar"></i> Listed: ${new Date(product.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="listing-actions" style="display: flex; gap: 0.5rem; flex-direction: column; min-width: 120px;">
                        <button class="btn-outline btn-small edit-listing" data-id="${product._id}" 
                                style="padding: 0.6rem 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        ${product.status === 'active' ? 
                            `<button class="btn-outline btn-small mark-sold" data-id="${product._id}" 
                                    style="padding: 0.6rem 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; justify-content: center; background: #28a745; color: white; border: none;">
                                <i class="fas fa-check"></i> Mark Sold
                            </button>` : 
                            `<button class="btn-outline btn-small" style="padding: 0.6rem 1rem; font-size: 0.85rem; background: #6c757d; color: white; border: none; cursor: not-allowed;" disabled>
                                <i class="fas fa-check"></i> Sold
                            </button>`
                        }
                        <button class="btn-outline btn-small delete-listing" data-id="${product._id}" 
                                style="padding: 0.6rem 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; justify-content: center; background: #dc3545; color: white; border: none;">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        this.attachListingEventListeners();
    }
    
    static formatCategory(category) {
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
    
    static formatLocation(location) {
        const locationMap = {
            'canteen': 'College Canteen',
            'library': 'Library Entrance',
            'main-gate': 'Main Gate',
            'hostel': 'Hostel Common Area',
            'other': 'Other Location'
        };
        return locationMap[location] || location;
    }
    
    static attachListingEventListeners() {
        // Edit listing
        document.querySelectorAll('.edit-listing').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.getAttribute('data-id');
                console.log('✏️ Edit listing:', productId);
                this.editListing(productId);
            });
        });
        
        // Mark as sold
        document.querySelectorAll('.mark-sold').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.getAttribute('data-id');
                console.log('✅ Mark as sold:', productId);
                this.markAsSold(productId);
            });
        });
        
        // Delete listing
        document.querySelectorAll('.delete-listing').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.getAttribute('data-id');
                console.log('🗑️ Delete listing:', productId);
                this.deleteListing(productId);
            });
        });
    }
    
    static editListing(productId) {
        uiManager.showMessage('Edit functionality coming soon!');
        // You can implement edit functionality here
        // For now, just show a message
    }
    
    static async markAsSold(productId) {
        if (confirm('Are you sure you want to mark this item as sold? This action cannot be undone.')) {
            try {
                uiManager.showLoading();
                const token = authManager.getAuthToken();
                
                const response = await fetch(`${this.API_BASE}/products/${productId}/sold`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    uiManager.showMessage('✅ Item marked as sold successfully!');
                    // Reload the listings to reflect the change
                    setTimeout(() => {
                        this.loadUserListings();
                    }, 1000);
                } else {
                    uiManager.showMessage(data.message || 'Failed to update item', 'error');
                }
            } catch (error) {
                console.error('Mark as sold error:', error);
                uiManager.showMessage('Failed to update item. Please try again.', 'error');
            } finally {
                uiManager.hideLoading();
            }
        }
    }
    
    static async deleteListing(productId) {
        if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                uiManager.showLoading();
                const token = authManager.getAuthToken();
                
                const response = await fetch(`${this.API_BASE}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    uiManager.showMessage('✅ Listing deleted successfully!');
                    // Reload the listings to reflect the change
                    setTimeout(() => {
                        this.loadUserListings();
                    }, 1000);
                } else {
                    uiManager.showMessage(data.message || 'Failed to delete listing', 'error');
                }
            } catch (error) {
                console.error('Delete listing error:', error);
                uiManager.showMessage('Failed to delete listing. Please try again.', 'error');
            } finally {
                uiManager.hideLoading();
            }
        }
    }
    
    // Debug method to check auth status
    static debugAuthStatus() {
        console.log('=== 🔐 AUTH DEBUG ===');
        console.log('Is logged in:', authManager.isLoggedIn());
        console.log('Current user:', authManager.getCurrentUser());
        console.log('User ID:', authManager.getUserId());
        console.log('Token exists:', !!authManager.getAuthToken());
        console.log('====================');
    }
}

// Add global helper for debugging
window.debugProfile = () => {
    ProfileManager.debugAuthStatus();
    ProfileManager.loadUserListings();
};