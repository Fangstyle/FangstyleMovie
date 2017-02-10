// pages/movie/movie.js
var appInstance = getApp();
var utils = require('../../utils/utils.js');
Page({
    data: {
        /*存储的数据格式
         *inTheaters: {
         *  mainTitle:即将上映的电影
         *  categoryName: inTheaters
         *  movie:{
         *        stars: 45,
         *        title: 你的名字,
         *        average: 8.5,
         *        coverageUrl: http//..xx.xx.png,
         *        movieId: 26683290
         *  }
         * }
         *
         * */
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchPanelShow:false,
        search:{}
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var inTheatersUrl = appInstance.globalData.doubanBase +
            "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = appInstance.globalData.doubanBase +
            "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = appInstance.globalData.doubanBase +
            "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieData(inTheatersUrl, "inTheaters");
        this.getMovieData(comingSoonUrl, 'comingSoon');
        this.getMovieData(top250Url, 'top250');
    },
    getMovieData: function (url, storageKey) {
        var self = this;
        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            header: {
                'content-type': ' '/**/
            },
            success: function (res) {
                self.storageMovieListData(res.data, storageKey);
            }
        })
    },
    storageMovieListData: function (Doubandata, storageKey) {
        var movies = [];
        for (var itemKey in Doubandata.subjects) {
            var item = Doubandata.subjects[itemKey];
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
            var temporary = {};
            temporary[storageKey] = {
                mainTitle: Doubandata.title, /*电影列表页的标题头   eg：top250 即将上映*/
                categoryName: storageKey, /*传入下一个页面的key  让更多页面加载知道要加载哪种数据*/
                datalist: movies
            }
            this.setData(temporary);
        }
    },
    toMoreMovie: function (event) {
        var categoryName = event.currentTarget.dataset.moreMovie;
        wx.navigateTo({
            url: 'more-movie/more-movie' + '?categoryName=' + categoryName
        })
    },
    onBindFocus: function (event) {
        this.setData({
            searchPanelShow: true
        })
    },
    forSearch: function (event) {
        var searchContent = event.detail.value;
        var searchUrl = appInstance.globalData.doubanBase+"/v2/movie/search?q="+searchContent;
        this.getMovieData(searchUrl,"search");
    },
    onCancelImgTap:function () {
        this.setData({
            searchPanelShow: false
        })
    }
});