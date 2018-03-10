//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{},
    user_icon:'../../res/user-unlogin.png',
    user_name:'点击登陆',
    loginStatus:false,
    userList:{
      attention: '0',
      record: '0',
      },
    userOperation:[
      {
        isunread: false,
        unreadNum: 2,
        icon:'../../res/png resource/bar_home_black.png',
        text:'我的上传记录',
      },
      {
        isunread: false,
        unreadNum: 2,
        icon:'../../res/png resource/bar_home_black.png',
        text:'我的关注',

      },
      {
        isunread: false,
        unreadNum: 2,
        icon:'../../res/png resource/bar_home_black.png',
        text:'我关注的用户'

      },
      {
        isunread: false,
        unreadNum: 2,
        icon:'../../res/png resource/bar_home_black.png',
        text:'关注我的用户'

      },
      {
        isunread: false,
        unreadNum: 2,
        icon:'../../res/png resource/bar_home_black.png',
        text:'关于小程序'
      }
    ]
    },
  tap:function(e){
    console.log(e.currentTarget.dataset.index);
    if(!wx.getStorageSync('session_key')){
      wx.showModal({
        title: 'Login Error',
        content: '请登陆',
      })
      return;
    }
    if(e.currentTarget.dataset.index==0)
    {
      wx.navigateTo({
        url: '/pages/SubmitRecord/SubmitRecord',
      })
    }
  },
  tapLogin:function(){
    if(wx.getStorageSync('session_key')) return;
    wx.checkSession({
      success: function () {
        //session有效则可以直接和服务器通讯，不需要登陆
        var user_id = 'no';
        if (user_id == 'no') {
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
                success: function (res) {
                  //将服务器返回的session_key存到本地
                  var session_key = res.data;
                  console.log('登陆成功' + res.data);
                  wx.setStorageSync('session_key', session_key);
                },
                fail: function (res) {
                  wx.showModal({
                    title: 'Error',
                    content: '登陆失败，请检查您的网络设置',
                  })
                },
              })
            },
            fail: function () {
              //如果获取登陆权限失败则提示用户请登陆
              wx.showModal({
                title: 'Error',
                content: '请授与登陆权限，登陆后才能使用上传等功能！',
              })
            }
          })
          console.log('user_id=' + user_id);
        } else {
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
              success: function (res) {
                //将服务器返回的session_key存到本地
                var session_key = res.data;
                console.log('登陆成功' + res.data);
                wx.setStorageSync('session_key', session_key);
              },
              fail: function (res) {
                wx.showModal({
                  title: 'Error',
                  content: '登陆失败，请检查您的网络设置',
                })
              },
            })
          },
          fail: function () {
            //如果获取登陆权限失败则提示用户请登陆
            wx.showModal({
              title: 'Error',
              content: '请授与登陆权限，登陆后才能使用上传等功能！',
            })
          }
        })
      }
    })
  },
  onLoad: function () {
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
    this.setData({
      user_icon: this.data.userInfo.avatarUrl,
      user_name: this.data.userInfo.nickName,
      loginStatus:true,
    })
  }
})
