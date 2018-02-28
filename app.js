//app.js
App({
  onLaunch: function () {
  //检查session是否过期
    wx.checkSession({
      success:function(){
        //session有效则可以直接和服务器通讯，不需要登陆
        wx.login({
          success: function (res) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var code = res.code
            wx.request({
              url: 'https://brightasdream.cn/uploadImage/handleLogin',
              data: {
                'code': code,
                'operation': 'login'
              },
              success: function (res) {
                //将服务器返回的session_key存到本地
                var session_key = res.data;
                console.log('登陆成功' + res.data);
                wx.setStorageSync('session_key', session_key)
              },
              fail: function (res) {
                //wx.setStorageSync("session_key", bright);
                console.log(res);
                console.log('登录失败');
              }
            })
          },
          fail: function () {
            //如果获取登陆权限失败则提示用户请登陆
            wx.showToast({
              title: '登陆失败，请请授予登录！！',
            })
          }
        })
      },
      fail:function(){
        // session失效则需要登陆登录
        wx.login({
          success: function (res) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var code = res.code
            wx.request({
              url: 'https://brightasdream.cn/uploadImage/handleLogin',
              data: {
                'code': code,
                'operation': 'login'
              },
              success: function (res) {
                //将服务器返回的session_key存到本地
                var session_key = res.data;
                console.log('登陆成功' + res.data);
                wx.setStorageSync('session_key', session_key)
              },
              fail: function (res) {
                //wx.setStorageSync("session_key", bright);
                console.log(res);
                console.log('登录失败');
              }
            })
          },
          fail: function () {
            //如果获取登陆权限失败则提示用户请登陆
            wx.showToast({
              title: '登陆失败，请请授予登录！！',
            })
          }
        })
      }
    }),
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
  },
  globalData: {
    userInfo: null
  }
})