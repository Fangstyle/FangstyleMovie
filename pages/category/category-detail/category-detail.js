var postsData = require('../../../data/category-data.js');
Page({
    onLoad:function (option) {
        var id = option.id;
        var data = postsData.postList[id];
        this.setData({
            currentId:id,
            dataList:data
        });
    },
    data:{

    }

});