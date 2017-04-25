const router = require('koa-router')();
const service = require('../service/webAppService');

// 引入并配置模板引擎nunjucks
const nunjucks = require('nunjucks');

function createEnv(path, opts) {
  var
    autoescape = opts.autoescape && true,
    noCache = opts.noCache || false,
    watch = opts.watch || false,
    throwOnUndefined = opts.throwOnUndefined || false,
    env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader('views', {
        noCache: noCache,
        watch: watch,
      }), {
        autoescape: autoescape,
        throwOnUndefined: throwOnUndefined
      });
  if (opts.filters) {
    for (var f in opts.filters) {
      env.addFilter(f, opts.filters[f]);
    }
  }
  return env;
}

var env = createEnv('views', {
  watch: true,
  filters: {
    hex: function (n) {
      return '0x' + n.toString(16);
    },
    formatPrice: function (price) {
      return '￥ ' + (price / 100).toFixed(2);
    }
  }
});

// 测试路由
router.get('/route_test', (ctx) => {
  ctx.body = 'hello koa';
});
// 模板测试路由
router.get('/view_test', async function (ctx, next) {
  ctx.body = await env.render('test.html', {
    title: 'view_test'
  });
});
// 首页
router.get('/', async function (ctx, next) {
  const categories = await service.getCategoryData();
  ctx.body = await env.render('index.html', {
    bannerLink: 'https://read.douban.com/topic/1061/?ici=%E7%A7%92%E6%9D%80&amp;icn=index-banner',
    bannerBG: 'https://img1.doubanio.com/view/ark_campaign_pic/large/public/4208.jpg',
    categories: categories,
    cateName: {
      new: '新上架',
      top: '热门',
      gallery: '画册',
      free: '免费'
    }
  });
});
// 搜索
router.get('/search', async function (ctx, next) {
  ctx.body = await env.render('search.html', {
    title: '搜索'
  });
});
// 书籍详情页
router.get('/ebook/:id', async function (ctx, next) {
  ctx.body = await env.render('ebook.html', {
    title: '书籍详情页'
  });
});
// 专栏
router.get('/column', async function (ctx, next) {
  ctx.body = await env.render('column.html', {
    title: '专栏'
  });
});
// 连载
router.get('/serial', async function (ctx, next) {
  ctx.body = await env.render('serial.html', {
    title: '连载'
  });
});
// api测试路由
router.get('/api_test', async function (ctx, next) {
  ctx.body = await service.getTestData();
});
// 获取首页数据，提前存在本地的json文件
router.get('/ajax/index', async function (ctx, next) {
  ctx.body = await service.getIndexData();
});
// 获取首页数据，转发豆瓣首页的ajax接口
router.get('/ajax/category', async function (ctx, next) {
  ctx.body = await service.getCategoryData();
});
// 获取不同频道的数据
router.get('/ajax/channel', async function (ctx, next) {
  const kindArray = ['column', 'serial'];
  const kind = ctx.query.kind;
  if (!kind || kindArray.indexOf(kind) === -1) {
    return ctx.body = '{"r":1}';
  }
  ctx.body = await service.getChannelData(kind);
});
// 查询接口，调用豆瓣阅读查询接口
router.get('/ajax/search', async function (ctx, next) {
  const start = ctx.query.start || 0;
  const limit = ctx.query.limit || 10;
  const query = ctx.query.query || '';
  ctx.body = await service.getSearchData(start, limit, query);
});

module.exports = router.routes();