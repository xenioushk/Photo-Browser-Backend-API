# 📸 Photo Browser Backend API

Production-ready backend API for Photo Browser Application with MongoDB Atlas, built with Node.js, Express, TypeScript, and Mongoose.

## 🚀 Technology Stack

- **Runtime**: Node.js 22 LTS
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **ODM**: Mongoose 8.0
- **Authentication**: JWT & bcryptjs
- **Security**: helmet, cors
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 22 or higher
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/photo-browser?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 3. MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Create database user with read/write permissions
4. Whitelist your IP address (use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

### 4. Seed Database

```bash
npm run seed
```

This will populate your database with:
- 10 users from JSONPlaceholder
- 100 albums
- 1000 photos

### 5. Start Development Server

```bash
npm run dev
```

Server will run on http://localhost:5000

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Photos
```
GET    /api/photos?_page=1&_limit=18    # List photos with pagination
GET    /api/photos/:id                   # Get single photo
```

### Albums
```
GET    /api/albums?_page=1&_limit=18    # List albums with pagination
GET    /api/albums/:id                   # Get single album
GET    /api/albums/:albumId/photos      # Get photos by album
```

### Users
```
GET    /api/users/:id                    # Get user profile
```

## 🧪 Testing the API

### Using curl:

```bash
# Health check
curl http://localhost:5000/health

# Get photos
curl http://localhost:5000/api/photos?_page=1&_limit=18

# Get single photo
curl http://localhost:5000/api/photos/1

# Get albums
curl http://localhost:5000/api/albums?_page=1&_limit=18

# Get album photos
curl http://localhost:5000/api/albums/1/photos
```

## 📁 Project Structure

```
photo-browser-app-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/
│   │   ├── User.ts              # User schema & model
│   │   ├── Album.ts             # Album schema & model
│   │   └── Photo.ts             # Photo schema & model
│   ├── controllers/
│   │   ├── photoController.ts   # Photo CRUD operations
│   │   ├── albumController.ts   # Album CRUD operations
│   │   └── userController.ts    # User profile operations
│   ├── routes/
│   │   ├── photos.ts            # Photo routes
│   │   ├── albums.ts            # Album routes
│   │   └── users.ts             # User routes
│   ├── scripts/
│   │   └── seedDatabase.ts      # Seed from JSONPlaceholder
│   └── server.ts                # Express app entry point
├── .env                         # Environment variables (git ignored)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config
└── README.md                    # This file
```

## 🔧 NPM Scripts

```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production server
npm run seed     # Seed database with JSONPlaceholder data
```

## 🌐 Connecting Frontend

Update your frontend `.env` file:

```env
REACT_APP_BACKENDURL=http://localhost:5000/api
```

Then restart your frontend application.

## 🚢 Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Render.com

1. Push code to GitHub
2. Create account at https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Set build command: `npm install && npm run build`
6. Set start command: `npm start`
7. Add environment variables from `.env`

### Update Frontend URL

After deployment, update frontend:

```env
REACT_APP_BACKENDURL=https://your-app.onrender.com/api
```

## 🔐 Security Features

- **Helmet**: Security headers for Express
- **CORS**: Configured for specific origins
- **bcryptjs**: Password hashing
- **JWT**: Token-based authentication (ready for implementation)
- **Environment Variables**: Sensitive data protection

## 🎯 Next Steps

- [ ] Add authentication endpoints (register, login)
- [ ] Implement JWT middleware
- [ ] Add image upload with Cloudinary
- [ ] Implement full CRUD operations
- [ ] Add search and filtering
- [ ] Add rate limiting
- [ ] Add request validation with Zod
- [ ] Add comprehensive error handling
- [ ] Add unit and integration tests

## 👨‍💻 Author

**Mahbub Alam Khan**

## 📄 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Created**: December 29, 2025  
**Last Updated**: December 29, 2025
