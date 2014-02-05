var fs = require('fs')
var path = require('path')


function readFile(file) {
  return function(fn) {
    fs.readFile(file, 'utf8', fn)
  }
}

function writeFile(file, data) {
  return function(fn) {
    fs.writeFile(file, data, {encoding:'utf8'}, fn)
  }
}


var DB = module.exports = function(path) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '{}', {encoding:'utf8'})
  }
  this.path = path
}

var api = DB.prototype

api.read = function *() {
  return JSON.parse(yield readFile(this.path))
}

api.write = function *(data) {
  return yield writeFile(this.path, JSON.stringify(data, 2))
}
