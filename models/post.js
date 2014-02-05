var filePath = __dirname + '/../data/posts.json'

var DB = require('./db')
var db = new DB(filePath)

function makeKey(str) {
  return str.replace(/\s/g, '_').replace(/[^\w\d\-]/g, '').toLowerCase()
}

var Post = module.exports = function(key, attrs) {
  this.key = key

  if (attrs) {
    this.title = attrs.title
    this.date = attrs.date
    this.body = attrs.body
  }
}

Post.prototype.save = function *() {
  this.key = this.key || makeKey(this.title)
  var posts = yield db.read()
  posts[this.key] = {
    key: this.key,
    title: this.title,
    date: this.date,
    body: this.body
  }
  return yield db.write(posts)
}

Post.get = function *(key) {
  var posts = yield db.read()
  return posts[key]
}

Post.del = function *(key) {
  var posts = yield db.read()
  delete posts[key]
  return yield db.write(posts)
}

Post.list = function *(options) {
  var results = []
  var reverse = options.reverse !== false

  var posts = yield db.read()
  var keys = Object.keys(posts)
  var count = options.limit || keys.length

  for (var i = keys.length-1; i >= 0; i--) {
    var key = keys[i]
    results.push(posts[key])
    if (results.length == count)
      break
  }

  return results
}
