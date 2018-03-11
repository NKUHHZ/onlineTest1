
const app = getApp();
Page({
  data: {
    markers: [],
    controls: [{
      id: 1,
      iconPath: '../../res/wz.png',
      position: {
        left: 20,
        top: 350,
        width: 30,
        height: 30
      },
      clickable: true
    }],
    longitude: 113.324520,//广州坐标
    latitude: 23.099994,
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },
  controltap(e) {
    var that = this;
    console.log("press locaiton button" + e.controlId)
    wx.getLocation({//获取当前位置的坐标
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: function (res) {
        wx.showModal({
          title: 'Error',
          content: '获取位置失败，请开启定位并授予权限',
          showCancel: false,
        })
      }
    })
  },
  regionchange(e) {
    if (e.type == "begin") {

    } else if (e.type == "end") {


      this.mapCtx.getCenterLocation({
        success: function (res) {
          console.log(res.longitude);
          console.log(res.latitude);
          updateMarkers(this,res);
        }
      });
    }
  },
  markertap(e) {
    console.log(e.markerId)
  },
  toSubmit: function () {
    var loginStatus = app.globalData.loginStatus;
    if(loginStatus!='success'){
      wx.showModal({
        title: 'Error',
        content: '登陆后方可上传',
        showCancel:false
      })
      return;
    }
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
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  
  onLoad:function(){
    var that = this;
    wx.getLocation({//获取当前位置的坐标
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail:function(res){
        wx.showModal({
          title: 'Error',
          content: '获取位置失败，请开启定位并授予权限',
          showCancel:false,
        })
      }
    })
    querySurroundingUpdate(that);
  }
})

function querySurroundingUpdate(that){
  //查询所有已经上传的点的坐标
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handlelooksurrounding',
    data: {
      'longitude': that.data.longitude,
      'latitude': that.data.latitude,
      'radius': 100,
    },
    header: {
      'content-type': 'application/json'
    },
    dataType: "json",
    success: function (res) {
      console.log(res.data);
      var temp = res.data;
      for (var i = 0; i < temp.length; i++) {
        var tt = {
          iconPath: "../../res/marker_yellow.png",
          id: i,
          latitude: '',
          longitude: '',
          width: 30,
          height: 30
        }
        tt.longitude = temp[i].upload_longitude;
        tt.latitude = temp[i].upload_latitude;
        that.setData({
          markers: that.data.markers.concat(tt),
        })

      }
      console.log(that.data.markers);
    },
    fail: function (res) {
      wx.showModal({
        title: 'Error',
        content: '获取信息失败，请开启定位并授予权限',
        showCancel: false,
      })
    }
  })
}

function updateMarkers(that,res){
  //查询所有已经上传的点的坐标
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handlelooksurrounding',
    data: {
      'longitude': res.longitude,
      'latitude': res.latitude,
      'radius': 1,
    },
    header: {
      'content-type': 'application/json'
    },
    dataType: "json",
    success: function (res) {
      console.log(res.data);
      var temp = res.data;
      for (var i = 0; i < temp.length; i++) {
        var tt = {
          iconPath: "../../res/marker_yellow.png",
          id: i,
          latitude: '',
          longitude: '',
          width: 50,
          height: 50
        }
        tt.longitude = temp[i].upload_longitude;
        tt.latitude = temp[i].upload_latitude;
        that.setData({
          markers: that.data.markers.concat(tt),
        })

      }
    },
    fail: function (res) {
      wx.showModal({
        title: 'Error',
        content: '获取信息失败，请开启定位并授予权限',
        showCancel: false,
      })
    }
  })
}