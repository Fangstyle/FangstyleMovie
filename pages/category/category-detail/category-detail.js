var postsData = require('../../../data/category-data.js');
var appInstance = getApp();
Page({
    onLoad: function (option) {
        var id = option.id;
        var data = postsData.postList[id];
        var colletionKey = "detail" + id;
        this.setData({
            currentId: id,
            dataList: data,
            colletionKey: colletionKey
        });

        this.initCollection();
        this.initMusicState();
    },
    /*查询当前Storage列表查看是否被收藏, 更换收藏按钮的背景图片(收藏/未收藏)*/
    initCollection:function () {
        var detailLocalStorgeList = wx.getStorageSync('detail_collected_list_storage');
        if (detailLocalStorgeList) {
            var isCollected = detailLocalStorgeList[this.data.currentId];
            this.setData({
                collected: isCollected
            })
        } else {
            var detailLocalStorgeList = {};
            detailLocalStorgeList[this.data.currentId] = false;
            wx.setStorageSync('detail_collected_list_storage', detailLocalStorgeList);
        }
    },
    /*根据音乐的播放状态初始化详情页上方 更换按钮的图片（播放或者暂停）*/
    initMusicState:function () {
        var self = this;
        //判断当前是否是上次打开的页面
        if(appInstance.globalData.g_isPlayingMusic_index === this.data.currentId){
        if(appInstance.globalData.g_isPlayingMusic){
            this.setData({
                isPlayingMusic: true
            })
        }
        /*监听音乐播放。*/
        wx.onBackgroundAudioPlay(function () {
            self.setData({
                isPlayingMusic: true
            })
            appInstance.globalData.g_isPlayingMusic = true;
            console.log("当前"+appInstance.globalData.g_isPlayingMusic);
        });

        /*监听音乐暂停。*/
        wx.onBackgroundAudioPause(function () {
            self.setData({
                isPlayingMusic: false
            })
            appInstance.globalData.g_isPlayingMusic = false;
            console.log("当前"+appInstance.globalData.g_isPlayingMusic);
        });
        /*监听音乐播放完成。*/
        wx.onBackgroundAudioStop(function(){
             self.setData({
                isPlayingMusic: false
            })
            appInstance.globalData.g_isPlayingMusic = false;
        })
        }
    },
    data: {
        isPlayingMusic:false
    },
    /*分享*/
    onShareTap: function () {
        var itemList = ['分享到微信好友', '分享到QQ好友', '分享到朋友圈', '分享到QQ空间'];
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                wx.showToast({
                    title: '成功' + itemList[res.tapIndex],
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function (res) {
                wx.showToast({
                    title: '失敗' + res.errMsg,
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },/*收藏*/
    onColletionTap: function () {
        var index = this.data.currentId;
        var detailLocalStorgeList = wx.getStorageSync('detail_collected_list_storage');
        var isCollected = detailLocalStorgeList[index];
        detailLocalStorgeList[index] = !isCollected;
        this.setData({
            collected: !isCollected
        })
        wx.setStorageSync('detail_collected_list_storage', detailLocalStorgeList);
    },
    onMediaPlay: function () {
        var index = this.data.currentId;
        var musicJson = postsData.postList[index].music;
        var isPlayingMusic = this.data.isPlayingMusic;
        if (!isPlayingMusic) {
            wx.playBackgroundAudio({
                dataUrl: musicJson.url,
                title: musicJson.title,
                coverImgUrl: musicJson.coverImg
            })

        } else {
            wx.pauseBackgroundAudio();
        }
        this.setData({
            isPlayingMusic: !isPlayingMusic
        })
        appInstance.globalData.g_isPlayingMusic = !isPlayingMusic;
        appInstance.globalData.g_isPlayingMusic_index = this.data.currentId;
        console.log("当前"+appInstance.globalData.g_isPlayingMusic);
    }
});