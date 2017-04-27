// 获取当前url地址的pathname中的第二个/后面的内容
// 如http:localhost:3000/category/new，将会得到new
var reg = /\/[^\/]+\/([^\/]+)/;
var kind = window.location.pathname.match(reg)[1];

var app = new Vue({
  el: '#app',
  data: {
    works: [],
    showicon: false
  },
  computed: {
    hrefs: function () {
      return this.works.map(item => {
        return '/ebook/' + item.id;
      });
    }
  },
  filters: {
    formatPrice: function (price) {
      return '￥' + (price / 100).toFixed(2);
    }
  },
  delimiters: ['${', '}'],
  created: function () {
    this.$http.get('/ajax/category/' + kind + '?start=0&limit=10').then(response => {
      this.works = response.body;
    }, response => {
      console.log(response);
    });
  },
  methods: {
    loadmore: function () {
      this.showicon = true;
      this.$http.get('/ajax/category/' + kind + '?start=' + this.works.length + '&limit=10').then(response => {
        this.showicon = false;
        this.works = this.works.concat(response.body);
      }, response => {
        console.log(response);
      });
    }
  }
});