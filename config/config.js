require('dotenv').config();

module.exports = {
     port : process.env.PORT || 8080,
     dbport : process.env.DB_PORT ||  'mongodb://127.0.0.1:27017/',
     dbname : process.env.DB_NAME,
     jwtSecret : process.env.JWT_SECRET
}