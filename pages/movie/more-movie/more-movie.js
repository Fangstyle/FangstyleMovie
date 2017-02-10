// pages/movie/more-movie/more-movie.js
var appInstance = getApp();
var utils = require('../../../utils/utils.js');
Page({
  data:{
    dataList:{},
    turgetPage:0,
    refreshMore:false
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
    this.setData({
       requestUrl:dataUrl
    });
    utils.httpGet(dataUrl,self.storageMovieListData);
    wx.showNavigationBarLoading(); //等待进度条 转圈圈
  },
  storageMovieListData:function (data) {
    var tempList = [];
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
      tempList.push(temp);
    }
    tempList = this.data.refreshMore?this.data.dataList.concat(tempList):tempList;
    this.setData({
      turgetPage:this.data.turgetPage+1,
      dataList : tempList,
      refreshMore:true
    });
    wx.hideNavigationBarLoading();
  },
  loadMoreData:function () {
    wx.showNavigationBarLoading(); //等待进度条 转圈圈
    var url = this.data.requestUrl+"?start="+(this.data.turgetPage)*20+"&count=20";
    utils.httpGet(url,this.storageMovieListData);
    console.log("加载更多");
  },
  refreshData:function () {
    wx.showNavigationBarLoading();
    var url = this.data.requestUrl+"?start=0&count=20";
    this.setData({
      refreshMore:false
    });
    utils.httpGet(url,this.storageMovieListData);
    console.log("刷新");
  },
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  toMovieDetail:function (event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../movie-detail/movie-detail' + '?id=' + movieId
    })
  }
});