var sublevel = require('level-sublevel')

var db = sublevel(require('../db'), 'things')

module.exports = db
