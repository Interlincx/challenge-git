var http = require('http')
var cuid = require('cuid')
var sendJson = require('send-data/json')
var ReqLogger = require('req-logger')
var healthPoint = require('healthpoint')
var HttpHashRouter = require('http-hash-router')

var version = require('../package.json').version

var router = HttpHashRouter()
var logger = ReqLogger({ version: version })
var health = healthPoint({ version: version })

router.set('/favicon.ico', empty)

module.exports = function createServer () {
  return http.createServer(handler)
}

function handler (req, res) {
  if (req.url === '/health') return health(req, res)
  req.id = cuid()
  logger(req, res, { requestId: req.id })
  router(req, res, { }, onError.bind(null, req, res))
}

function onError (req, res, err) {
  if (!err) return

  res.statusCode = err.statusCode || 500
  logError(req, res, err)

  sendJson(req, res, {
    error: err.message || http.STATUS_CODES[res.statusCode]
  })
}

function logError (req, res, err) {
  if (process.env.NODE_ENV === 'test') return

  var logType = res.statusCode >= 500 ? 'error' : 'warn'

  console[logType]({
    err: err,
    requestId: req.id,
    statusCode: res.statusCode
  }, err.message)
}

function empty (req, res) {
  res.writeHead(204)
  res.end()
}
