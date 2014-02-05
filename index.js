var koa = require('koa')
var staticFiles = require('koa-static')
var app = koa()

var Resource = require('koa-resource-router')
var views = require('koa-render')


// logger
app.use(function *(next) {
  var start = new Date
  yield next
  var ms = new Date - start
  var sc = this.status || '404?'
  console.log('%s %s - %s - %s', this.method, this.url, sc, ms)
})

app.use(staticFiles('./public'))
app.use(views('./views', 'ejs'))


var homeRoute = new Resource(require('./routes/home'))
var postsRoute = new Resource('posts', require('./routes/post'))
// var commentsRoute = new Resource(require('./routes/comment'))
// postsRoute.add(commentsRoute)

app.use(homeRoute.middleware())
app.use(postsRoute.middleware())

app.listen(3000)
