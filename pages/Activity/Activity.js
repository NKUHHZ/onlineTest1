const app = getApp();
Page(
  {
    data:{
    activity:[],
    num:[],
    Icon:[],
    userInfo:[],
    isAttenioned:false,
    userIcon:'../../res/user-unlogin.png'
  },
  attentionUser:function(){
    var that = this;
    if(that.data.isAttentioned){
      wx.request({
        url: 'https://brightasdream.cn/uploadImage/handlecancelconcerndynamic',
        data: {
          'user_id': wx.getStorageSync('session_key'),
          'upload_id': that.data.activity.uploadId,
        },
        header: {
          'content-type': 'application/json'
        },
        dataType: "json",
        success:function(res){
          console.log(res.data);
          that.data.activity.attention_number--;
          that.setData({
            isAttentioned:false,
            activity: that.data.activity,
          })
        },
        fail:function(res){
          wx.showToast({
            title: '获取信息失败',
          })
        }
      })
      return;
    }
   
    wx.request({
      url: 'https://brightasdream.cn/uploadImage/handleconcerndynamic',
      data:{
        'user_id':wx.getStorageSync('session_key'),
        'upload_id':that.data.activity.uploadId,
        'signal':'no'
      },
      header: {
        'content-type': 'application/json'
      },
      dataType: "json", 
      success:function(res){
        console.log(res.data);
        that.data.activity.attention_number++;
        that.setData({
          activity:that.data.activity,
          isAttentioned: true,
        })
      },
      fail:function(res){
        wx.showToast({
          title: '获取信息失败',
        })
      }
    })
  },
    onLoad :function(options)
    {
      
      var that=this;
      that.setData({
        activity: app.globalData.storyListG,
        num: options.number
  
      })
      console.log(that.data.activity);
      var l = app.globalData.storyListG;
      var image_path = l.image_path;
      var temp = image_path.split("&");
      var userId = l.uploadId.split("$");
      temp.pop();
      var p=new Array(temp.length);
      p=temp;
      for(var i=0;i<temp.length;i++){
        p[i] = 'https://brightasdream.cn/uploadImage/upload/' + userId[0] + '/' + l.uploadId + '/' + p[i];//得到服务器上的图片的路劲
      }
      image_path=p;
      console.log(image_path)
      that.setData({
        Icon: image_path,
      })
      wx.request({//获取用户信息
        url: 'https://brightasdream.cn/uploadImage/handleAlldate',
        data:{
          'user_id':userId[0]
        }, 
        header: {
          'content-type': 'application/json'
        },
        dataType: "json", 
        success:function(res){
          that.setData({
            userInfo:res.data
          })
          console.log("&&&&&&&&&&&&")
          console.log(that.data.activity)
        },
        fail:function(res){
          wx.showToast({
            title: '获取信息失败',
          })
        }
        
      });
      wx.request({//更新浏览量
        url: 'https://brightasdream.cn/uploadImage/handlelookdynamic',

        data: {
          'upload_id': that.data.activity.uploadId
        },
        header: {
          'content-type': 'application/json'
        },
        dataType: "json",
        success: function (res) {
          console.log(res.data)
        },
        fail: function (res) {
          console.log("fail")
        }
      });
      wx.request({//更新查看是否已经关注
        url: 'https://brightasdream.cn/uploadImage/handleconcerndynamic',
        data: {
          'user_id': wx.getStorageSync('session_key'),
          'upload_id':that.data.activity.uploadId,
          'signal':'yes'
        },
        header: {
          'content-type': 'application/json'
        },
        dataType: "json",
        success: function (res) {
          var t = res.data;
          console.log(res.data)
          if(t=='1yes'){
            that.setData({
              isAttentioned:true,
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '获取信息失败',
          })
        } 

      });
      
    },
    preview :function(res)
    {
      var current = res.currentTarget.dataset.src;
      wx.previewImage({
        current: current, // 当前显示图片的http链接  
        urls: this.data.Icon // 需要预览的图片http链接列表  
    }
    )}

  }
)