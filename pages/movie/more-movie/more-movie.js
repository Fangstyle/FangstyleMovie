// pages/movie/more-movie/more-movie.js
var appInstance = getApp();
var utils = require('../../../utils/utils.js');
Page({
  data:{
    dataList:{}
  },
  onLoad:function(options){
    var categoryName = options.categoryName; // 根据传入的类别  请求不同数据
    this.setData({
      navigateTitle :categoryName
    });
   this.getDataFromSever();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getDataFromSever:function () {
    var self =this;
    var dataUrl = "";
    switch (this.data.navigateTitle) {
      case "inTheaters":
        dataUrl = appInstance.globalData.doubanBase +
            "/v2/movie/in_theaters";
        break;
      case "comingSoon":
        dataUrl = appInstance.globalData.doubanBase +
            "/v2/movie/coming_soon";
        break;
      case "top250":
        dataUrl = appInstance.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    utils.httpGet(dataUrl,self.storageMovieListData);
  },
  storageMovieListData:function (data) {
    var movies = [];
    for (var itemKey in data.data.subjects) {
      var item = data.data.subjects[itemKey];
      var title = item.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] -->5分 [1,1,1,2,0] -->3.5分
      var temp = {
        stars: utils.convertToStarsArray(item.rating.stars),
        title: title,
        average: item.rating.average,
        coverageUrl: item.images.large,
        movieId: item.id
      };
      movies.push(temp);
    }
    this.setData({
      dataList : movies
    });
  }
});