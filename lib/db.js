var levelup = require('levelup')
var config = require('../config')

var engine = {
  test: require('memdown'),
  production: require('mongodown'),
  development: require('leveldown')
}[process.env.NODE_ENV]

var db = module.exports = levelup(config.level.location, {
  db: engine,
  valueEncoding: 'json'
})

db.healthCheck = function (cb) {
  var now = Date.now()
  db.put('!healthCheck', now, function (err) {
    if (err) return cb(err)
    db.get('!healthCheck', function (err, then) {
      if (err) return cb(err)
      if (now !== then) return cb(new Error('DB write failed'))
      cb()
    })
  })
}
