# 📸 Photo Browser Backend API

Production-ready RESTful API for Photo Browser Application with JWT authentication, cloud image storage, and full CRUD operations. Built with Node.js, Express, TypeScript, MongoDB Atlas, and Cloudinary.

## 🚀 Technology Stack

### Core Technologies

- **Runtime**: Node.js 22 LTS
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **ODM**: Mongoose 8.0

### Authentication & Security

- **JWT**: JSON Web Tokens for stateless authentication
- **bcryptjs**: Password hashing with salt rounds
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing

### Image Processing & Storage

- **Cloudinary**: Cloud image storage and CDN
- **Multer**: Multipart form-data handling
- **Sharp**: Image optimization and thumbnail generation

### Development Tools

- **nodemon**: Auto-reload on file changes
- **ts-node**: Run TypeScript directly
- **Morgan**: HTTP request logger
- **dotenv**: Environment variable management

## 📋 Prerequisites

- Node.js 22 or higher
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)
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
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/photo-browser?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Cloudinary Setup

1. Create account at https://cloudinary.com
2. Go to Dashboard to get credentials
3. Add Cloud Name, API Key, and API Secret to `.env`

### 4. MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Create database user with read/write permissions
4. Whitelist your IP address (use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

### 5. Seed Database

```bash
npm run seed
```

This will populate your database with:

- 10 users from JSONPlaceholder (password: `demo123` for all)
- 100 albums
- 1000 photos

### 6. Start Development Server

```bash
npm run dev
```

Server will run on http://localhost:5001

## 📡 API Endpoints

### Health Check

```
GET /health - Server health status
```

### Authentication

```
POST /api/auth/register       # Register new user
POST /api/auth/login          # Login user
GET  /api/auth/me             # Get current user (Protected)
```

### Photos

```
GET    /api/photos?_page=1&_limit=18   # List photos with pagination
GET    /api/photos/:id                  # Get single photo
POST   /api/photos                      # Upload photo (Protected)
PUT    /api/photos/:id                  # Update photo (Protected)
DELETE /api/photos/:id                  # Delete photo (Protected)
```

### Albums

```
GET    /api/albums?_page=1&_limit=18   # List albums with pagination
GET    /api/albums/:id                  # Get single album
GET    /api/albums/:albumId/photos     # Get photos by album
POST   /api/albums                      # Create album (Protected)
PUT    /api/albums/:id                  # Update album (Protected)
DELETE /api/albums/:id                  # Delete album (Protected)
```

### Users

```
GET /api/users/:id                      # Get user profile
```

## 🔐 Authentication

### Register New User

```bash
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "phone": "555-1234",          // Optional
  "website": "https://john.com" // Optional
}
```

### Login

```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "676c...",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

### Using Protected Endpoints

Add the JWT token to the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📸 Image Upload

### Upload Photo

**Endpoint:** `POST /api/photos`  
**Authentication:** Required  
**Content-Type:** `multipart/form-data`

```bash
# Using HTTPie
http -f POST http://localhost:5001/api/photos \
  "Authorization:Bearer YOUR_TOKEN" \
  image@/path/to/photo.jpg \
  title="Beautiful Sunset" \
  albumId=1

# Using curl
curl -X POST http://localhost:5001/api/photos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/photo.jpg" \
  -F "title=Beautiful Sunset" \
  -F "albumId=1"
```

**Features:**

- Automatic image optimization (max 800x800px)
- Thumbnail generation (150x150px)
- Cloud storage via Cloudinary
- Supported formats: jpeg, jpg, png, gif, webp
- Max file size: 5MB

## 🧪 Testing the API

### Using HTTPie:

```bash
# Login
http POST http://localhost:5001/api/auth/login \
  email=Sincere@april.biz \
  password=demo123

# Save token
TOKEN="your_token_here"

# Get photos
http GET http://localhost:5001/api/photos

# Upload photo
http -f POST http://localhost:5001/api/photos \
  "Authorization:Bearer $TOKEN" \
  image@~/photo.jpg \
  title="My Photo"

# Update photo
http PUT http://localhost:5001/api/photos/1001 \
  "Authorization:Bearer $TOKEN" \
  title="Updated Title"

# Delete photo
http DELETE http://localhost:5001/api/photos/1001 \
  "Authorization:Bearer $TOKEN"

# Create album
http POST http://localhost:5001/api/albums \
  "Authorization:Bearer $TOKEN" \
  title="My Album"

# Delete album
http DELETE http://localhost:5001/api/albums/101 \
  "Authorization:Bearer $TOKEN"
```

### Using curl:

```bash
# Health check
curl http://localhost:5001/health

# Get photos with pagination
curl "http://localhost:5001/api/photos?_page=1&_limit=18"

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"Sincere@april.biz","password":"demo123"}'

# Upload photo
curl -X POST http://localhost:5001/api/photos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@photo.jpg" \
  -F "title=Sunset"
```

## 📁 Project Structure

```
photo-browser-app-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── cloudinary.ts        # Cloudinary configuration
│   ├── models/
│   │   ├── User.ts              # User schema & model
│   │   ├── Album.ts             # Album schema & model
│   │   └── Photo.ts             # Photo schema & model
│   ├── controllers/
│   │   ├── authController.ts    # Register, login, get current user
│   │   ├── photoController.ts   # Photo CRUD operations
│   │   ├── albumController.ts   # Album CRUD operations
│   │   └── userController.ts    # User profile operations
│   ├── routes/
│   │   ├── auth.ts              # Auth routes
│   │   ├── photos.ts            # Photo routes
│   │   ├── albums.ts            # Album routes
│   │   └── users.ts             # User routes
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── upload.ts            # Multer file upload config
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
REACT_APP_BACKENDURL=http://localhost:5001/api
```

Then restart your frontend application.

## ✨ Features

### Implemented ✅

- **JWT Authentication** - Secure user registration and login
- **Password Hashing** - bcrypt with 10 salt rounds
- **Image Upload** - Cloudinary integration with Sharp optimization
- **Full CRUD Operations** - Create, Read, Update, Delete for photos and albums
- **Ownership Verification** - Users can only modify their own content
- **Image Processing** - Automatic resize (800x800) and thumbnail generation (150x150)
- **Cloud Storage** - Cloudinary for image hosting and CDN delivery
- **Pagination Support** - Efficient data loading with `_page` and `_limit` params
- **Database Seeding** - Populate with JSONPlaceholder data
- **TypeScript** - Full type safety and compile-time error checking
- **Security Headers** - Helmet middleware for protection
- **CORS Configuration** - Cross-origin resource sharing
- **Request Logging** - Morgan for HTTP request tracking

### Security Features 🔒

- **Stateless Authentication** - JWT tokens (7-day expiration)
- **Protected Routes** - Middleware-based auth verification
- **Password Security** - Never stored in plain text
- **Ownership Checks** - Users can only delete/update own content
- **File Validation** - Type and size restrictions on uploads
- **Cloud Cleanup** - Automatic deletion from Cloudinary when photos removed
- **Cascade Protection** - Albums with photos cannot be deleted

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

- **JWT Authentication**: Stateless token-based auth with configurable expiration
- **bcryptjs**: Secure password hashing with salt rounds
- **Helmet**: Security headers for Express
- **CORS**: Configured for specific origins
- **Ownership Verification**: Users can only modify their own resources
- **File Validation**: Type and size checks on uploads
- **Environment Variables**: Sensitive data protection
- **TypeScript Strict Mode**: Compile-time error prevention

## 🎯 Development Roadmap

### Completed ✅

- [x] MongoDB Atlas integration
- [x] User authentication (register, login)
- [x] JWT middleware and protected routes
- [x] Image upload with Cloudinary
- [x] Full CRUD operations for photos
- [x] Full CRUD operations for albums
- [x] Image optimization with Sharp
- [x] Ownership verification
- [x] Database seeding script

### Future Enhancements 🚀

- [ ] Search photos by title
- [ ] Filter by album/user
- [ ] Sort by date/popularity
- [ ] Refresh token implementation
- [ ] Rate limiting
- [ ] Request validation with Zod
- [ ] Comprehensive error handling middleware
- [ ] Unit and integration tests
- [ ] API documentation with Swagger
- [ ] Pagination metadata (total count, pages)

## 👨‍💻 Author

**Mahbub Alam Khan**

## 📄 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Created**: December 29, 2025  
**Last Updated**: December 29, 2025
