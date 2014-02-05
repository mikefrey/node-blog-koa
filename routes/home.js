var Post = require('../models/post')

module.exports = {

  // route: GET /
  // lists last 5 posts
  index: function *(next) {
    var posts = yield Post.list({ limit:5 })
    var data = { posts:posts }
    this.body = yield this.render('index', data)
  }

}
