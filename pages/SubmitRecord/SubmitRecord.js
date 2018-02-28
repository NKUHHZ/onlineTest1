//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    attention: '0',
    location: '无',
    record: '0',
    list:[],//用来存从服务器获取的信息，包括图片名称数组等等
    paths:[]
  },
  onLoad: function () {
    var that = this;
    queryRequest(that);//不知道应该把request放在哪里...总是报错...心情复杂
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo.nickName
          })
        }
      })
    }
  },
 
  
})
function queryRequest(that) {
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handleLookSelf',
    data: {
      'user_id':wx.getStorageSync('session_key')
    },
    header: {
      'content-type': 'application/json'
    },
    dataType:"json",
    success: function (res) {
      // success
      console.log(res.data);
      var l = res.data;
      var p = new Array(l.length);
      for(var j=0;j <l.length;j++){
        var t = l[j].image_path.split("&");//取出图片名
        t.pop();//删除最后一个空白元素
        p[j]=new Array(t.length);
        p[j]=t;
        for(var i=0;i<t.length;i++){
          p[j][i] = 'https://brightasdream.cn/uploadImage/upload/' + wx.getStorageSync('session_key') + '/' + l[j].uploadId + '/' + p[j][i];//得到服务器上的图片的路劲
        }
      }
      //for (var i = 0; i < list.length; i++) {
        //var a = timeString(list[i].display_time);
        //list[i].time = a;
        //list[i].name = list[i].user.name;
        //list[i].pic = list[i].user.avatar;
      //}
      that.setData({   //这里调用setData时不能用this.setData，会报错  
        list: l,
        paths:p
      })
      
      console.log(that.data.paths);
    }
  })
}