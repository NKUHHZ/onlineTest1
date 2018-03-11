Page({
  data: {
    Icon:[],
    uploadTimes:1,
    hiden:true,
    topStories: [
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=684276477,2474013616&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1623529198,932220174&fm=27&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1446989525,2907093786&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1192368817,540312063&fm=27&gp=0.jpg',
    ],
    getStorydata:[

    ],
    storyList:[],
  },
  LM: function (e) {
    
    var that = this;
    console.log('555')
    that.setData({
      hiden:true
    })
    if(that.data.uploadTimes>=5)
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
          Icon: that.data.Icon.concat(p[j][0]),
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
    console.log(e)
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: 'https://brightasdream.cn/uploadImage/handlelatestdynamic',
      data:{
        'page':that.data.uploadTimes,
      },

      success:function(res){
        console.log(res.data);
        that.setData({
          storyList:res.data,
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
              Icon: that.data.Icon.concat(p[j][0]),
            }

    
          )
        }
      }
    })
    that.setData({
    uploadTimes:that.data.uploadTimes+1
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  loadMore: function(e){
    var that=this;
    
  }
})