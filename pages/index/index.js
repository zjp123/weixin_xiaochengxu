//index.js
//获取应用实例
const app = getApp()
const {wxRequest} = require('../../utils/util.js')

Page({
  data: {
    motto: '小程序需获取头像昵称后方可使用',
    userInfo: {},
    le_token: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(this.data, 'indexdataindexdata1');

    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(this.data.encryptedData, 'indexdataindexdata2');
      }
      const le_token = wx.getStorageSync('le_token');
      if (!le_token) { // 登录代码 首先默默的先执行login 拿到appid 和 session_key
        app.getOpenId().then(res => {
          console.log('getOpenId成功', res);
          wx.setStorage({
            key: 'le_token',
            data: res.data.token
          });
        });
      } else { // 业务代码
        // http://localhost:3000/api/lexuelearn/amaterasu/homework/recommend_homework/detail
        wxRequest({
          url: 'http://localhost:3000/api/find',
          method: 'get'
        }).then(res => {
          console.log(res, '业务数据');
          const {data} = res;
          if (data.code === 403) {
            wx.showToast({
              title: 'token 过期请重新登录',
            })
          }
        }).catch(err => {
          console.log(err, '请求失败');
        });
      }
      console.log(app.userInfoReadyCallback, 'indexdataindexdata8');
      
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log(this.data, 'indexdataindexdata3');

        }
      })
    }
    // this.setData({
    //   encryptedData:'fkkfkf',
    //   iv: 'ppfpfp'
    // })
  
  },
  getUserInfo: function(e) {// 手动执行获取
    console.log(e, '手动执行getUserInfo')
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.encryptedData = e.detail.encryptedData
      app.globalData.iv = e.detail.iv
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log(this.data, 'indexdataindexdata4');
      wxRequest({ // 客户信息入库
        url: 'http://localhost:3000/api/decryptUser',
        method: 'post',
        // headers: { 'Access-Control-Allow-Credentials': true },
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        }
      }).then(res => {
        console.log(res, 'decryptUser')

      })
      // wx.request({
      //   url: 'http://localhost:3000/api/decryptUser',
      //   method: 'post',
      //   headers: { 'Access-Control-Allow-Credentials': true },
      //   data: {
      //     encryptedData: e.detail.encryptedData,
      //     iv: e.detail.iv,
      //   },
      //   success (res3) {
      //     console.log(res3, 'decryptUser')
      //   }
      // })

      // let that = this;
      // app.getToken(e.detail.encryptedData, e.detail.iv).then(function(){
      //   that.setData({
      //     le_token: wx.getStorageSync('le_token')
      //   });
      //   console.log(that.data.le_token, 'le_token')
      // });
    }else {
      app.globalData.userInfo = null
      app.globalData.encryptedData = ''
      app.globalData.iv = ''
      this.setData({
        userInfo: null,
        hasUserInfo: false
      })
    }
  },
  goStayHomework: function() {
    wx.navigateTo({
      url: '../stayHomework/stayHomework'
    })
  },
  goDoneHomework: function() {
    wx.navigateTo({
      url: '../doneHomework/doneHomework'
    })
  },
  goMistakeBook: function() {
    wx.navigateTo({
      url: '../mistakeBook/mistakeBook'
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.iv);
    console.log(e.detail.encryptedData);
    wx.request({
        url: 'http://localhost:3000/api/decryptUser',
        data: {
            'encryptedData': e.detail.encryptedData,
            'iv': e.detail.iv,
        },
        method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          console.log(res, '手机号');
          // if (res.status ==1) {//我后台设置的返回值为1是正确
          //   //存入缓存即可
          //   wx.setStorageSync('phone', res.phone);
          // }
        },
        fail: function (err) {
          console.log(err);
        }
    })
},
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
  onAdd: function(e){
      // 自定义组件触发事件时提供的detail对象
      console.log(e.detail)
  }
})
