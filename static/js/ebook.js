// 获取当前url地址的pathname中的第二个/后面的内容
// 如http://localhost:3000/ebook/15382402，将会得到15382402
var reg = /\/[^\/]+\/([^\/]+)/;
var id = window.location.pathname.match(reg)[1];

var app = new Vue({
  el: '#app',
  data: {
    isBundle: false
  },
  created: async function () {
    var response = await this.$http.get('/ajax/works_type_id?identity=' + id).catch((err) => console.log(err));
    this.isBundle = response.body.is_bundle;
    var url1 = this.isBundle ? '/ajax/bundle/' + id : '/ajax/ebook/' + id;
    var url2 = this.isBundle ? '/ajax/bundle/' + id + '/bundle_works_list' : '/ajax/ebook/' + id + '/reviews';
    var response1 = await this.$http.get(url1).catch((err) => console.log(err));
    var response2 = await this.$http.get(url2).catch((err) => console.log(err));

  }

});