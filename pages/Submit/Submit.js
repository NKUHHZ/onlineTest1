var app = getApp();
var QQMapWX=require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    latitude: '0',
    longitude: '0',
    ifAnonymity: '0',
    address:location,
    pic_list: null,
    imageUrl1: null,
    imageUrl2: null,
    imageUrl3: null,
    disabled: true,
    selected:false,
    poluteType:'请选择污染类型',
    open:false,
    types:["废气排放","乱扔垃圾","污水排放","随意焚烧","其他污染"]
  },
  showitem:function(){
      this.setData({
        open:!this.data.open
      })
  },
  selectType:function(e){
    var temp = e.currentTarget.dataset.index
    console.log(temp);
    this.setData({
      poluteType:this.data.types[temp],
      open:false,
      selected:true
    })
  },
  onLoad: function (options) {
    // Do some initialize when page load.
     qqmapsdk=new QQMapWX({
      key:'AHCBZ-KS33F-7ZBJE-NJ4O4-JAXZE-OOF2H'
    });
    var that = this;
    wx.setEnableDebug({
      enableDebug: true,
    }),
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log(res)
          var latitude1 = res.latitude
          var longitude1 = res.longitude
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude1,
              longitude: longitude1
            },
            success: function (res) {
              console.log(res);
              var add = res.result.address
              that.setData({
                address: add,
                latitude:latitude1,
                longitude:longitude1
              })
            },
          });
        },
        fail:function(res)
        {
          wx.showModal({
            title: 'Error',
            content: '获取位置失败，请开启定位并授予权限',
          })
        }
      })
  },
  onReady: function () {
    var that = this
    
  }, 
  selectImage: function () {
    var that = this;
    wx.chooseImage({
      count: 3,
      sizeType:'compressed',
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        
        that.setData({
          imageUrl1: tempFilePaths[0],
          imageUrl2: tempFilePaths[1],
          imageUrl3: tempFilePaths[2],
          disabled: false,
          pic_list: tempFilePaths

        })
      }
    })
  },
  listenerSwitch: function(){
    var that=this;
    if (that.data.ifAnonymity=='0')
    {
      that.setData({
        ifAnonymity:'1'
      })
    }
    else
    {
      that.setData({
        ifAnonymity: '0'
      })
    }
  },
  upload: function () {
    if(this.data.longitude=='0' && this.data.latitude=='0'){
      wx.showModal({
        title: '上传失败',
        content: '获取位置信息失败，请您开启定位后重试',
        showCancel: false,
      })
      return;
    }
    if(this.data.disabled || !this.data.selected){
      wx.showModal({
        title: 'Error',
        content: '请完善所有信息',
        showCancel:false,
      })
      return;
    }
    var that = this;
    console.log(that.data.poluteType);
    uploadPicture(that, that.data.pic_list, 0, that.data.latitude, that.data.longitude, that.data.address, that.data.ifAnonymity);

  }
})

  function uploadPicture(that, pic_list, j,latitude,longitude,address,ifAnonymityx) {
    var user_id=wx.getStorageSync('session_key');
    wx.uploadFile({
      url: 'https://brightasdream.cn/uploadImage/uploadImage',
      filePath: pic_list[j],
      name: 'file',
      formData: {
        'user_id': user_id,
        'SubmitLocation_latitude':latitude,
        'SubmitLocation_longitude':longitude,
        'SubmitLocation':address,
        'ifAnonymity':ifAnonymityx,
        'isInsert':j,
        'poluteType':that.data.poluteType
      },
      success: function (res) {
        console.log(j);
        console.log(res.data)
        j++;
        if (j < pic_list.length) uploadPicture(that, that.data.pic_list, j, that.data.latitude, that.data.longitude, that.data.address, that.data.ifAnonymity);
        wx.showToast({
          title: '上传成功！',
          duration:2000,
        })
      },
      fail: function () {
        console.log('上传失败');
        wx.showToast({
          title: '上传失败！请检查您的网络设置',
          duration:3000,
        })
      }
    })
  }