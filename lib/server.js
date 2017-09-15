var http = require('http')
var healthPoint = require('healthpoint')

var version = require('../package.json').version

var health = healthPoint({ version: version })

module.exports = function createServer () {
  return http.createServer(handler)
}

function handler (req, res) {
  if (req.url === '/health') return health(req, res)
  return empty(req, res)
}

function empty (req, res) {
  res.writeHead(204)
  res.end()
}
