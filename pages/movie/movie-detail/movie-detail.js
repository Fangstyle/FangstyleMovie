// pages/movie/more-detail/more-detail.js
var appInstance = getApp();
var utils = require('../../../utils/utils.js');
Page({
    data: {},
    onLoad: function (options) {
        var detailId = options.id;
        this.setData({
            id: detailId
        });
        var url = appInstance.globalData.doubanBase + '/v2/movie/subject/' + detailId;
        utils.httpGet(url, this.parseData)
    },
    parseData: function (res) {
        if (!res) {
            return;
        }
        var data = res.data;
        var director = {
            avatar: "",
            name: "",
            id: ""
        };
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large

            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        this.setData({
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,//原标题
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),//类型 爱情，冒险。。
            stars: utils.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: utils.convertToCastString(data.casts), //数组对象 转成字符串（周星驰/吴孟达/蔡少芬）
            castsInfo: utils.convertToCastInfos(data.casts),//转化为一个 对象数组 [ { name:'' ,imgUrl:''} ,{ name:'' ,imgUrl:''}]
            summary: data.summary
        })
    }
});