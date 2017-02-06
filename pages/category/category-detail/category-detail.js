var postsData = require('../../../data/category-data.js');
Page({
    onLoad:function (option) {
        var id = option.id;
        var data = postsData.postList[id];
        var colletionKey = "detail"+id;
        this.setData({
            currentId:id,
            dataList:data,
            colletionKey:colletionKey
        });

        var detailLocalStorgeList = wx.getStorageSync('detail_collected_list_storage');
        if (detailLocalStorgeList){
            var isCollected = detailLocalStorgeList[id];
            this.setData({
                collected: isCollected
            })
        }else {
            var detailLocalStorgeList = {};
            detailLocalStorgeList[id] = false;
            wx.setStorageSync('detail_collected_list_storage', detailLocalStorgeList);
        }
    },
    data:{

    },
    onShareTap:function () {
        var itemList = ['分享到微信好友', '分享到QQ好友', '分享到朋友圈','分享到QQ空间'];
        wx.showActionSheet({
            itemList:itemList,
            success: function(res) {
                wx.showToast({
                    title: '成功'+itemList[res.tapIndex],
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function(res) {
                wx.showToast({
                    title: '失敗'+res.errMsg,
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },
    onColletionTap:function () {
        var index = this.data.currentId;
        var detailLocalStorgeList = wx.getStorageSync('detail_collected_list_storage');
        var  isCollected = detailLocalStorgeList[index];
        detailLocalStorgeList[index] = !isCollected;
        wx.setStorageSync('detail_collected_list_storage', detailLocalStorgeList);
    }
});