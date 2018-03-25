const app=getApp();

Page({
  data: {
    uploadTimes1:1,//公告的计数
    uploadTimes2:1,//文章的计数
    currentTab:0,//当前所在的tab
    Icon:[],
    uploadTimes:1,
    hiden:true,
    topStories: [   //滚动栏里面的文章
      
      '../../res/logo.png',
    ],
    hotNews:[],
    storyList:[],
    articles:[],
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
    app.gloabalData.storyListG = that.data.storyList;//更新全局变量
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
    //获取公告信息
    getAnnouncement(this);
    //获取文章信息
    getArticle(this)
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
        app.globalData.storyListG = res.data;//将得到的数组赋给全局变量
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
      },
      fail:function(){
        wx.showModal({
          title: '网络错误',
          content: '网络连接失败，请检查您的网络设置',
          showCancel:false,
        })
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
    wx.navigateTo({
      url: '../Imformation/Imformation?index='+dataI
    })
  }
})

function getArticle(that){//得到文章标题和图片
  that.setData({
    uploadTimes2:1,
  })
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handlelookarticle',
    data:{
      'page':that.data.uploadTimes2
    },
    success:function(res){
      console.log(res.data);
      //处理图片数组
      var l = res.data;
      for (var j = 0; j < l.length; j++) {
        var t = l[j].image_path.split("&");//取出图片名
        t.pop();//删除最后一个空白元素
         var p = t;
        for (var i = 0; i < t.length; i++) {
          p[i] = 'https://brightasdream.cn/uploadImage/articleupload/Administrator/' + p[i];//得到服务器上的图片的路劲
        }
        res.data[j].image_path=p;
      }
      console.log(res.data);
      that.setData({
        articles:res.data,
      })
      that.setData({  //请求成功将页面计数加一
        uploadTimes2:that.data.uploadTimes2++
      })
      
      //更新全局变量
      app.globalData.articleArray = res.data;
    },
    fail:function(res){
      wx.showToast({
        title: '获取信息失败',
      })
    }
  })
}

function getAnnouncement(that) {//得到公告标题和图片
  that.setData({
    uploadTimes1: 1,
  })
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handlelookannouncement',
    data: {
      'page': that.data.uploadTimes1
    },
    success: function (res) {
      console.log(res.data);
      //处理图片数组
      var l = res.data;
      for (var j = 0; j < l.length; j++) {
        var t = l[j].image_path.split("&");//取出图片名
        t.pop();//删除最后一个空白元素
        var p = t;
        for (var i = 0; i < t.length; i++) {
          p[i] = 'https://brightasdream.cn/uploadImage/announcementupload/Announcement/' + p[i];//得到服务器上的图片的路劲
        }
        res.data[j].image_path = p;
      }
      console.log(res.data);
      that.setData({
        topStories: res.data,
      })
      that.setData({  //请求成功将页面计数加一
        uploadTimes1: that.data.uploadTimes1++
      })

      //更新全局变量
      app.globalData.announceArray = res.data;
    },
    fail: function (res) {
      wx.showToast({
        title: '获取信息失败',
      })
    }
  })
}