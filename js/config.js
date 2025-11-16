// Configuration for different environments
class Config {
    static get API_BASE() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000/api';
        } else {
            return 'https://free-sale-backend.onrender.com/api';
        }
    }
    
    static get UPLOADS_BASE() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000/uploads'; // Correct path
        } else {
            return 'https://free-sale-backend.onrender.com/uploads'; // Correct path
        }
    }
    
    static get SOCKET_URL() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000';
        } else {
            return 'https://free-sale-backend.onrender.com';
        }
    }
    
    // Test if backend is available
    static async testBackend() {
        try {
            const response = await fetch(`${this.API_BASE}/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}