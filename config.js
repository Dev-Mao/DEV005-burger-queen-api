module.exports = {
    port: process.env.PORT || 8080,
    db: process.env.MONGODB || 'mongodb+srv://agudelomariana2503:mao@cluster0.fkvmzan.mongodb.net/',
    SECRET_TOKEN: 'miclavedetokens',
    dbUrl: process.env.DB_URL || 'mongodb+srv://agudelomariana2503:mao@cluster0.fkvmzan.mongodb.net/',
    secret: process.env.JWT_SECRET || 'miclavedetokens',
    adminEmail: process.env.ADMIN_EMAIL || 'mariana@admin.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'mariana',
}
