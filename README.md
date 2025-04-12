# Eco-Travel Planner 🌱

A sustainable travel planning application that helps users calculate and reduce their carbon footprint while traveling.

## Directory Structure

The project is split into two main parts:
- `client` - Frontend React application
- `server` - Backend API (coming soon)

## Getting Started

### Running the Frontend

To start the frontend development server:

1. Navigate to the client directory:
```
cd client
```

2. Install dependencies (if you haven't already):
```
npm install
```

3. Start the development server:
```
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000).

## Core Features

### 1. Compare & Book
Browse and book eco-friendly travel options including:
- Transportation (trains, electric vehicles, etc.)
- Accommodations (eco-certified hotels)
- Activities (sustainable tours and experiences)

Each booking earns EcoCoins based on how eco-friendly your choices are!

### 2. Carbon Calculator
Calculate the carbon footprint of your travel plans and get recommendations for reducing emissions.

### 3. EcoCoin Wallet
- View your EcoCoin balance and transaction history
- Earn coins for eco-friendly bookings
- Track your rewards and eco-impact

### 4. Contribute
Use your earned EcoCoins to contribute to environmental causes:
- Tree planting initiatives
- Ocean cleanup projects
- Wildlife conservation
- Renewable energy development

### 5. Profile & Eco Rating
- View your eco-impact metrics
- Check your Eco Rating based on your sustainable choices
- Track your achievements and eco-contributions

## How to Test the Application

1. **User Registration/Login**
   - Register a new account to access personalized features
   - Login with your credentials

2. **Plan a Trip**
   - Go to "Compare & Book" to select transportation, accommodation, and activities
   - Notice how each option has an eco-rating and carbon footprint information
   - Complete a booking to earn EcoCoins

3. **Check Your Wallet**
   - Visit the EcoCoin Wallet to see your balance and transaction history
   - Review how many EcoCoins you've earned from your bookings

4. **Make a Contribution**
   - Go to the Contribute section
   - Select an environmental cause
   - Contribute some of your EcoCoins to support the cause
   - Watch your Eco Rating increase

5. **View Your Profile**
   - Visit your Profile and Eco Impact Dashboard
   - See your carbon savings, achievements, and eco-rating

## Profile Access

The profile section can be accessed in two ways:
1. From the top navigation bar - Click on "Profile" in the main menu
2. From the profile dropdown in the upper right corner

## Features

- **Carbon Calculator:** Estimate emissions for flights, hotels, and transportation
- **Green Certification Database:** Rates hotels/transport providers using sustainability metrics
- **Rewards System:** Offers discounts for eco-conscious choices
- **Community Reviews:** User-generated tips for sustainable travel

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)

## Installation

### Set up the server

1. Install server dependencies:
```
cd eco-travel-planner/server
npm install
```

2. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eco-travel-planner
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

3. Start the server:
```
npm run dev
```

### Set up the client

1. Install client dependencies:
```
cd eco-travel-planner/client
npm install
npm install react react-dom react-scripts
npm install -D tailwindcss postcss autoprefixer
```

2. Initialize Tailwind CSS:
```
npx tailwindcss init -p
```

3. Start the client:
```
npm start
```

## Usage

1. Register an account or log in
2. Use the Carbon Calculator to estimate the emissions of your trip
3. Browse the Green Certification Database to find eco-friendly accommodations and transportation
4. Earn rewards for making eco-conscious choices
5. Read and contribute to community reviews

## Project Structure

```
eco-travel-planner/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # React components and logic
│       ├── components/     # Reusable UI components
│       ├── pages/          # Main application pages
│       └── context/        # Global state management
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── models/             # MongoDB models
│   └── routes/             # API routes
└── README.md               # Project documentation
```

## Tech Stack

- **Frontend:** React, Tailwind CSS, Chart.js, Leaflet
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT

## License

[MIT](LICENSE)

## Carbon Calculator API Configuration

The Carbon Footprint Calculator component requires a connection to the emissions calculation API. Follow these steps to configure the API connection:

1. Create a `.env` file in the client directory with the following variables:
   ```
   # Carbon Calculator API Configuration
   REACT_APP_API_URL=http://your-api-url.com
   REACT_APP_API_KEY=YOUR_API_KEY_HERE
   
   # Connection settings
   REACT_APP_API_TIMEOUT=8000
   REACT_APP_API_RETRY_INTERVAL=60000
   ```

2. Replace `http://your-api-url.com` with your actual API endpoint URL
3. Replace `YOUR_API_KEY_HERE` with your valid API key if authentication is required
4. Adjust the timeout and retry interval as needed

### Troubleshooting API Connection

If you encounter issues with the API connection:

1. **API URL Issue**: Verify the API URL is correct in your `.env` file
2. **Authentication**: Check that your API key is valid and properly formatted
3. **CORS Issues**: If you encounter CORS errors, ensure the API server allows requests from your application domain
4. **Firewall/Network**: Check if there are any network restrictions blocking the API connection
5. **API Server Status**: Verify the API server is running and accessible

The application will automatically fall back to local calculation mode if the API cannot be reached. To force local calculation mode for testing, you can set the API URL to an invalid endpoint in your `.env` file. 