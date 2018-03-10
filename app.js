//app.js
const app = getApp();

App({
  data:{
    userInfo:{}
  },
  globalData: {
    userInfo: null,
    loginStatus: 'fail',
  },
  onLaunch: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框      
          wx.getUserInfo({
            success: res => {
            // 可以将 res 发送给后台解码出 unionId
              
              this.globalData.userInfo = res.userInfo;
              this.data.userInfo = res.userInfo;
              var that = this;
              onLoad(that);
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          })
        }
      }
    })
  }
})

function onLoad(that){
  //检查session是否过期
  wx.checkSession({
    success: function () {
      //session有效则可以直接和服务器通讯，不需要登陆
      var user_id = 'no';
      if(user_id=='no'){
        //user_id没有缓存走登陆流程获取
        wx.login({
          success: function (res) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var code = res.code;
            wx.request({
              url: 'https://brightasdream.cn/uploadImage/handleLogin',
              data: {
                'code': code,
                'user_id': user_id,
                'user_sex': that.data.userInfo.gender,
                'user_city': that.data.userInfo.city,
                'user_name': that.data.userInfo.nickName,
                'user_profile': that.data.userInfo.avatarUrl,
              },
              header: {
                'content-type': 'application/json'
              },
              dataType: "json",
              success: function (res) {
                //将服务器返回的session_key存到本地
                var loginStatus = res.data.loginStatus;
                if (loginStatus == 'success') {
                  var session_key = res.data.user_id;
                  console.log('登陆成功' + loginStatus);
                  wx.setStorageSync('session_key', session_key);
                  that.globalData.loginStatus='success';
                } else {
                  console.log(loginStatus);
                }
              },
              fail: function (res) {
                wx.showModal({
                  title: 'Error',
                  content: '登陆失败，请检查您的网络设置',
                  showCancel:false,
                })
              },
            })
          },
          fail: function () {
            //如果获取登陆权限失败则提示用户请登陆
            wx.showModal({
              title: 'Error',
              content: '请授与登陆权限，登陆后才能使用上传等功能！',
              showCancel:false,
            })
          }
        })
        console.log('user_id='+user_id);
      }else{
        //不进行处理
        console.log(user_id);
      }
    },
    fail: function () {
      // session失效则需要登陆登录
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var code = res.code;
          var user_id = 'no';
          wx.request({
            url: 'https://brightasdream.cn/uploadImage/handleLogin',
            data: {
              'code': code,
              'user_id': user_id,
              'user_sex': that.data.userInfo.gender,
              'user_city': that.data.userInfo.city,
              'user_name': that.data.userInfo.nickName,
              'user_profile': that.data.userInfo.avatarUrl,
            },
            header: {
              'content-type': 'application/json'
            },
            dataType: "json",
            success: function (res) {
              //将服务器返回的session_key存到本地
              var loginStatus = res.data.loginStatus;
              if(loginStatus=='success'){
                var session_key = res.data.user_id;
                console.log('登陆成功' + res.data);
                wx.setStorageSync('session_key', session_key);
                that.globalData.loginStatus = 'success';
              }else{
                console.log(loginStatus);
              }
            },
            fail: function (res) {
              wx.showModal({
                title: 'Error',
                content: '登陆失败，请检查您的网络设置',
                showCancel:false,
              })
            },
          })
        },
        fail: function () {
          //如果获取登陆权限失败则提示用户请登陆
          wx.showModal({
            title: 'Error',
            content: '请授与登陆权限，登陆后才能使用上传等功能！',
            showCancel:false,
          })
        }
      })
    }
  })
}