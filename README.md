# 🎓 CampusTrade - College Marketplace

<div align="center">

![CampusTrade Logo](frontend/assets/logo.png)

**A secure, student-only marketplace platform for college campuses**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://campus-trade-amrita.netlify.app)
[![Backend API](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge)](https://free-sale-backend.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Deployment](#-live-deployment)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [Developer](#-developer)
- [License](#-license)

---

## 🌟 Overview

**CampusTrade** is a comprehensive college marketplace platform designed exclusively for **Amrita Vishwa Vidyapeetham** students. It provides a secure, verified environment where students can buy and sell textbooks, electronics, bicycles, hostel items, and other campus essentials with ease.

### 🎯 Key Highlights

- ✅ **College Email Verification** - Only verified Amrita students can join
- 🔒 **Secure Transactions** - Predefined campus meetup locations
- ⭐ **Ratings & Reviews** - Community-driven trust system
- 💬 **Real-time Notifications** - Instant updates via WebSocket
- 📱 **Responsive Design** - Optimized for mobile and desktop
- 🚀 **Fast & Reliable** - Production-grade deployment on Render & Netlify

---

## ✨ Features

### For Buyers
- 🔍 **Advanced Search & Filters** - Find exactly what you need by category, price range
- 📸 **High-Quality Product Images** - Multiple images per listing
- 💬 **Direct WhatsApp Contact** - Seamless communication with sellers
- ⭐ **Seller Ratings** - Make informed decisions based on reviews
- 📍 **Campus Meetup Locations** - Safe transaction points within campus

### For Sellers
- 📝 **Easy Listing Creation** - Simple, intuitive form to upload products
- 🖼️ **Multi-Image Upload** - Showcase products from multiple angles
- 📱 **WhatsApp Integration** - Automatic contact via WhatsApp number
- 📊 **Listing Management** - Track all your active listings
- ✏️ **Edit & Delete** - Full control over your listings

### Security & Trust
- 🎓 **Student Verification** - College email authentication
- 🏛️ **Safe Meetup Points** - Predefined campus locations (Canteen, Library, Main Gate, Hostel)
- ⭐ **Review System** - Post-transaction ratings and feedback
- 🔐 **JWT Authentication** - Secure user sessions
- 🛡️ **Data Protection** - Industry-standard security with Helmet.js

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Markup & Structure | - |
| **CSS3** | Styling & Animations | - |
| **Vanilla JavaScript** | Client-side Logic | ES6+ |
| **Font Awesome** | Icons | 6.4.0 |
| **Google Fonts (Poppins)** | Typography | - |
| **Socket.io Client** | Real-time Communication | 4.7.2 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | ≥18.0.0 |
| **Express.js** | Web Framework | ^4.18.2 |
| **MongoDB Atlas** | Database (Cloud) | - |
| **Mongoose** | ODM for MongoDB | ^7.5.0 |
| **Socket.io** | WebSocket Server | ^4.7.2 |
| **JWT** | Authentication | ^9.0.2 |
| **Bcrypt.js** | Password Hashing | ^2.4.3 |
| **Multer** | File Upload Handling | ^1.4.5 |
| **Helmet.js** | Security Headers | ^7.0.0 |
| **CORS** | Cross-Origin Resource Sharing | ^2.8.5 |
| **Compression** | Response Compression | ^1.7.4 |
| **Express Validator** | Input Validation | ^7.0.1 |

### DevOps & Deployment
| Service | Purpose | Status |
|---------|---------|--------|
| **Netlify** | Frontend Hosting | ✅ Live |
| **Render** | Backend Hosting | ✅ Live |
| **MongoDB Atlas** | Database Hosting | ✅ Active |
| **Git** | Version Control | ✅ Active |

---

## 🌐 Live Deployment

### 🎨 Frontend (Netlify)
- **URL**: [https://campus-trade-amrita.netlify.app](https://campus-trade-amrita.netlify.app)
- **Status**: ✅ **Active**
- **CDN**: Global edge network for fast loading
- **SSL**: Automatic HTTPS encryption

### ⚙️ Backend (Render)
- **API URL**: [https://free-sale-backend.onrender.com](https://free-sale-backend.onrender.com)
- **Health Check**: [/api/health](https://free-sale-backend.onrender.com/api/health)
- **Status**: ✅ **Active**
- **Region**: Automatic deployment from Git
- **Features**: Auto-scaling, Zero downtime deployments

### 💾 Database (MongoDB Atlas)
- **Provider**: MongoDB Atlas (Cloud)
- **Region**: Asia-Pacific
- **Cluster**: Shared M0 (Free Tier)
- **Status**: ✅ **Connected**

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend API    │         │   MongoDB       │
│   (Netlify)     │ ◄─────► │   (Render)       │ ◄─────► │   Atlas         │
│                 │ HTTP/WS │                  │  Mongoose│                 │
│  - HTML/CSS/JS  │         │  - Express.js    │         │  - Users        │
│  - Socket.io    │         │  - Socket.io     │         │  - Products     │
│  - UI/UX        │         │  - JWT Auth      │         │  - Reviews      │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - User registration with college email
- `POST /login` - User login & JWT token generation
- `GET /me` - Get current user profile

#### Products (`/api/products`)
- `GET /` - Get all products (with filters)
- `GET /:id` - Get single product details
- `POST /` - Create new product listing
- `PUT /:id` - Update product listing
- `DELETE /:id` - Delete product listing
- `GET /user/:userId` - Get user's listings

#### Users (`/api/users`)
- `GET /:id` - Get user profile
- `PUT /:id` - Update user profile
- `GET /:id/reviews` - Get user reviews

#### System
- `GET /api/health` - Health check endpoint
- `GET /api/cors-test` - CORS configuration test

---

## 💻 Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local) or **MongoDB Atlas** account
- **Git**

### Clone the Repository
```bash
git clone https://github.com/yourusername/FreeSale.git
cd FreeSale
```

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
NODE_ENV=development
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret_min_32_characters
CLIENT_URL=http://localhost:5500
```

4. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:10000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Update API Configuration**

Edit `frontend/js/config.js`:
```javascript
const API_BASE_URL = 'http://localhost:10000/api';
```

3. **Serve the frontend**

Using **Live Server** (VS Code Extension):
- Right-click `index.html`
- Select "Open with Live Server"

Or using **Python**:
```bash
python -m http.server 5500
```

The frontend will be available at `http://localhost:5500`

---

## 📚 API Documentation

### Authentication Headers
```javascript
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

### Example Request: Create Product
```javascript
POST /api/products
Content-Type: multipart/form-data

{
  "title": "Calculus Textbook, 2nd Edition",
  "description": "Excellent condition, minimal markings",
  "price": 500,
  "category": "books",
  "condition": "like-new",
  "meetupLocation": "library",
  "images": [File, File]
}
```

### Example Response: Product List
```json
{
  "success": true,
  "count": 25,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Calculus Textbook",
      "price": 500,
      "category": "books",
      "condition": "like-new",
      "seller": {
        "name": "Girisudhan V",
        "college": "Amrita Vishwa Vidyapeetham",
        "whatsapp": "+919876543210"
      },
      "images": ["/uploads/product-1234567890.jpg"],
      "createdAt": "2026-01-27T14:00:00.000Z"
    }
  ]
}
```

---

## 📸 Screenshots

### Home Page
Beautiful hero section with floating category cards and feature highlights.

### Find Items Page
Advanced search with filters by category, price range, and condition.

### Sell Page
Easy-to-use form with multi-image upload and predefined meetup locations.

### Profile Page
View your listings, reviews, and ratings all in one place.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 👨‍💻 Developer

<div align="center">

**Developed with 💖 by [Girisudhan V](https://github.com/yourusername)**

*2nd Year ECE, Amrita Vishwa Vidyapeetham*

[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=for-the-badge&logo=github)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/yourprofile)

</div>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Amrita Vishwa Vidyapeetham** - For inspiration and campus community
- **MongoDB Atlas** - For reliable cloud database hosting
- **Render** - For seamless backend deployment
- **Netlify** - For fast frontend hosting
- **Font Awesome** - For beautiful icons
- **Google Fonts** - For Poppins typography

---

## 📞 Support

For support, email your.email@example.com or create an issue in the repository.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for the campus community

</div>
