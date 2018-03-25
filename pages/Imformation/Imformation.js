const app = getApp();
Page({
  data:{
    article:null,
  },
  onLoad:function(options){
    this.setData({
      article:app.globalData.announceArray[options.index],
    })
  }
}
)