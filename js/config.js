// Configuration for different environments
class Config {
    static get API_BASE() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000/api'; // Development
        } else {
            return 'https://free-sale-backend.onrender.com/api'; // Production
        }
    }
    
    static get UPLOADS_BASE() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000/uploads'; // Development
        } else {
            return 'https://free-sale-backend.onrender.com/uploads'; // Production
        }
    }
}