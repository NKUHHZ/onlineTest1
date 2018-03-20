// pages/attention/myAttentionSubmit/myAttentionSubmit.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    attentionList: {},//我关注的动态数组
    userIcon:'../../../res/user-unlogin.png',
    uploadTimes:1,
    paths:[],//图片数组
    isAttentioned:[],
    hidden: true,
  },
  preImage:function(res){//预览图片
    var src = res.currentTarget.dataset.src;//获取data-src
    var imgList = res.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  cancelAttention:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.isAttentioned[index]) {
      wx.request({
        url: 'https://brightasdream.cn/uploadImage/handlecancelconcerndynamic',
        data: {
          'user_id': wx.getStorageSync('session_key'),
          'upload_id': that.data.attentionList[index].uploadId,
        },
        header: {
          'content-type': 'application/json'
        },
        dataType: "json",
        success: function (res) {
          console.log(res.data);
          that.data.attentionList[index].attention_number--;
          that.data.isAttentioned[index]=false;
          that.setData({
            isAttentioned: that.data.isAttentioned,
            attentionList: that.data.attentionList,
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '获取信息失败',
          })
        }
      })
      return;
    }

    wx.request({
      url: 'https://brightasdream.cn/uploadImage/handleconcerndynamic',
      data: {
        'user_id': wx.getStorageSync('session_key'),
        'upload_id': that.data.attentionList[index].uploadId,
        'signal': 'no'
      },
      header: {
        'content-type': 'application/json'
      },
      dataType: "json",
      success: function (res) {
        console.log(res.data);
        that.data.attentionList[index].attention_number++;
        that.data.isAttentioned[index] = true;
        that.setData({
          attentionList: that.data.attentionList,
          isAttentioned: that.data.isAttentioned,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '获取信息失败',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求获取用户的关注的uploadid，返回用户的关注动态的JSON数组,数组中包含用户头像，用户名，以及动态的详细信息
    var that = this;
    wx.request({
      url: 'https://brightasdream.cn/uploadImage/handleselfconcerndynamic',
      data:{
        'user_id':wx.getStorageSync('session_key'),
        'page':that.data.uploadTimes,
      },
      header: {
        'content-type': 'application/json'
      },
      dataType: "json",
      success:function(res){
        console.log(res.data);
        that.setData({
          attentionList:res.data
        })
        var l = res.data;
        var p = new Array(l.length);
        //创建关注数组
        var a = new Array(l.length);
        for (var j = 0; j < l.length; j++) {
          a[j]=true;
          var t = l[j].image_path.split("&");//取出图片名
          t.pop();//删除最后一个空白元素
          var userId=l[j].uploadId.split("$");
          p[j] = new Array(t.length);
          p[j] = t;
          for (var i = 0; i < t.length; i++) {
            p[j][i] = 'https://brightasdream.cn/uploadImage/upload/' + userId[0] + '/' + l[j].uploadId + '/' + p[j][i];//得到服务器上的图片的路劲
          }
        }
        
        
        that.setData({   //这里调用setData时不能用this.setData，会报错 
          paths: p,
          isAttentioned:a,
        })
        console.log(that.data.paths)
      },
      fail:function(res){
        wx.showToast({
          title: '获取信息失败',
        })
      }
    })
    that.setData({
      uploadTimes:that.data.uploadTimes+1,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  LM: function () {
    var that = this;
    that.setData({
      hiden: true
    })
    if (that.data.uploadTimes >= 100000) {
      that.setData({
        hiden: false
      });
    }
    else {
      wx.request({
        url: 'https://brightasdream.cn/uploadImage/handleselfconcerndynamic',
        data: {
          'user_id': wx.getStorageSync('session_key'),
          'page': that.data.uploadTimes,
        },

        success: function (res) {
          console.log(res.data);
          if (res.data.length<5) {
            that.setData({
              hiden: false
            });
          }
          if (!res.data[0]) {
            that.setData({
              hiden: false
            });
            return;
          }
          that.setData({
            list: that.data.attentionList.concat(res.data),
          })
          console.log(that.data.attentionList)
          var l = res.data;
          var p = new Array(l.length);
          //创建关注数组
          var a = new Array(l.length);
          for (var j = 0; j < l.length; j++) {
            a[j]=true;
            var t = l[j].image_path.split("&");//取出图片名
            var userId=l[j].uploadId.split("$");
            t.pop();//删除最后一个空白元素
            p[j] = new Array(t.length);
            p[j] = t;
            for (var i = 0; i < t.length; i++) {
              p[j][i] = 'https://brightasdream.cn/uploadImage/upload/' + userId[0] + '/' + l[j].uploadId + '/' + p[j][i];//得到服务器上的图片的路劲
            }
          }
          console.log(p);
          that.setData(
            {
              paths: that.data.paths.concat(p),
              isAttentioned:that.data.isAttentioned.concat(a)
            }
          )
          console.log(that.data.paths);
        }
      })
      that.setData({
        uploadTimes: that.data.uploadTimes + 1
      })
    }
  }
})