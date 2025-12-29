import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Photo Browser API",
      version: "1.0.0",
      description: "Production-ready RESTful API for Photo Browser Application with JWT authentication, cloud image storage, and full CRUD operations.",
      contact: {
        name: "Mahbub Alam Khan",
        email: "contact@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Development server",
      },
      {
        url: "https://photo-browser-backend-api.onrender.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            username: { type: "string", example: "johndoe" },
            phone: { type: "string", example: "123-456-7890" },
            website: { type: "string", example: "https://johndoe.com" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Photo: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            albumId: { type: "string", example: "1" },
            title: { type: "string", example: "Beautiful Sunset" },
            url: { type: "string", example: "https://res.cloudinary.com/..." },
            thumbnailUrl: { type: "string", example: "https://res.cloudinary.com/..." },
            userId: { type: "string", example: "507f1f77bcf86cd799439011" },
            cloudinaryId: { type: "string", example: "photos/abc123" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Album: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            userId: { type: "string", example: "507f1f77bcf86cd799439011" },
            title: { type: "string", example: "Vacation Photos 2024" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Error message" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            error: { type: "string", example: "Validation failed" },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: { type: "string", example: "Invalid email address" },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
