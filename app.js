const Koa = require('koa');
const views = require('koa-views');
const staticServer = require('koa-static-server');

const routes = require('./router/router');

const app = new Koa();

app.use(staticServer({
  rootDir: './static',
  rootPath: '/static/',
  maxage: 0
}));

// Must be used before any router is used 
app.use(views(__dirname + '/views', {
  map: {
    html: 'nunjucks'
  }
}));

app.use(routes);
app.listen(3000);
console.log('server start');