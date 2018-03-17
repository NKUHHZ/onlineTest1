
const app = getApp();
Page({
  data: {
    change:false,
    markers: [],
    upload:[],
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
    this.mapCtx = wx.createMapContext('map');
    
  },
  controltap(e) {
    var that = this;
    console.log("press locaiton button" + e.controlId)
    wx.getLocation({//获取当前位置的坐标
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          change:true
        })
        updateMarkers(that,res)
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
  
  markertap(e) {
    console.log(e.markerId);
    //定位到详情页面
    app.globalData.storyListG=this.data.upload[e.markerId];
    wx.navigateTo({
      url: '../Activity/Activity',
    })
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
          change:true,
        })
        updateMarkers(that,res)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  
  onShow:function(){
    var that = this;
    if(!that.data.change){//如果用户操作改变那么不执行
      wx.showModal({
        title: '提示',
        content: '当前展示所在区的上传情况，如果想看其他城市及地区的情况可以点击地图选择其他地区哟',
        showCancel: false,
      })
      wx.getLocation({//获取当前位置的坐标
        type: 'gcj02',
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          querySurroundingUpdate(that);
        },
        fail: function (res) {
          wx.showModal({
            title: 'Error',
            content: '获取位置失败，请开启定位并授予权限',
            showCancel: false,
          })
        }
      })
    }else{
      querySurroundingUpdate(that);
    }
    
  }
})

function querySurroundingUpdate(that){
  //查询所有已经上传的点的坐标
  console.log(that.data.longitude+" "+that.data.latitude)
  wx.request({
    url: 'https://brightasdream.cn/uploadImage/handlelooksurrounding',
    data: {
      'longitude': that.data.longitude,
      'latitude': that.data.latitude,
      'radius': 0.01,
    },
    header: {
      'content-type': 'application/json'
    },
    dataType: "json",
    success: function (res) {
      console.log(res.data);
      that.setData({
        upload:res.data,
        markers:[]
      })
      var temp = res.data;
      for (var i = 0; i < temp.length; i++) {
        var tt = {
          iconPath: "../../res/marker_yellow.png",
          id: i,
          latitude: '',
          longitude: '',
          width: 30,
          height: 30,
          callout:{
            content:'点击查看',
            color:'#00BFFF',
            fontSize:10,
            padding:5,
            display:'ALWAYS',
            borderRadius:10,
          }
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
      'radius': 0.01,
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
          height: 30,
          callout: {
            content: '点击查看',
            color: '#00BFFF',
            fontSize: 10,
            padding: 5,
            display: 'ALWAYS',
            borderRadius: 10,
          }
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