//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    feedbackValue:null,
    showModal:false,
    userInfo:{},
    user_icon:'../../res/user-unlogin.png',
    user_name:'点击登陆',
    loginStatus:false,
    userList:{
      
    },
    myAttentionSubmit:0,
    userOperation:[
      {
        isunread: false,
        icon:'../../res/png resource/bar_home_black.png',
        text:'我的上传记录',
      },
      {
        isunread: false,
        icon:'../../res/png resource/bar_home_black.png',
        text:'我的关注',

      },
      {
        isunread: false,
        icon: '../../res/png resource/bar_home_black.png',
        text: '上传图片证据'
      },
      {
        isunread: false,
        icon:'../../res/png resource/bar_home_black.png',
        text:'提交反馈'
      },
    ]
    },
    logout:function(){//退出登陆
      app.globalData.loginStatus='fail';
      this.setData({
        loginStatus:false,
      })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.setData({
        showModal: false
      });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      this.data.feedbackValue=null;//取消将反馈重置
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
      console.log(this.data.feedbackValue)
      sendFeedback(this);
      this.data.feedbackValue=null;//点击了确定以后将反馈重置
      this.hideModal();
    },
    //点击了键盘上的完成按钮
    clickConfirm:function(e){
      this.setData({
        feedbackValue:e.detail.value
      })
    },
    loseCursor:function(e){//失去输入焦点时触发
      this.setData({
        feedbackValue: e.detail.value
      })
    },
    inputChange:function(e){//输入改变的时候触发
      this.setData({
        feedbackValue: e.detail.value
      })
    },
  tap:function(e){//判断点击了哪个按钮
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
    switch (e.currentTarget.dataset.index){
      case 0: 
        wx.navigateTo({
          url: '/pages/SubmitRecord/SubmitRecord',
        })
        break;
      case 1: 
        wx.navigateTo({
          url: '/pages/attention/myAttentionSubmit/myAttentionSubmit',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/Submit/Submit',
        })
        break;
      case 3:
        //弹出反馈框，输入反馈
        this.setData({
          showModal: true
        })
        break;
    }
    
  },
  tapLogin:function(){
    var that = this;
    var loginS = app.globalData.loginStatus;
    if(loginS=='success') {
      console.log('用户已经登陆点击请求登陆');
      return;
    }
    tryLogin(that);
  },
  onLoad: function () {
    var that = this;
    if(app.globalData.loginStatus=='success')
      updateUserStatus(that);
  },
  onShow:function(){
    if(app.globalData.loginStatus=='success') {
      updateUserStatus(this);
      getUserUpload(this);
    }
  }
})

function updateUserStatus(that){
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框      
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId

            app.globalData.userInfo = res.userInfo;
            app.data.userInfo = res.userInfo;
            that.setData({
              userInfo:res.userInfo,
              user_icon: that.data.userInfo.avatarUrl,
              user_name: that.data.userInfo.nickName,
            })
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res);
            }
          }
        })
      } else {
        wx.authorize({
          scope: 'scope.userInfo',
          success:function(){
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId

                app.globalData.userInfo = res.userInfo;
                app.data.userInfo = res.userInfo;
                that.setData({
                  userInfo: res.userInfo,
                  user_icon: that.data.userInfo.avatarUrl,
                  user_name: that.data.userInfo.nickName,
                })
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res);
                }
              }
            })
          }
        })
      }
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
  //得到关注数和上传记录数
  getUserUpload(that);
}

function getUserUpload(that){
  //向服务器请求返回用户的关注数和上传记录数
  wx.showLoading({
    title: '正在登陆....',
    mask: true,
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
      if (!temp[0]) {
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
    complete: function (res) {
      wx.hideLoading();
    }
  });
  //获取我关注的用户总数
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handlecountconcernnumber',
    data: {
      'user_id': wx.getStorageSync('session_key')
    },
    header: {
      'content-type': 'application/json'
    },
    dataType: "json",
    success: function (res) {
      console.log(res.data);
      that.setData({
        myAttentionSubmit: res.data,
      })
      wx.setStorageSync('attention', res.data)
    },
    fail: function (res) {
      wx.showModal({
        title: 'Error',
        content: '请求服务器失败，请检查您的网络设置',
        showCancel: false,
      })
    },
  })
}

//发送反馈到服务器上
function sendFeedback(that){
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handlewritefeedback',
    data:{
      'user_id':wx.getStorageSync('session_key'),
      'content':that.data.feedbackValue
    },
    success:function(res){
      wx.showToast({
        title: '提交成功，感谢您的反馈！',
        duration:2000
      })
      console.log('上传'+res.data);
    },
    fail:function(e){
      wx.showToast({
        title: '提交失败，请检查您的网络设置！',
      })
    }
  })
}