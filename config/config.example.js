const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "My_secret_key",
    mongoUri: process.env.MONGODB_URI || process.env.MONGO_HOST ||  'mongodb+srv://',
    serverUrl: process.env.serverUrl || 'http://localhost:3000'
}

export default config
