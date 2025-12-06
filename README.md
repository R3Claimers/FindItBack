# 🧭 FindItBack - Lost & Found Platform

A comprehensive web-based Lost and Found management system built with the **MERN Stack** (MongoDB, Express, React, Node.js), **Firebase Authentication**, and **Cloudinary** for image storage. The platform helps users post lost or found items, comment, search, filter, and manage their posts securely.

## ✨ Features

### 🔐 Authentication

- **Email/Password** authentication with Firebase
- **Google Sign-In** integration
- Secure Firebase Auth with JWT tokens
- **Change Password** functionality with re-authentication
- Protected routes with unauthorized access warnings
- Persistent authentication state across sessions

### 📦 Item Management

- **Post Lost Items** with comprehensive details (title, description, category, location, date, images)
- **Post Found Items** with all relevant information
- **Edit & Delete** your own posts with confirmation modals
- **Mark items** as found/returned with status updates
- **Image Upload** to Cloudinary (max 5 images, 5MB each, auto-resize to 1000x1000)
- **Multiple image support** with gallery preview and navigation
- **Optional images** for lost items, required for found items
- **Category badges** with color-coded classification
- **Status indicators** (Open, Found, Available, Returned)
- **Date picker** with current date validation

### 💬 Comments System

- **Add comments** on any lost/found post
- **Delete your own comments** with confirmation
- **User avatars** with initials fallback
- **Relative timestamps** (e.g., "2 hours ago")
- **Character limit** (500 characters)
- **Real-time updates** with optimistic UI
- **Responsive comment cards** with proper spacing

### 🔍 Search & Filter

- **Global Search** across all items by title, description, or location
- **Collapsible Advanced Filters** to save space:
  - Category filter (All, Electronics, Documents, Keys, Bags, Wallets, Jewelry, Clothing, Pets, Other)
  - Date range filters (From/To)
  - Sort options (Newest First, Oldest First, Recent Activity)
- **Tab-based view** (All Items, Lost, Found) with item counts
- **Active filter indicator** badge
- **Clear all filters** button
- **Responsive filter panel** (stacks vertically on mobile)
- **Real-time Results** with instant filtering

### 👤 User Profile

- **Profile Management**: View/Edit name, phone, bio
- **Change Password** with secure re-authentication
- **My Posts Section**: Tabbed view of your lost and found items
- **Edit/Delete Posts** directly from profile
- **Responsive profile cards**


### 🚨 Reporting System

- **Report inappropriate posts** with predefined reasons
- **Report categories**: Spam, Inappropriate Content, Fraud/Scam, Duplicate Post, Other
- **Additional details** text field for context
- **Backend tracking** of reported items
- **Modal-based reporting UI**

### 🎨 Beautiful UI/UX

- **Modern Design** with Cyan gradient theme
- **Dark Mode** support with persistent theme toggle
- **Fully Responsive** design across all devices (mobile-first approach)
- **Smooth Animations** and transitions
- **Animated gradient backgrounds** with flare effects
- **Intuitive Navigation** with active route highlighting
- **Toast Notifications** for all user actions
- **Loading States** with spinners and overlays
- **Confirmation Modals** for destructive actions
- **HSL-based Color System** for consistent theming
- **Mobile-optimized layouts**:
  - Collapsible navbar menu
  - Hidden brand text on small screens (landing page)
  - Responsive text sizes
  - Touch-friendly buttons
  - Optimized filter panels
- **Image Gallery** with lightbox functionality
- **Lazy loading** and performance optimizations

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

#### Reports

- `POST /reports` - Report a post (lost or found item)
- `GET /reports` - Get all reports (admin)
- `GET /reports/:id` - Get report by ID
- `PATCH /reports/:id/status` - Update report status

## 🎨 Tech Stack

### Frontend

- **React** 18 - UI library with hooks
- **Vite** 5 - Build tool (⚡ Lightning fast HMR!)
- **React Router** v6 - Client-side routing with protected routes
- **Tailwind CSS** 3 - Utility-first CSS with custom HSL theme
- **Firebase** 10 - Authentication (Email/Password, Google Sign-In)
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library (500+ icons)
- **date-fns** - Lightweight date formatting and manipulation
- **Context API** - State management (Auth, Theme, Loading)
- **PostCSS** - CSS processing with autoprefixer
- **ESLint** - Code linting and quality checks

### Backend

- **Node.js** 18+ - JavaScript runtime
- **Express** 4 - Fast web framework with middleware support
- **MongoDB** 6+ - NoSQL database
- **Mongoose** 8 - ODM with schema validation
- **Firebase Admin SDK** - Server-side auth verification
- **Cloudinary SDK** - Image upload, storage, and transformation
- **Multer** - Multipart/form-data file upload
- **Express Validator** - Request validation middleware
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Compression** - Response compression (gzip)
- **Express Rate Limit** - API rate limiting protection
- **dotenv** - Environment variable management
- **Nodemon** - Auto-restart during development

### Database Models

- **User** - Profile information, authentication data
- **LostItem** - Lost item posts with images and location
- **FoundItem** - Found item posts with details
- **Comment** - User comments on posts
- **Report** - Reported posts with reason and status

### Development Tools

- **VS Code** - Recommended IDE
- **Git** - Version control
- **npm** - Package manager
- **Postman** - API testing
- **MongoDB Compass** - Database GUI

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test


## 🚀 Deployment

### Backend (AWS)

1. Connect GitHub repository
2. Set environment variables
3. Deploy!

### Frontend (Vercel)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables (use `VITE_` prefix)
5. Deploy!

### Database (MongoDB Atlas)

Already cloud-hosted ✅

## ⚡ Performance & Optimization

### Development Speed

- **Vite Dev Server**: Starts in <1 second with ES modules
- **Hot Module Replacement (HMR)**: <100ms instant updates
- **Build Time**: ~20 seconds (3x faster than Create React App)
- **Code Splitting**: Automatic route-based splitting

### Production Optimizations

- **Image Optimization**: Cloudinary auto-resize to 1000x1000, maintains aspect ratio
- **Lazy Loading**: Images and routes loaded on demand
- **Response Compression**: gzip compression on API responses
- **Database Indexing**: Optimized queries with indexes on frequently searched fields
- **Caching**: Static assets cached with proper headers
- **Minification**: JS/CSS minified in production build
- **Tree Shaking**: Unused code eliminated from bundle
- **API Rate Limiting**: Prevents abuse and ensures stability (100 req/15min)

### Best Practices

- **Repository Pattern**: Clean separation of data access layer
- **Service Layer**: Business logic isolated from controllers
- **Error Handling**: Centralized error handling middleware
- **Input Validation**: All user inputs validated and sanitized
- **Mobile-First Design**: Responsive layouts optimized for mobile
- **Accessibility**: Semantic HTML and ARIA labels
- **SEO-Friendly**: Meta tags and proper document structure

## 📈 Future Enhancements

- [ ] In-app chat system between users
- [ ] Push notifications for matches
- [ ] Map integration with geolocation and radius search
- [ ] Map Location on Item Detail Pages 
- [ ] AI image recognition for better matching
- [ ] Admin dashboard with analytics
- [ ] Reward system for active users
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Email notifications for matches and updates
- [ ] Multi-language support (i18n)
- [ ] PWA (Progressive Web App) support
- [ ] QR code generation for items
- [ ] Social media sharing integration
- [ ] Verified user badges

## 🎨 Design System

### Color Palette (HSL-based)

- **Primary**: Cyan gradient (`hsl(var(--primary))`)
- **Secondary**: Neutral gray tones
- **Accent**: Complementary accent colors
- **Success**: Green for positive actions
- **Destructive**: Red for warnings/deletions
- **Muted**: Subdued backgrounds and borders
- **Dark Mode**: Full support with CSS variables

### Typography

- **Headings**: Bold, gradient text for emphasis
- **Body**: Clean, readable font sizes
- **Responsive Text**: Scales from mobile to desktop
  - Mobile: `text-lg` to `text-xl`
  - Tablet: `text-xl` to `text-2xl`
  - Desktop: `text-2xl` to `text-3xl`

### Components

- **Cards**: Rounded corners, shadow on hover, backdrop blur
- **Buttons**: Gradient primary, outline secondary, icon buttons
- **Badges**: Color-coded categories and status indicators
- **Modals**: Centered overlays with backdrop blur
- **Forms**: Floating labels, validation states, focus rings
- **Navigation**: Fixed navbar with mobile hamburger menu
- **Toasts**: Non-intrusive notifications (top-right)

### Animations

- **Gradient Flares**: Animated background effects with pulse
- **Fade In**: `animate-fadeIn` for content appearance
- **Transitions**: Smooth `cubic-bezier` easing
- **Hover Effects**: Scale, shadow, and color transitions
- **Loading States**: Spinner animations and skeleton screens

### Responsive Breakpoints

- **xs**: < 640px (Mobile)
- **sm**: 640px+ (Large Mobile)
- **md**: 768px+ (Tablet)
- **lg**: 1024px+ (Desktop)
- **xl**: 1280px+ (Large Desktop)

### Mobile Optimizations

- Collapsible navigation menu
- Hidden/shortened text on small screens
- Touch-friendly button sizes (min 44x44px)
- Stacked layouts for narrow screens
- Responsive image galleries
- Optimized filter panels (vertical on mobile)

## 📱 Pages & Features

### Landing Page

- Hero section with animated gradient background and flare effects
- Responsive header (logo hidden on small screens)
- Call-to-action buttons (Sign In, Get Started)
- Theme toggle (Dark/Light mode)
- Feature highlights and benefits
- Mobile-optimized layout with touch-friendly buttons

### Home Page

- Recent Lost Items carousel with horizontal scroll
- Recent Found Items carousel with fade gradients
- Statistics overview cards
- Quick action button (Post Item)
- Responsive grid layout
- Mobile-optimized text sizes

### Posts/Search Page

- Search bar with icon
- Tabbed interface (All, Lost Items, Found Items) with counts
- Collapsible filter panel:
  - Category dropdown with icon
  - Date range filters (From/To)
  - Sort options (Newest, Oldest, Recent Activity)
  - Active filter indicator
  - Clear all filters button
- Grid layout with responsive cards
- Real-time search and filtering
- Loading states with spinners

### Post Item Page

- Toggle between Lost/Found item types
- Comprehensive form with validation:
  - Title (required)
  - Category dropdown (required)
  - Description (required)
  - Location (required)
  - Date picker with validation (required)
  - Multi-image upload with preview (optional for lost, required for found)
- Image management (add/remove)
- Loading overlay during submission
- Success/error toast notifications
- Mobile-responsive form layout

### Profile Page

- Three tabs: Profile, Change Password, My Posts
- Profile tab:
  - Edit name, phone, bio
- Change Password tab:
  - Current password verification
  - New password with confirmation
  - Secure re-authentication
- My Posts tab:
  - Separate sections for Lost/Found items
  - Item cards with Edit/Delete actions
  - Confirmation modals for deletions
- Responsive card layouts

### Item Detail Pages (Lost/Found)

- Full item information display
- Image gallery with navigation and lightbox
- Category and status badges
- Location with map icon
- Date information with calendar icon
- Contact information (owner details)
- Edit/Delete buttons (for item owners)
- Mark as Found/Returned button (for owners)
- Report button (for other users)
- Comments section:
  - Add new comment
  - Delete own comments
  - User avatars with initials
  - Timestamps
- Status dropdown for owners
- Confirmation modals for actions
- Mobile-optimized detail view

### Matches Page (Under Development)

- Placeholder page indicating upcoming smart matching functionality
- No active scoring or automated suggestions yet
- Future enhancements will add similarity scoring and breakdowns

## 🔒 Security Features

- Firebase JWT token authentication
- Protected API routes with middleware
- Input validation and sanitization with express-validator
- Rate limiting on API endpoints (100 requests per 15 minutes)
- CORS configuration with origin whitelist
- Helmet security headers
- Password hashing (Firebase managed)
- Secure password change with re-authentication
- Cloudinary secure image URLs with transformations
- MongoDB injection prevention
- XSS protection
- File upload restrictions (type, size, count)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

**Team Name:** R3Claimers - [@R3Claimers](https://github.com/R3Claimers)

### Team Members

- **Nitesh Sachde** - [@Nitesh-Sachde](https://github.com/Nitesh-Sachde)
- **Vrushil Parikh** - [@vrushil-parikh](https://github.com/vrushil-parikh)
- **Chandresh Thakkar** - [@Chandresh4997](https://github.com/Chandresh4997)

## 🙏 Acknowledgments

- Firebase for authentication & storage
- MongoDB Atlas for database hosting
- Cloudinary for image management and optimization
- Vite for blazing-fast development experience
- Tailwind CSS for modern styling and responsive design
- Lucide React for beautiful icon library
- All open-source contributors and the MERN community

---

_Let's reunite people with their lost belongings!_ 🎯
