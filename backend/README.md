# Crop Recommendation System - Backend

Professional Express.js backend API for the crop recommendation system with MongoDB integration.

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

Update the following variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secure random string for JWT signing
- `OPENWEATHER_API_KEY` - Your OpenWeatherMap API key
- `FRONTEND_URL` - Your frontend application URL (e.g., http://localhost:3000)

### 3. Seed Database
Initialize the database with crop data:
\`\`\`bash
npm run seed
\`\`\`

### 4. Start Server
\`\`\`bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
\`\`\`

The backend will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new farmer
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/weather/season` - Get current season

### Recommendations
- `GET /api/recommendations` - Get crop recommendations
- `GET /api/recommendations/history` - Get recommendation history

### Farmer Management
- `POST /api/farmer/farm` - Create farm
- `GET /api/farmer/farm` - Get farm data
- `PUT /api/farmer/farm/soil-data` - Update soil data
- `POST /api/farmer/farm/crops` - Add crop to farm
- `GET /api/farmer/farm/crops` - Get farm crops
- `PUT /api/farmer/farm/crops/:cropId` - Update crop status
- `GET /api/farmer/dashboard` - Get dashboard data

### Market Prices
- `GET /api/market` - Get all market prices
- `GET /api/market/top-crops` - Get top crops by price
- `GET /api/market/:cropType` - Get specific crop price
- `GET /api/market/:cropType/analysis` - Get market analysis

### Analytics
- `GET /api/analytics` - Get farm analytics
- `GET /api/analytics/monthly` - Get monthly analytics
- `POST /api/analytics/generate` - Generate new analytics
- `GET /api/analytics/metrics/performance` - Get performance metrics

### Admin Routes (requires admin role)
- `GET /api/admin/stats` - Get system stats
- `GET /api/admin/metrics` - Get system metrics
- `GET /api/admin/logs` - Get system logs
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/crops` - Get all crops
- `POST /api/admin/crops` - Create crop
- `PUT /api/admin/crops/:cropId` - Update crop
- `DELETE /api/admin/crops/:cropId` - Delete crop

## Architecture

\`\`\`
backend/
├── src/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, validation, error handling
│   ├── services/          # External API integration
│   ├── utils/             # Helper functions
│   └── config/            # Configuration files
├── scripts/               # Database seeding scripts
├── server.js             # Entry point
├── package.json
└── .env.example
\`\`\`

## Key Features

- User authentication with JWT
- Weather data integration with OpenWeatherMap API
- AI-powered crop recommendations based on soil, weather, and market data
- Market price tracking and analysis
- Farm management and crop tracking
- Comprehensive analytics and reporting
- Admin dashboard for system management
- Comprehensive error handling and logging
- Rate limiting and security best practices

## Database Schema

The backend uses MongoDB with the following main collections:
- `users` - Farmer and admin accounts
- `farms` - Farm information and location
- `farmcrops` - Crops grown on farms
- `recommendations` - Generated crop recommendations
- `marketprices` - Current crop market prices
- `analytics` - Farm performance metrics
- `crops` - Crop database with properties
- `systemlogs` - System and error logs

## Error Handling

All endpoints return consistent error responses:
\`\`\`json
{
  "error": "Error message describing what went wrong"
}
\`\`\`

HTTP Status Codes:
- 200 - Success
- 201 - Created
- 400 - Bad request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found
- 500 - Server error

## Deployment

For production deployment:
1. Update environment variables with production values
2. Set `NODE_ENV=production`
3. Configure MongoDB for production
4. Use a process manager like PM2
5. Set up proper logging and monitoring

## Support

For issues and support, please refer to the main project documentation.
