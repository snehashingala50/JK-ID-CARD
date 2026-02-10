# JK-ID-CARD

Student ID Card Generator - A modern web application for creating and managing student ID cards.

## Features
- Photo upload and ID generation
- Live preview functionality
- Admin panel for management
- Export capabilities (PNG/PDF)
- Responsive design

## Running the code

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with your MongoDB URI:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
4. Start the backend server: `node server.js`

### Frontend Setup
1. In the root directory, install dependencies: `npm install`
2. Start the development server: `npm run dev`

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Deployment

### Frontend Deployment
- Frontend can be deployed to Vercel, Netlify, or similar services
- The app will automatically detect if it's running locally or in production
- When deployed, it will try to connect to the backend API at the same domain

### Backend Deployment
- Backend should be deployed separately to services like Render, Railway, or Heroku
- Update the API configuration in `src/config/api.ts` to point to your deployed backend URL

### Environment Configuration
The application automatically detects the environment:
- Local development: connects to `http://localhost:5000`
- Production: connects to the same domain as the frontend