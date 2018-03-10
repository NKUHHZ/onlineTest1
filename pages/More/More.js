//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{},
    user_icon:'../../res/user-unlogin.png',
    user_name:'点击登陆',
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
  toRecord: function () {
    wx.navigateTo({
      url: '/pages/SubmitRecord/SubmitRecord',
    })
  },
  tap:function(e){
    console.log(e.currentTarget.dataset.index);
    if(e.currentTarget.dataset.index==0)
    {
      wx.navigateTo({
        url: '/pages/SubmitRecord/SubmitRecord',
      })
    }
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
      user_name: this.data.userInfo.nickName
    })
  }
})
