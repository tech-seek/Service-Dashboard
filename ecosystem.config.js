 module.exports = {
  apps: [
    {
      name: "netflix-app",
      script: "npm", // Change this to "npm"
      args: "start", // Add this line
      instances: 1, // Or 'max' for clustering
      autorestart: true,
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 3000 // Set the PORT environment variable
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000 // Set the PORT environment variable
      }
    }
  ]
};
