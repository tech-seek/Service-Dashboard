module.exports = {
    apps: [
        {
            name: 'netflix-app',
            script: 'npm', // Change this to "npm"
            args: 'start', // Add this line
            instances: 1, // Or 'max' for clustering
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'development',
                PORT: 3000, // Set the PORT environment variable
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000, // Set the PORT environment variable
            },
            restart_delay: 3000, // Wait 3 seconds before restarting
            max_restarts: 10, // Limit the number of consecutive restarts
            exp_backoff_restart_delay: 100, // Exponential backoff strategy
        },
    ],
};
