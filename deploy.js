/**
 * Eco-Travel Planner Deployment Script
 * 
 * This script prepares the application for deployment by:
 * 1. Creating necessary environment files
 * 2. Updating configuration for production
 * 3. Building the client application
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
let config = {
  backendUrl: '',
  mongoUri: '',
  jwtSecret: '',
  frontendUrl: ''
};

// Welcome message
console.log('\n\x1b[36m%s\x1b[0m', '🌱 Eco-Travel Planner - Deployment Preparation');
console.log('\x1b[36m%s\x1b[0m', '================================================\n');

// Get configuration from user
async function gatherConfig() {
  return new Promise((resolve) => {
    rl.question('\x1b[33m1. Enter the production backend URL (e.g., https://api.example.com):\x1b[0m ', (backendUrl) => {
      config.backendUrl = backendUrl;
      
      rl.question('\x1b[33m2. Enter MongoDB connection string:\x1b[0m ', (mongoUri) => {
        config.mongoUri = mongoUri;
        
        rl.question('\x1b[33m3. Enter JWT secret (leave blank to generate random):\x1b[0m ', (jwtSecret) => {
          config.jwtSecret = jwtSecret || require('crypto').randomBytes(64).toString('hex');
          
          rl.question('\x1b[33m4. Enter frontend URL (e.g., https://app.example.com):\x1b[0m ', (frontendUrl) => {
            config.frontendUrl = frontendUrl;
            
            console.log('\n\x1b[32m✓ Configuration collected\x1b[0m\n');
            resolve();
          });
        });
      });
    });
  });
}

// Create server .env file
function createServerEnv() {
  const envContent = `PORT=5000
MONGO_URI=${config.mongoUri}
JWT_SECRET=${config.jwtSecret}
NODE_ENV=production
FRONTEND_URL=${config.frontendUrl}
`;

  try {
    fs.writeFileSync(path.join(__dirname, 'server', '.env'), envContent);
    console.log('\x1b[32m✓ Created server .env file\x1b[0m');
    return true;
  } catch (error) {
    console.error('\x1b[31m✗ Failed to create server .env file:', error.message, '\x1b[0m');
    return false;
  }
}

// Create client .env file
function createClientEnv() {
  const envContent = `REACT_APP_API_URL=${config.backendUrl}
`;

  try {
    fs.writeFileSync(path.join(__dirname, 'client', '.env'), envContent);
    console.log('\x1b[32m✓ Created client .env file\x1b[0m');
    return true;
  } catch (error) {
    console.error('\x1b[31m✗ Failed to create client .env file:', error.message, '\x1b[0m');
    return false;
  }
}

// Update CORS settings in server.js
function updateCorsSettings() {
  const serverJsPath = path.join(__dirname, 'server', 'server.js');
  
  try {
    let serverJs = fs.readFileSync(serverJsPath, 'utf8');
    
    // Check if we need to update CORS
    if (serverJs.includes('app.use(cors());')) {
      serverJs = serverJs.replace(
        'app.use(cors());',
        `app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));`
      );
      
      fs.writeFileSync(serverJsPath, serverJs);
      console.log('\x1b[32m✓ Updated CORS settings in server.js\x1b[0m');
    } else {
      console.log('\x1b[33m! CORS settings already configured or in custom format\x1b[0m');
    }
    
    return true;
  } catch (error) {
    console.error('\x1b[31m✗ Failed to update CORS settings:', error.message, '\x1b[0m');
    return false;
  }
}

// Build client
function buildClient() {
  try {
    console.log('\n\x1b[36mBuilding client application...\x1b[0m');
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, 'client') });
    console.log('\x1b[32m✓ Client build completed\x1b[0m');
    return true;
  } catch (error) {
    console.error('\x1b[31m✗ Client build failed\x1b[0m');
    return false;
  }
}

// Main function
async function main() {
  try {
    await gatherConfig();
    
    if (createServerEnv() && createClientEnv() && updateCorsSettings()) {
      console.log('\n\x1b[36mConfiguration files created successfully!\x1b[0m');
      
      const buildNow = await new Promise((resolve) => {
        rl.question('\x1b[33mDo you want to build the client now? (y/n):\x1b[0m ', (answer) => {
          resolve(answer.toLowerCase() === 'y');
        });
      });
      
      if (buildNow) {
        buildClient();
      }
      
      console.log('\n\x1b[32m✅ Deployment preparation complete!\x1b[0m');
      console.log('\n\x1b[36mNext steps:\x1b[0m');
      console.log('1. Push your code to a repository');
      console.log('2. Deploy the backend following the DEPLOYMENT.md guide');
      console.log('3. Deploy the frontend following the DEPLOYMENT.md guide');
      console.log('\n\x1b[36mHappy deploying! 🌱\x1b[0m\n');
    }
  } catch (error) {
    console.error('\x1b[31mDeployment preparation failed:', error.message, '\x1b[0m');
  } finally {
    rl.close();
  }
}

main(); 