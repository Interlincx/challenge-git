var xtend = require('xtend')
var Authentic = require('authentic-service')

var config = require('../config')

var authentic = process.env.NODE_ENV === 'test'
  ? testAuthentic
  : Authentic({ server: config.authentic.host })

module.exports = function (fn) {
  return function authify (req, res, opts, cb) {
    authentic(req, res, function (err, creds) {
      if (err) return cb(err)
      if (!creds || !creds.email) return cb(new Error('Invalid Credentials'))

      var authorized = false
      if (creds.email.match(/@lincx.la$/)) authorized = true
      if (creds.email.match(/@interlincx\.com$/)) authorized = true

      if (authorized) return fn(req, res, xtend(opts, {auth: creds}), cb)

      cb(new Error('Unauthorized: ' + creds.email))
    })
  }
}

function testAuthentic (req, res, cb) {
  return cb(null, {email: 'test@interlincx.com'})
}
