const app=getApp();

Page({
  data: {
    currentTab:0,//当前所在的tab
    Icon:[],
    uploadTimes:1,
    hiden:true,
    topStories: [   //滚动栏里面的文章
      
      '../../res/logo.png',
    ],
    getStorydata:[

    ],
    storyList:[],
  },
  tab_slide: function (e) {//滑动切换tab   
    var that = this;
    that.setData({ currentTab: e.detail.current});
  },  
  swichNav: function (e) {//点击tab切换  
    var that = this;
    console.log(e)
    if (that.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },  
  LM: function (e) {//下拉加载更多动态
    
    var that = this;
    console.log('555')
    that.setData({
      hiden:true
    })
    if(that.data.uploadTimes>=10000000)
    {
      that.setData({
        hiden:false
      });
    } 
    else{
      console.log('$$$$$$$$$$$$$$$$$4')
      wx.request({url: 'https://brightasdream.cn/uploadImage/handlelatestdynamic',
        data:{
        'page': that.data.uploadTimes,
      },

  success: function (res) {
    console.log(res.data);
    if (!res.data[4]) {
      that.setData({
        hiden: false
      });
      return;
    }
    that.setData({
      storyList: that.data.storyList.concat(res.data),
    });
    console.log(that.data.storyList);
    var l = res.data;
    var p = new Array(l.length);
    for (var j = 0; j < l.length; j++) {
      var userId = l[j].uploadId.split("$");
      var t = l[j].image_path.split("&");//取出图片名
      t.pop();//删除最后一个空白元素
      p[j] = new Array(t.length);
      p[j] = t;
      for (var i = 0; i < t.length; i++) {
        p[j][i] = 'https://brightasdream.cn/uploadImage/upload/' + userId[0] + '/' + l[j].uploadId + '/' + p[j][i];//得到服务器上的图片的路劲
      }
      that.setData(
        {
          Icon: that.data.Icon.concat(p),
        }
      )
      console.log("0,0")
      console.log(that.data.Icon)
    }
  }
})
that.setData({
      uploadTimes: that.data.uploadTimes + 1
})


    }

  },
  /**
   * 这里处理滚动事件处理
   */
  listenSwiper: function (e) {
    //打印信息
    
  },

  onLoad: function (options) {
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      uploadTimes:1,
    })
    wx.request({
      url: 'https://brightasdream.cn/uploadImage/handlelatestdynamic',
      data: {
        'page': that.data.uploadTimes,
      },

      success: function (res) {
        console.log(res.data);
        if (res.data.length<5) {
          that.setData({
            hiden: false
          });
        }
        if (!res.data[0]) {
          that.setData({
            hiden: false
          });
          return;
        }
        that.setData({
          storyList: res.data,
        });
        var l = res.data;
        var p = new Array(l.length);
        for (var j = 0; j < l.length; j++) {
          var userId = l[j].uploadId.split("$");
          var t = l[j].image_path.split("&");//取出图片名
          t.pop();//删除最后一个空白元素
          p[j] = new Array(t.length);
          p[j] = t;
          for (var i = 0; i < t.length; i++) {
            p[j][i] = 'https://brightasdream.cn/uploadImage/upload/' + userId[0] + '/' + l[j].uploadId + '/' + p[j][i];//得到服务器上的图片的路劲
          }
          that.setData(
            {
              Icon: p,
            }


          )
        }
      }
    })
    that.setData({
      uploadTimes: that.data.uploadTimes + 1
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  loadMore: function(e){
    var that=this;
    
  },
  tap:function(e){
    var that=this;
    var dataI=e.currentTarget.dataset.index;
    var dataStory=e.currentTarget.dataset.story;
    app.globalData.storyListG=dataStory;
    that.data.storyList[dataI].look_number++;
    that.setData({
      storyList:that.data.storyList,
    })
    wx.navigateTo({
      url: '../Activity/Activity?number='+dataI
    })
  }
})