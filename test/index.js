process.env.NODE_ENV = 'test'

var tape = require('tape')
var servertest = require('servertest')

var server = require('../lib/server')

tape('healthcheck', function (t) {
  var url = '/health'
  servertest(server(), url, {encoding: 'json'}, function (err, res) {
    t.ifError(err, 'no error')

    t.equal(res.statusCode, 200, 'correct statusCode')
    t.equal(res.body.status, 'OK', 'status is ok')
    t.end()
  })
})
