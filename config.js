require('dotenv').config()
var path = require('path')

module.exports = {
  level: {
    location: process.env.DB_PATH || path.join(__dirname, '../db')
  }
}
