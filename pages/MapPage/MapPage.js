//var Map = wx.createMapContext(map)
Page({
  data: {
    markers: [{
      iconPath: "/resources/others.png",//标识图片
      id: 0,
      latitude: 39.90, longitude: 116.38,
      width: 50,
      height: 50
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    circles: [],
    longitude: 113.324520,//广州坐标
    latitude: 23.099994,
  },

  toSubmit: function () {
    wx.navigateTo({
      url: '/pages/Submit/Submit',
    })
  },
  chooseLocation: function (e) {
    console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          circles: [{
            latitude: 39.90, longitude: 116.38,//天安门坐标
            color: '#FF0000DD',
            fillColor: '#7cb5ec88',
            radius: 3000,
            strokeWidth: 1
          }]
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})