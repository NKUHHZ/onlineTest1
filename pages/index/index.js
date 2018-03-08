Page({
  data: {
    topStories: [
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=684276477,2474013616&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1623529198,932220174&fm=27&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1446989525,2907093786&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1192368817,540312063&fm=27&gp=0.jpg',
    ],
    storyList: [
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=684276477,2474013616&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1623529198,932220174&fm=27&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1446989525,2907093786&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1192368817,540312063&fm=27&gp=0.jpg',
    ],
    story_attetion:
    [


    ],
    story_location: [
      ,
    ]
  },

  /**
   * 这里处理滚动事件处理
   */
  listenSwiper: function (e) {
    //打印信息
    console.log(e)
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'https://brightasdream.cn'
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})