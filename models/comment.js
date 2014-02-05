var filePath = __dirname + '/../data/comments.json'

var DB = require('./db')
var db = new DB(filePath)

function makeKey(str) {
  return str.replace(/\s/g, '_').replace(/[^\w\d\-]/g, '').toLowerCase()
}

var Comment = module.exports = function(key, attrs) {
  this.key = key

  if (attrs) {
    this.author = attrs.author
    this.date = attrs.date
    this.body = attrs.body
  }
}

Comment.prototype.save = function *() {
  this.key = this.key || makeKey(this.author)
  var comments = yield db.read()
  comments[this.key] = {
    author: this.author,
    date: this.date,
    body: this.body
  }
  return yield db.write(comments)
}

Comment.get = function *(key) {
  var comments = yield db.read()
  return comments[key]
}

Comment.del = function *(key) {
  var comments = yield db.read()
  delete comments[key]
  return yield db.write(comments)
}

Comment.list = function *(options) {
  var results = []
  var reverse = options.reverse !== false

  var comments = yield db.read()
  var keys = Object.keys(comments)
  var count = options.limit || keys.length

  for (var i = keys.length-1; i >= 0; i--) {
    var key = keys[i]
    results.push(comments[key])
    if (results.length == count)
      break
  }

  return results
}
