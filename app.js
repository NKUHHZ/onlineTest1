//app.js
const app = getApp();

App({
  data:{
    userInfo:{}
  },
  globalData: {
    userInfo: null,
    loginStatus: 'fail',
    storyListG:{}
  },
  onLaunch: function () {
    if (wx.getStorageSync("session_key")) {
      this.globalData.loginStatus = 'success';
    }
  }
})