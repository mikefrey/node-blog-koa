var Post = require('../models/post')
var parse = require('co-body')

// fetch the post with the given id
var getPost = function *(next) {
  var key = this.params.post
  var post = this.post = yield Post.get(key)
  if (!post) return yield error.call(this, 404)
  yield next
}


// load the post off of the request stream
// and create a Post model instance
var postBody = function *(next) {
  var key = this.params.post || null
  var data = yield parse.form(this.request)
  var date = new Date()
  var post = new Post(key)
  post.title = data.title
  post.body = data.body
  post.date = date.toDateString() + ' ' + date.toTimeString().substring(0,5)

  this.post = post
  yield next
}

// respond with the given error code and
// render the error page
var error = function *(statusCode) {
  this.response.statusCode = statusCode
  this.body = yield this.render('error/'+statusCode)
}



module.exports = {

  // route: GET /
  // lists last 5 posts
  index: function *(next) {
    var posts = yield Post.list({ limit:5 })
    var data = { posts:posts }
    this.body = yield this.render('index', data)
  },

  // route: GET /new
  // shows form for writing a new post
  new: function *(next) {
    var data = { post:{} }
    this.body = yield this.render('write', data)
  },

  // route: POST /
  // saves a new post
  create: [postBody, function *(next) {
    yield this.post.save()
    this.response.redirect('/posts/' + this.post.key)
  }],

  // route: GET /:id
  // shows the post with the given id
  show: [getPost, function *(next) {
    var data = { post:this.post, comments:[] }
    this.body = yield this.render('post', data)
  }],

  // route: GET /:id/edit
  // shows the post with the given id in a form
  edit: [getPost, function *(next) {
    var data = { post:this.post }
    this.body = yield this.render('write', data)
  }],

  // route: PUT /:id
  // updates the post with the given id
  update: [postBody, function *(next) {
    yield this.post.save()
    this.response.redirect('/posts/' + this.post.key)
  }],

  // route: DELETE /:id
  // destroys the post with the given id
  destroy: function *(next) {
    var key = this.params.id
    yield Post.del(key)
    this.response.redirect('/')
  }

}
