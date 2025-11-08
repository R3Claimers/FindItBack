# 🧭 FindItBack - Lost & Found Platform

A comprehensive web-based Lost and Found management system built with the **MERN Stack** (MongoDB, Express, React, Node.js), **Firebase Authentication**, and **Cloudinary** for image storage. The platform helps users post lost or found items and uses an intelligent matching algorithm to suggest potential matches.

## ✨ Features

### 🔐 Authentication

- **Email/Password** authentication with Firebase
- **Google Sign-In** integration
- Secure Firebase Auth with JWT tokens
- **Change Password** functionality
- Protected routes with unauthorized access warnings

### 📦 Item Management

- **Post Lost Items** with details (title, description, category, location, date, images)
- **Post Found Items** with comprehensive details
- **Edit & Delete** your own posts
- **Mark items** as resolved/returned
- **Image Upload** to Cloudinary (max 5 images, 5MB each, auto-resize to 1000x1000)
- **Multiple image support** with preview

### 💬 Comments System

- **Add comments** on any lost/found post
- **Delete your own comments**
- **User avatars** with initials
- **Relative timestamps** (e.g., "2 hours ago")
- **Character limit** (500 characters)

### 🔍 Search & Filter

- **Global Search** across all items
- **Advanced Filters**: Category, Location, Date range, Status
- **Tab-based view** (All, Lost Items, Found Items)
- **Pagination** for performance
- **Real-time Results**

### 👤 User Profile

- **Profile Management**: View/Edit name, phone, bio
- **Change Password** with re-authentication
- **My Posts Section**: View all your lost and found items
- **Edit/Delete Posts** directly from profile

### 🎯 Smart Matching Algorithm

- **AI-Powered Matching** between lost and found items
- **Multi-Factor Scoring**:
  - Category match (30%)
  - Location similarity (25%)
  - Date proximity (20%)
  - Title similarity (15%)
  - Description similarity (10%)
- **Customizable** minimum match score
- **Detailed Match Breakdown** for transparency

### 🎨 Beautiful UI

- **Modern Design** with Cyan/Teal & gradient theme
- **Dark Mode** support with theme toggle
- **Responsive** across all devices
- **Smooth Animations** and animated gradient flares
- **Intuitive Navigation** (Home, Posts, Post Item, Profile)
- **Toast Notifications** for user feedback
- **Loading Overlays** to prevent duplicate submissions
- **HSL-based Design System** for consistency

## 🏗️ Architecture

### Backend (Node.js + Express)

```
backend/
├── src/
│   ├── config/          # MongoDB & Firebase setup
│   ├── controllers/     # Request handlers (MVC)
│   ├── services/        # Business logic layer
│   ├── repositories/    # Database queries
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── middlewares/     # Auth, validation, errors
│   ├── utils/           # Helpers & matching algorithm
│   └── app.js           # Express app
└── package.json
```

### Frontend (React + Vite)

```
frontend/
├── index.html           # Entry HTML (root level)
├── vite.config.js       # Vite configuration
├── .eslintrc.cjs       # ESLint config
├── src/
│   ├── components/      # Reusable UI components (.jsx)
│   ├── pages/           # Route pages (.jsx)
│   ├── context/         # Auth & Theme context (.jsx)
│   ├── services/        # API services (.jsx)
│   ├── config/          # Firebase config
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main app
│   └── index.jsx        # Entry point
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB Atlas** account
- **Firebase** project
- **Git**

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd finditback
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/finditback

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Cloudinary Configuration
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_URL=cloudinary://api-key:api-secret@cloud-name

# CORS
CORS_ORIGIN=http://localhost:3000

# API Configuration
API_PREFIX=/api/v1
```

Start backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_API_URL=http://localhost:5000/api/v1
```

Start frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

> **Note**: We use **Vite** for lightning-fast development! Server starts in <1 second with instant HMR.

## 🔧 Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password** & **Google**
4. Get **Web App** credentials for frontend (.env)
5. Generate **Service Account** key for backend (.env)

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your IP address (0.0.0.0/0 for development)
5. Get connection string and update MONGODB_URI

### Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to backend `.env` file
5. Images will be automatically uploaded to `finditback/items` folder
6. Features:
   - Auto-resize to 1000x1000 (maintains aspect ratio)
   - Max 5 images per post
   - 5MB per image limit
   - Supported formats: JPG, JPEG, PNG, GIF, WEBP

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

All protected endpoints require:

```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

#### Users

- `POST /users` - Create/update user profile
- `GET /users/me` - Get current user
- `PUT /users/me` - Update profile
- `POST /users/change-password` - Change password
- `DELETE /users/me` - Delete account

#### Lost Items

- `POST /lost-items` - Create lost item (with image upload)
- `GET /lost-items` - Get all (with filters)
- `GET /lost-items/:id` - Get by ID
- `GET /lost-items/my-items` - Get user's items
- `PUT /lost-items/:id` - Update item (with image upload)
- `DELETE /lost-items/:id` - Delete item
- `PATCH /lost-items/:id/resolve` - Mark as resolved
- `GET /lost-items/search?q=query` - Search

#### Found Items

- Same endpoints as Lost Items, replace `/lost-items` with `/found-items`
- `PATCH /found-items/:id/return` - Mark as returned

#### Comments

- `POST /comments` - Add comment to post
- `GET /comments/:itemId` - Get all comments for an item
- `DELETE /comments/:id` - Delete your comment

#### Matches

- `GET /matches` - Get all matches
- `GET /matches/my-lost-items` - User's lost item matches
- `GET /matches/my-found-items` - User's found item matches
- `GET /matches/lost/:id` - Matches for specific lost item
- `GET /matches/found/:id` - Matches for specific found item

## 🎨 Tech Stack

### Frontend

- **React** 18 - UI library
- **Vite** 5 - Build tool (⚡ Lightning fast!)
- **React Router** v6 - Routing
- **Tailwind CSS** - Styling with custom HSL theme
- **Firebase** - Authentication
- **Cloudinary** - Image storage (via backend)
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **date-fns** - Date formatting

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Firebase Admin** - Auth verification
- **Cloudinary** - Image upload/storage
- **Multer** - File upload middleware
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Morgan** - HTTP logger
- **Compression** - Response compression
- **Rate Limiting** - API protection

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Render/Railway/Heroku)

1. Connect GitHub repository
2. Set environment variables
3. Deploy!

### Frontend (Vercel/Netlify)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables (use `VITE_` prefix)
5. Deploy!

### Database (MongoDB Atlas)

Already cloud-hosted ✅

## ⚡ Performance

### Development Speed

- **Vite Dev Server**: Starts in <1 second
- **Hot Module Replacement**: <100ms updates
- **Build Time**: ~20 seconds (3x faster than CRA)

## 📈 Future Enhancements

- [ ] In-app chat system
- [ ] Push notifications
- [ ] Map integration with geolocation
- [ ] Image recognition for better matching
- [ ] Admin dashboard
- [ ] Reward system
- [ ] Analytics and insights
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Multi-language support
- [ ] PWA (Progressive Web App) support

## 🎨 Design System

- **Primary Colors**: Cyan/Teal gradient (HSL based)
- **Animations**: Gradient flares with smooth transitions
- **Dark Mode**: Full support with persistent theme storage
- **Responsive**: Mobile-first design approach
- **Transitions**: Smooth cubic-bezier animations
- **Components**: Reusable card system with hover effects

## 📱 Pages & Features

### Home Page

- Hero section with animated gradient background
- Call-to-action buttons
- Statistics overview

### Posts/Search Page

- Tabbed interface (All, Lost Items, Found Items)
- Advanced search with filters
- Category dropdown
- Pagination support

### Post Item Page

- Form wizard for lost/found items
- Multi-image upload with preview
- Image removal capability
- Real-time validation
- Loading overlay during submission

### Profile Page

- Three tabs: Profile, Change Password, My Posts
- Edit profile information
- Secure password change with re-authentication
- View/Edit/Delete your posts with action buttons

### Item Detail Pages

- Full item details with image gallery
- Comments section
- Contact information
- Edit/Delete buttons (for owners)
- Report functionality

## 🔒 Security Features

- Firebase JWT token authentication
- Protected API routes
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet security headers
- Password hashing (Firebase handled)
- Secure password change with re-authentication
- Cloudinary secure image URLs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## � Team

- **Developer**: Nitesh Sachde
- **GitHub**: [@Nitesh-Sachde](https://github.com/Nitesh-Sachde)

## 🙏 Acknowledgments

- Firebase for authentication & storage
- MongoDB Atlas for database hosting
- Vite for blazing-fast development
- Tailwind CSS for modern styling
- All open-source contributors

---

**Made with ❤️ using the MERN Stack + Vite**

_Let's reunite people with their lost belongings!_ 🎯
