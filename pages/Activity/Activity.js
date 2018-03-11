const app = getApp();
Page(
  {
    data:{
    activity:[],
    num:[],
    Icon:[],
    userInfo:[],

  },
    onLoad :function(options)
    {
      
      var that=this;
      that.setData({
        activity: app.globalData.storyListG,
        num: options.number
  
      })
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
      wx.request({
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

        }
        
      });
      wx.request({
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
      })
    },

      
      
      
    }
)