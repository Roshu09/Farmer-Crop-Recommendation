# Crop Recommendation System - Backend API Integration

## Overview
This frontend is designed to work with a separate Express.js backend that you'll set up and deploy. The backend handles all business logic, database operations, and external API integrations.

## Backend Setup Requirements

### Environment Variables for Frontend
Configure these in your Vercel project:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000  # Change to your backend URL
\`\`\`

### Backend API Endpoints Required

#### Authentication (`/api/auth`)
- `POST /api/auth/signup` - User registration
  - Body: `{ firstName, lastName, email, password, location: { state, district } }`
  - Response: `{ token, userRole }`

- `POST /api/auth/login` - User login
  - Body: `{ email, password }`
  - Response: `{ token, userRole }`

#### Farmer Dashboard (`/api`)
- `GET /api/dashboard` - Get dashboard data
  - Response: `{ weather, soil }`

- `GET /api/recommendations` - Get crop recommendations
  - Response: `{ recommendations: [...] }`

- `GET /api/market-prices` - Get current market prices
  - Response: `{ prices: [...] }`

- `GET /api/analytics?timeRange=year` - Get farm analytics
  - Response: `{ totalHarvest, averageYield, profitMargin, soilHealth, monthlyData, cropDistribution, weatherImpact }`

- `GET /api/market-analysis` - Get detailed market analysis
  - Response: `{ analyses: [...] }`

#### Admin (`/api/admin`)
- `GET /api/admin/stats` - Get system statistics
  - Response: `{ totalUsers, activeUsers, totalFarms, platformGrowth, systemHealth, recentActivity, topCrops }`

- `GET /api/admin/users` - Get all users
  - Response: `{ users: [...] }`

- `DELETE /api/admin/users/:userId` - Delete a user

- `GET /api/admin/settings` - Get system settings

- `POST /api/admin/settings` - Update system settings
  - Body: `{ platformName, apiUrl, weatherApiKey, enableNotifications, maintenanceMode, maxUploadSize }`

## Backend Technologies Recommended

- **Framework**: Express.js
- **Database**: MongoDB Atlas (as you already have)
- **Authentication**: JWT tokens
- **External APIs**:
  - OpenWeatherMap (weather data)
  - Government Agriculture APIs (crop prices, recommendations)

## Data Models for MongoDB

### User Model
\`\`\`javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String (hashed),
  location: {
    state: String,
    district: String
  },
  farmSize: Number,
  role: String,
  status: String,
  createdAt: Date
}
\`\`\`

### Farm Model
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId,
  soilData: {
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    pH: Number
  },
  crops: [String],
  size: Number,
  lastUpdated: Date
}
\`\`\`

### Recommendation Model
\`\`\`javascript
{
  _id: ObjectId,
  farmId: ObjectId,
  crops: [{
    cropName: String,
    suitability: Number,
    reason: String,
    benefits: [String],
    riskFactors: [String],
    estimatedYield: String,
    marketPrice: Number
  }],
  createdAt: Date
}
\`\`\`

## Authentication Flow

1. User signs up with email and password
2. Backend hashes password and stores user in MongoDB
3. Backend returns JWT token
4. Token is stored in localStorage on frontend
5. All subsequent requests include token in Authorization header
6. Backend validates token before processing requests

## Deployment

### Frontend (Vercel)
- Push to GitHub repository
- Connect to Vercel
- Set environment variables
- Deploy

### Backend (Options)
1. **Railway.app** - Good for Node.js apps
2. **Render.com** - Free tier available
3. **AWS/Azure** - For production
4. **DigitalOcean** - Budget-friendly

## Development Tips

- Use `NEXT_PUBLIC_API_URL=http://localhost:5000` when developing locally
- Backend should have CORS enabled for localhost development
- Use Postman to test backend endpoints before frontend integration
- Mock API responses for frontend development if backend isn't ready

## Next Steps

1. Build Express.js backend with the API endpoints listed above
2. Set up MongoDB database with the required schemas
3. Configure environment variables
4. Deploy both frontend and backend
5. Test the complete flow from signup to recommendations
