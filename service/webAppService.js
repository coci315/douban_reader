const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const cheerio = require('cheerio');

// 测试数据
exports.getTestData = function () {
  const content = fs.readFileSync(path.resolve(__dirname, '../mock/test.json'), 'utf-8');
  return JSON.parse(content);
};
// 首页数据，提前存在本地的json文件
exports.getIndexData = function () {
  const content = fs.readFileSync(path.resolve(__dirname, '../mock/index/index.json'), 'utf-8');
  return JSON.parse(content);
};
// 首页数据，调用豆瓣阅读首页的ajax接口
exports.getIndexDataByDouban = function () {
  const options = {
    uri: 'https://read.douban.com/j/category/',
    json: true
  };
  return rp(options);
};
// 获取豆瓣阅读首页banner的链接地址以及图片url
exports.getIndexBannerData = function () {
  const options = {
    uri: 'https://read.douban.com/',
    // headers: {
    //   'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    // },
    transform: function (body) {
      return cheerio.load(body);
    }
  }
  rp(options)
    .then(function ($) {
      console.log($('.slide-show').html());
    })
    .catch(function (err) {
      console.log(err);
    });
};
// 获取不同频道的数据，提前存在本地的JSON文件
exports.getChannelData = function (kind) {
  const content = fs.readFileSync(path.resolve(__dirname, '../mock/channel/' + kind + '.json'), 'utf-8');
  return JSON.parse(content);
};
// 获取不同频道的数据，调用豆瓣相关页面的ajax接口
exports.getChannelDataByDouban = function (kind) {
  const options = {
    uri: 'https://read.douban.com/j/column/?kind=' + kind,
    json: true
  };
  return rp(options);
}
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
// 下载图片
// exports.saveImage = function (url) {
//   const options = {
//     uri: url,
//     headers: {
//       // referer: 'https://read.douban.com/'
//     }
//   };
//   rp(options).pipe(fs.createWriteStream(path.resolve(__dirname, '../static/downloads/images/', '02.jpg')));
// };

// 代理图片请求
exports.proxyImage = function (url, referer) {
  const options = {
    uri: url,
    headers: {
      referer: referer
    }
  };
  return rp(options);
};

// 处理JSON中的图片url地址，将豆瓣的图片请求地址转为本地的请求地址
exports.transformURLinJSON = function (objJSON) {
  const reg = /(https:\/\/img\d\.doubanio\.com)/g;
  const strJSON = JSON.stringify(objJSON);
  const newStrJSON = strJSON.replace(reg, '/ajax/image?url=$1');
  return JSON.parse(newStrJSON);
};

// 代理分类请求
exports.getCategoryDataByDouban = function (kind, start = 0, limit = 10) {
  const options = {
    uri: 'https://read.douban.com/j/category/' + kind,
    qs: {
      start,
      limit
    },
    json: true
  };
  return rp(options);
};

// 代理书籍详情请求
exports.getEbookDateByDouban = function (id) {
  const options = {
    uri: 'https://read.douban.com/j/ebook/' + id,
    json: true
  };
  return rp(options);
};

// 代理套装详情请求
exports.getBundleDateByDouban = function (id) {
  const options = {
    uri: 'https://read.douban.com/j/bundle/' + id,
    json: true
  };
  return rp(options);
};

// 代理书籍评论请求
exports.getEbookReviewsByDouban = function (id, start = 0, limit = 10) {
  const options = {
    uri: 'https://read.douban.com/j/ebook/' + id + '/reviews',
    qs: {
      start,
      limit
    },
    json: true
  };
  return rp(options);
};

// 代理书籍套装书目请求
exports.getBundleWorksListByDouban = function (id, start = 0, limit = 10) {
  const options = {
    uri: 'https://read.douban.com/j/bundle/' + id + '/bundle_works_list',
    qs: {
      start,
      limit
    },
    json: true
  };
  return rp(options);
};

// 代理作品类型请求
exports.getWorksTypeByDouban = function (id) {
  const options = {
    uri: 'https://read.douban.com/j/works_type_id',
    qs: {
      identity: id
    },
    json: true
  };
  return rp(options);
};

// 代理书籍初始化
exports.getInitDataByDouban = function (id) {
  const options = {
    method: 'POST',
    uri: 'https://read.douban.com/j/donate/init',
    formData: {
      works_id: id
    }
  };
  return rp(options);
};