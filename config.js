require('dotenv').config()

module.exports = {
    port: process.env.PORT || 8080,
    db: process.env.MONGODB || 'mongodb+srv://agudelomariana2503:mao@cluster0.fkvmzan.mongodb.net/',
    SECRET_TOKEN: 'miclavedetokens'
}
exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/test';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';