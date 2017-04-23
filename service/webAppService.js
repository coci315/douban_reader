const fs = require('fs');
const path = require('path');
const rp = require('request-promise');

// 测试数据
exports.getTestData = function () {
  const content = fs.readFileSync(path.resolve(__dirname, '../mock/test.json'), 'utf-8');
  return content;
};
// 首页数据，提前存在本地的json文件
exports.getIndexData = function () {
  const content = fs.readFileSync(path.resolve(__dirname, '../mock/index/index.json'), 'utf-8');
  return content;
};
// 首页数据，调用豆瓣阅读首页的ajax接口
exports.getCategoryData = function () {
  const options = {
    uri: 'https://read.douban.com/j/category/',
    json: true
  };
  return rp(options);
};
// 获取不同频道的数据
exports.getChannelData = function (kind) {
  const content = fs.readFileSync(path.resolve(__dirname, '../mock/channel/' + kind + '.json'), 'utf-8');
  return content;
};
// 查询接口，调用豆瓣阅读查询接口
exports.getSearchData = function (start, limit, query) {
  const options = {
    uri: 'https://read.douban.com/j/search',
    qs: {
      start,
      limit,
      query
    },
    json: true
  };
  return rp(options);
};