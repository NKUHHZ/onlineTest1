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
    var loginStatus = app.globalData.loginStatus;
    if(loginStatus!='success'){
      wx.showModal({
        title: 'Login Error',
        content: '请登陆',
        showCancel:false,
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
    var that = this;
    var loginS = that.data.loginStatus;
    if(loginS==true) {
      console.log('用户已经登陆点击请求登陆');
      return;
    }
    tryLogin(that);
  },
  onLoad: function () {
    var that = this;
    updateUserStatus(that);
  }
})

function updateUserStatus(that){
  if (app.globalData.userInfo) {
    that.setData({
      userInfo: app.globalData.userInfo,

    })
  } else if (that.data.canIUse) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    app.userInfoReadyCallback = res => {
      that.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
  } else {
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
  }
  //向服务器请求返回用户的关注数和上传记录数
  wx.showLoading({
    title: '正在登陆....',
    mask:true,
  })
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handleAlldate',
    data: {
      'user_id': wx.getStorageSync('session_key')
    },
    header: {
      'content-type': 'application/json'
    },
    dataType: "json",
    success: function (res) {
      console.log(res.data);
      var temp = res.data;
      if(!temp[0]){
        console.log("返回用户信息为空");
        return;
      }
      that.setData({
        userList: temp[0],//得到返回的自己的信息,返回的是json数组
      })
      that.setData({
        user_icon: that.data.userInfo.avatarUrl,
        user_name: that.data.userInfo.nickName,
        loginStatus: true,
      });
    },
    fail: function (res) {
      wx.showModal({
        title: 'Error',
        content: '请求服务器失败，请检查您的网络设置',
        showCancel: false,
      })
    },
    complete:function(res){
      wx.hideLoading();
    }
  })
}

function tryLogin(that){
  //请求登陆
  wx.showLoading({
    title: '正在登陆.....',
    mask:true,
  })
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
              header: {
                'content-type': 'application/json'
              },
              dataType: "json",
              success: function (res) {
                //将服务器返回的session_key存到本地
                var loginStatus = res.data.loginStatus;
                if (loginStatus == 'success') {
                  var session_key = res.data.user_id;
                  console.log('登陆成功' + res.data);
                  
                  wx.setStorageSync('session_key', session_key);
                  app.globalData.loginStatus = 'success';
                  that.setData({
                    user_icon: that.data.userInfo.avatarUrl,
                    user_name: that.data.userInfo.nickName,
                    loginStatus: true,
                  });
                  wx.showModal({
                    title: 'Success',
                    content: '登陆成功！',
                  })
                } else {
                  console.log(loginStatus);
                }
              },
              fail: function (res) {
                wx.showModal({
                  title: 'Error',
                  content: '登陆失败，请检查您的网络设置',
                  showCancel: false,
                })
              },
            })
          },
          fail: function () {
            //如果获取登陆权限失败则提示用户请登陆
            wx.showModal({
              title: 'Error',
              content: '请授与登陆权限，登陆后才能使用上传等功能！',
              showCancel: false,
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
            header: {
              'content-type': 'application/json'
            },
            dataType: "json",
            success: function (res) {
              ///将服务器返回的session_key存到本地
              var loginStatus = res.data.loginStatus;
              if (loginStatus == 'success') {
                var session_key = res.data.user_id;
                console.log('登陆成功' + res.data);
                wx.setStorageSync('session_key', session_key);
                app.globalData.loginStatus = 'success';
                that.setData({
                  user_icon: that.data.userInfo.avatarUrl,
                  user_name: that.data.userInfo.nickName,
                  loginStatus: true,
                });
              } else {
                console.log(loginStatus);
              }
            },
            fail: function (res) {
              wx.showModal({
                title: 'Error',
                content: '登陆失败，请检查您的网络设置',
                showCancel: false,
              })
            },
          })
        },
        fail: function () {
          //如果获取登陆权限失败则提示用户请登陆
          wx.showModal({
            title: 'Error',
            content: '请授与登陆权限并且确保网络畅通，登陆后才能使用上传等功能！',
            showCancel: false,
          })
        }
      })
    }
  })
  wx.hideLoading();
  //更新用户信息
  updateUserStatus(that);
}