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
      if (price === 0) return '免费';
      return '￥ ' + (price / 100).toFixed(2);
    }
  }
});

// 测试路由
router.get('/route_test', (ctx) => {
  // 获取豆瓣首页banner的链接地址及图片URL
  service.getIndexBannerData();
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
  let categories = await service.getIndexDataByDouban();
  categories = service.transformURLinJSON(categories);
  ctx.body = await env.render('index.html', {
    bannerLink: 'https://read.douban.com/competition/2016/?ici=index-banner&amp;icn=index-banner',
    bannerBG: '/ajax/image/?url=https://img3.doubanio.com/view/ark_campaign_pic/large/public/4136.jpg',
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
  let data = await service.getChannelDataByDouban('column');
  data = service.transformURLinJSON(data);
  ctx.body = await env.render('column.html', {
    data: data,
    title: '专栏',
    headerTitle: '豆瓣专栏',
    subtitle: '世间之事，经验之谈。',
    kind: 'column'
  });
});
// 连载
router.get('/serial', async function (ctx, next) {
  let data = await service.getChannelDataByDouban('serial');
  data = service.transformURLinJSON(data);
  ctx.body = await env.render('column.html', {
    data: data,
    title: '连载',
    headerTitle: '豆瓣连载',
    subtitle: '追就对了。',
    kind: 'serial'
  });
});
// 分类列表页
router.get('/category/:category', async function (ctx, next) {
  const titles = {
    new: '新上架',
    top: '热门',
    gallery: '画册',
    free: '免费'
  };
  ctx.body = await env.render('category.html', {
    title: titles[ctx.params.category]
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
// 获取不同频道的数据，转发豆瓣相关页面的ajax接口
router.get('/ajax/channel', async function (ctx, next) {
  const kindArray = ['column', 'serial'];
  const kind = ctx.query.kind;
  if (!kind || kindArray.indexOf(kind) === -1) {
    return ctx.body = '{"r":1}';
  }
  ctx.body = await service.getChannelDataByDouban(kind);
});
// 查询接口，调用豆瓣阅读查询接口
router.get('/ajax/search', async function (ctx, next) {
  const start = ctx.query.start || 0;
  const limit = ctx.query.limit || 10;
  const query = ctx.query.query || '';
  ctx.body = await service.getSearchData(start, limit, query);
});

// 由于豆瓣图片有防外链，需要转发请求
router.get('/ajax/image', function (ctx, next) {
  const url = ctx.query.url;
  const referer = 'https://read.douban.com/';
  if (!url) {
    return ctx.status = 404;
  } else {
    ctx.type = 'image/jpeg';
    ctx.body = service.proxyImage(url, referer);
  }
});

// 获取分类数据，转发豆瓣ajax接口
router.get('/ajax/category/:kind', async function (ctx, next) {
  const kind = ctx.params.kind;
  const start = ctx.query.start || 0;
  const limit = ctx.query.limit || 10;
  let data = await service.getCategoryDataByDouban(kind, start, limit);
  data = service.transformURLinJSON(data);
  ctx.body = data;
});

// 获取书籍详情数据，转发豆瓣ajax接口
router.get('/ajax/ebook/:id', async function (ctx, next) {
  const id = ctx.params.id;
  let data = await service.getEbookDateByDouban(id);
  data = service.transformURLinJSON(data);
  ctx.body = data;
});

// 获取书籍评论数据，转发豆瓣ajax接口
router.get('/ajax/ebook/:id/reviews', async function (ctx, next) {
  const id = ctx.params.id;
  const start = ctx.query.start || 0;
  const limit = ctx.query.limit || 10;
  let data = await service.getEbookReviewsByDouban(id, start, limit);
  data = service.transformURLinJSON(data);
  ctx.body = data;
})

module.exports = router.routes();