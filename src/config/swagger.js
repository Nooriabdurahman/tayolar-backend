const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tailor Marketplace API',
      version: '1.0.0',
      description: 'API documentation for Tailor Marketplace Backend',
      contact: {
        name: 'API Support',
        url: 'https://tayolar-backend.onrender.com',
      },
    },
    servers: [
      {
        url: 'https://tayolar-backend.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              enum: ['CLIENT', 'TAILOR', 'ADMIN'],
              example: 'CLIENT',
            },
            isVerified: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            bio: {
              type: 'string',
              example: 'Professional tailor with 10 years of experience',
            },
            location: {
              type: 'string',
              example: 'New York, USA',
            },
            avatarUrl: {
              type: 'string',
              format: 'uri',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: 'Custom Suit Tailoring',
            },
            description: {
              type: 'string',
              example: 'Professional custom suit tailoring service',
            },
            price: {
              type: 'number',
              format: 'float',
              example: 299.99,
            },
            delivery: {
              type: 'string',
              example: '7-10 business days',
            },
            category: {
              type: 'string',
              example: 'Suit',
            },
            contactPhone: {
              type: 'string',
              example: '+1234567890',
            },
            contactEmail: {
              type: 'string',
              format: 'email',
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
            },
            tailorId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: 'Need a custom wedding dress',
            },
            description: {
              type: 'string',
              example: 'Looking for a professional tailor to create a custom wedding dress',
            },
            budget: {
              type: 'number',
              format: 'float',
              example: 1500.00,
            },
            category: {
              type: 'string',
              example: 'Wedding Dress',
            },
            delivery: {
              type: 'string',
              example: '2024-06-15',
            },
            contactPhone: {
              type: 'string',
            },
            contactEmail: {
              type: 'string',
              format: 'email',
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
            },
            clientId: {
              type: 'string',
              format: 'uuid',
            },
            status: {
              type: 'string',
              enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'],
              example: 'OPEN',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        AdminCard: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            cardNumber: {
              type: 'string',
              example: '**** **** **** 1234',
            },
            cardHolder: {
              type: 'string',
              example: 'John Doe',
            },
            expiry: {
              type: 'string',
              example: '12/25',
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CommissionSettings: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            rate: {
              type: 'number',
              format: 'float',
              example: 10.0,
              description: 'Commission rate in percentage',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Commission: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            rate: {
              type: 'number',
              format: 'float',
            },
            orderId: {
              type: 'string',
              format: 'uuid',
            },
            amount: {
              type: 'number',
              format: 'float',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PAID'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error description',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
            role: {
              type: 'string',
              enum: ['CLIENT', 'TAILOR'],
              example: 'CLIENT',
            },
          },
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['email', 'code'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            code: {
              type: 'string',
              example: '123456',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            bio: {
              type: 'string',
              example: 'Professional tailor',
            },
            location: {
              type: 'string',
              example: 'New York, USA',
            },
            avatarUrl: {
              type: 'string',
              format: 'uri',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User profile management',
      },
      {
        name: 'Services',
        description: 'Tailor services management',
      },
      {
        name: 'Jobs',
        description: 'Job postings management',
      },
      {
        name: 'Admin',
        description: 'Admin operations (requires admin authentication)',
      },
      {
        name: 'Public',
        description: 'Public endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

