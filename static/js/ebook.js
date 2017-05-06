// 获取当前url地址的pathname中的第二个/后面的内容
// 如http://localhost:3000/ebook/15382402，将会得到15382402
var reg = /\/[^\/]+\/([^\/]+)/;
var id = window.location.pathname.match(reg)[1];

var app = new Vue({
  el: '#app',
  data: {
    ebookLink: '/reader/ebook/' + id,
    isBundle: false,
    showFull: false,
    showFullToc: false,
    bundleData: {},
    bundleWorks: [],
    ebookData: {},
    reviews: [],
    showicon: false
  },
  computed: {
    starsCount: function () {
      return 'stars-' + Math.round(this.ebookData.average_rating);
    }
  },
  delimiters: ['${', '}'],
  filters: {
    formatPrice: function (price) {
      if (price === 0) return '免费';
      return '￥' + (price / 100).toFixed(2);
    },
    formatRating: function (rating) {
      return (rating * 2).toFixed(1);
    }
  },
  created: async function () {
    var response = await this.$http.get('/ajax/works_type_id?identity=' + id).catch((err) => console.log(err));
    this.isBundle = response.body.is_bundle;
    var url1 = this.isBundle ? '/ajax/bundle/' + id : '/ajax/ebook/' + id;
    var url2 = this.isBundle ? '/ajax/bundle/' + id + '/bundle_works_list' : '/ajax/ebook/' + id + '/reviews';
    var response1 = await this.$http.get(url1).catch((err) => console.log(err));
    var response2 = await this.$http.get(url2).catch((err) => console.log(err));
    if (this.isBundle) {
      this.bundleData = response1.body;
      document.title = this.bundleData.title + ' | 豆瓣阅读';
      document.getElementById('g-footer').style.marginBottom = '46px';
      this.bundleWorks = response2.body;
    } else {
      this.ebookData = response1.body;
      document.title = this.ebookData.title + ' - 作品详情 | 豆瓣阅读';
      response2.body.forEach(item => item.showFullReview = false);
      this.reviews = response2.body;
    }
  },
  methods: {
    toggleShowFull: function () {
      this.showFull = !this.showFull;
    },
    toggleShowFullToc: function () {
      if (this.ebookData.table_of_contents.length <= 6) return;
      this.showFullToc = !this.showFullToc;
    },
    toggleShowFullReview: function (item) {
      item.showFullReview = !item.showFullReview;
    },
    loadmore: function () {
      this.showicon = true;
      this.$http.get('/ajax/ebook/' + id + '/reviews' + '?start=' + this.reviews.length + '&limit=10').then(response => {
        this.showicon = false;
        response.body.forEach(item => item.showFullReview = false);
        this.reviews = this.reviews.concat(response.body);
      }, response => {
        console.log(response);
      });
    }
  }
});