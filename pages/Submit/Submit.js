var app = getApp();
Page({
  data: {
    latitude: '',
    longitude: '',
    ifAnonymity: '0'
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    var that = this;
    wx.setEnableDebug({
      enableDebug: true,
    }),
      wx.getLocation({
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        },
      })
  },

  upload: function () {
    var that = this;
    var pic_list = [];
    wx.chooseImage({
      count:8,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        for(var i in tempFilePaths){
          pic_list.push(tempFilePaths[i]);
        }
          uploadPicture(that,pic_list,0);
          wx.showToast({
            title: '上传成功！',
          });
      }
    })
  }
})

  function uploadPicture(that, pic_list, j) {
    var user_id=wx.getStorageSync('session_key');
    wx.uploadFile({
      url: 'https://brightasdream.cn/uploadImage/uploadImage',
      filePath: pic_list[j],
      name: 'file',
      formData: {
        'user_id': user_id,
        //'SubmitLocation_latitude':latitude,
        //'SubmitLocation_longitude':longitude,
        //'ifAnonymity':ifAnonymityx,
        'isInsert':j
      },
      success: function (res) {
        console.log(j);
        console.log(res.data)
        j++;
        if(j<pic_list.length) uploadPicture(that,pic_list,j);
      },
      fail: function () {
        console.log('上传失败');
      }
    })
  }