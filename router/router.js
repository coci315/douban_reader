const router = require('koa-router')();
const service = require('../service/webAppService');

// 测试路由
router.get('/route_test', (ctx) => {
  ctx.body = 'hello koa';
});
// 模板测试路由
router.get('/view_test', async function (ctx, next) {
  await ctx.render('test', {
    title: 'view_test'
  });
});
// 首页
router.get('/', async function (ctx, next) {
  await ctx.render('index', {
    title: '首页'
  });
});
// 搜索
router.get('/search', async function (ctx, next) {
  await ctx.render('search', {
    title: '搜索'
  });
});
// 书籍详情页
router.get('/ebook/:id', async function (ctx, next) {
  await ctx.render('ebook', {
    title: '书籍详情页'
  });
});
// 专栏
router.get('/column', async function (ctx, next) {
  await ctx.render('column', {
    title: '专栏'
  });
});
// 连载
router.get('/serial', async function (ctx, next) {
  await ctx.render('serial', {
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