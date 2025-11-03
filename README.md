# 💖 Dating App

A modern, feature-rich dating application built with Next.js 15, React 19, and PostgreSQL. This app provides a complete dating experience with real-time matching, photo galleries, interests, and messaging capabilities.

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** - Multi-step signup process with validation
- **Login System** - Secure JWT-based authentication
- **Session Management** - Token-based sessions with automatic expiration
- **Profile Protection** - Middleware to protect routes and verify authentication

### 👤 User Profiles
- **Complete Profile System** - Avatar, name, age, gender, and sexual orientation
- **Photo Gallery** - Upload up to 6 photos with main photo selection
- **Interests** - Select and display personal interests with icons
- **Profile Viewing** - View your own profile and other users' profiles
- **Logout Functionality** - Secure logout with session invalidation

### 💘 Matching System
- **Smart Suggestions** - AI-powered matching based on:
  - Gender preferences
  - Sexual orientation compatibility
  - Common interests
  - Age compatibility
- **Swipe Actions** - Like, Super Like, and Dislike functionality
- **Match Detection** - Automatic mutual match detection
- **Match Modal** - Beautiful celebration screen when matched

### 📊 Match Management
- **All Matches** - View all your mutual matches
- **You Liked** - See who you've liked
- **Liked You** - See who liked you
- **Views** - Track profile views
- **Remove Matches/Likes** - Option to unmatch or remove likes
- **Tabbed Navigation** - Easy filtering between different match types

### 📸 Photo Management
- **Photo Upload** - Add new photos via "Add Story" button
- **Photo Gallery** - Grid view of all user photos
- **Main Photo Selection** - Set any photo as your main profile picture
- **Photo Preview** - Full-screen photo viewer
- **Photo Validation** - File type and size validation (max 5MB)
- **MD5 Hash Storage** - Prevents duplicate uploads

### 🎨 User Interface
- **Modern Design** - Gradient backgrounds and smooth animations
- **Responsive Layout** - Works on mobile and desktop (max-width: 768px)
- **Bottom Navigation** - Easy access to Home, Matches, Messages, and Profile
- **Modal Components** - Confirmation modals and photo upload modals
- **Loading States** - Visual feedback during async operations
- **Error Handling** - User-friendly error messages

### 🔍 Additional Features
- **Interest Badges** - Visual representation of user interests
- **Age Calculation** - Automatic age calculation from birthdate
- **Photo Indicators** - Carousel indicators for multiple photos
- **Compatibility Score** - Matching algorithm with interest-based scoring
- **Dislike Penalty** - Users you disliked appear last in suggestions

## 🛠️ Technologies

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with Compiler
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Material UI Icons** - Comprehensive icon library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **date-fns** - Date formatting and manipulation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Development
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database GUI

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Hadaward/dating-app.git
cd dating-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```properties
DATABASE_URL="postgresql://user:password@localhost:5432/dating_app?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

Replace:
- `user` with your PostgreSQL username
- `password` with your PostgreSQL password
- `dating_app` with your database name
- `your_super_secret_jwt_key_here` with a strong random string

### 4. Setup the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npm run seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
  ├── api/                  # API routes
  ├── components/           # Shared components
  ├── features/             # Feature-specific components
  ├── hooks/                # Custom React hooks
  ├── lib/                  # Library code, e.g. Prisma client
  ├── middleware/           # Middleware for authentication
  ├── pages/                # Next.js pages
  ├── public/               # Static assets
  ├── styles/               # Global styles
  └── utils/                # Utility functions
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/YourFeature`)
6. Open a pull request

Please ensure your code adheres to the project's coding standards and passes all tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💖 by [Your Name](https://yourwebsite.com)
