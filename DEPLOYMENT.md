# Eco-Travel Planner Deployment Guide

This guide provides instructions for deploying the Eco-Travel Planner application to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Connecting Frontend to Backend](#connecting-frontend-to-backend)
8. [Continuous Deployment](#continuous-deployment)
9. [Post-Deployment Checklist](#post-deployment-checklist)

## Prerequisites

Before deployment, ensure you have:
- Node.js (v14 or later) installed
- NPM or Yarn installed
- MongoDB Atlas account or another MongoDB hosting solution
- A Vercel, Netlify, or similar account for frontend deployment
- A Heroku, Render, or similar account for backend deployment

## Deployment Options

### Recommended Stack
- **Frontend**: Vercel or Netlify
- **Backend**: Render, Heroku, or Railway
- **Database**: MongoDB Atlas

### Alternative Options
- Self-hosted on VPS (DigitalOcean, AWS EC2, etc.)
- Docker containers on cloud platforms
- Firebase for frontend + Cloud Functions for backend

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the server directory with these variables:
```
PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

### Frontend Environment Variables
Create a `.env` file in the client directory:
```
REACT_APP_API_URL=your-backend-api-url
```

## Database Setup

1. Create a MongoDB Atlas cluster:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Set up database user with password
   - Whitelist IP addresses (0.0.0.0/0 for all IPs)
   - Get connection string

2. Update the `MONGO_URI` in your backend .env file with the connection string

## Backend Deployment

### Option 1: Render

1. Push your code to a GitHub repository
2. Sign up for [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repo
5. Configure your service:
   - Name: `eco-travel-planner-api`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables from your `.env` file
7. Deploy

### Option 2: Heroku

1. Install Heroku CLI and login
2. Navigate to your server directory
3. Initialize git repository if not already done
```
cd server
git init
heroku create eco-travel-planner-api
```
4. Set environment variables
```
heroku config:set MONGO_URI=your-mongodb-atlas-connection-string
heroku config:set JWT_SECRET=your-secure-jwt-secret
heroku config:set NODE_ENV=production
```
5. Deploy
```
git add .
git commit -m "Server ready for deployment"
git push heroku master
```

## Frontend Deployment

### Option 1: Vercel

1. Push your code to a GitHub repository
2. Sign up for [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variables
6. Deploy

### Option 2: Netlify

1. Push your code to a GitHub repository
2. Sign up for [Netlify](https://netlify.com)
3. Create a new site from Git
4. Connect to your GitHub repository
5. Configure build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `build`
6. Add environment variables
7. Deploy

## Connecting Frontend to Backend

1. In the client's production build, ensure all API calls point to your deployed backend API
2. Update the `.env` file in the client directory:
```
REACT_APP_API_URL=https://your-backend-api-url.com
```
3. Create a production API config file:

```javascript
// client/src/config/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default API_URL;
```

4. Use this config in your API service files

## Continuous Deployment

Set up CI/CD pipelines:

1. GitHub Actions for testing before deployment
2. Connect Vercel/Netlify to your repository for auto-deployment on push
3. Configure Render/Heroku for automatic deployments

## Post-Deployment Checklist

- [ ] Verify all environment variables are correctly set
- [ ] Test user registration and login
- [ ] Test EcoCoin functionality
- [ ] Verify carbon calculator works
- [ ] Check all API endpoints are responding correctly
- [ ] Verify database connections
- [ ] Test the application on different browsers
- [ ] Check application on mobile devices
- [ ] Set up monitoring and error tracking (Sentry, LogRocket, etc.)
- [ ] Configure analytics
- [ ] Set up proper CORS configuration on the backend
- [ ] Ensure JWT secret is secure and properly set
- [ ] Review security settings

## Troubleshooting

### Common Issues and Solutions

1. **CORS errors**: Ensure your backend has proper CORS configuration:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : 'http://localhost:3000',
  credentials: true
}));
```

2. **MongoDB Connection Issues**: Verify network access settings in MongoDB Atlas

3. **API Endpoint 404 Errors**: Check your route configurations and API URL settings

4. **JWT Authentication Failures**: Verify the JWT_SECRET is consistent

5. **Missing Environment Variables**: Double-check all required variables are set in your hosting platform

## Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Render Documentation](https://render.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/) 