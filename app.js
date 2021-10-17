//app.js
const {wxRequest} = require('./utils/util.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    const { miniProgram: { envVersion } } = wx.getAccountInfoSync();
    if (envVersion === 'develop') {
      this.globalData.isDev = true;
    } else {
      this.globalData.isDev = false;
    }
    let logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log(res, 'login');
    //     this.globalData.le_code = res.code;
    //     // const {isDev, userInfo} = this.globalData;
    //     // if (isDev || !userInfo) return;
    //     wx.request({
    //       url: 'http://localhost:3000/api/login',
    //       method: 'post',
    //       data: {
    //         code: res.code
    //       },
    //       success (res3) {
    //         console.log(res3, 'loginlogin')
    //         const openid = res3.data.result.openid;
    //         const session_key = res3.data.result.session_key;
            
    //       }
    //     })
    //   }
    // })
    // 获取用户信息

    wx.getSetting({
      success: res => {
        console.log('自动执行');
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.encryptedData = res.encryptedData,
              this.globalData.iv = res.iv,
              console.log('getSetting', this.globalData);
              const le_token = wx.getStorageSync('le_token');
              if (!le_token) { // 客户信息入库 线上版本第一次会有弹窗  开发版 没有弹窗
                wxRequest({
                  url: 'http://localhost:3000/api/decryptUser',
                  method: 'post',
                  headers: { 'Access-Control-Allow-Credentials': true },
                  data: {
                    encryptedData: res.detail.encryptedData,
                    iv: res.detail.iv,
                  }
                }).then(res => {
                  console.log(res, 'decryptUser')
          
                })
              }
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    encryptedData: '',
    iv: ''
    // le_token: null,
    // le_code: null,
    // isDev: true
  },
  getWechatUserInfo:function () {
    console.log('getWechatUserInfo');
    const that = this;
    // const app = getApp();
    return new Promise(function (resolve, reject) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                that.globalData.userInfo = res.userInfo;
                that.globalData.encryptedData = res.encryptedData;
                that.globalData.iv = res.iv;
                console.log(res.userInfo);
                resolve(res);
              }
            })
          } else {
            // 没有授权请求获取用户的授权信息
            reject(that.noAuthPower());
          }
        }
      })
    });
  },
  getOpenId() {
    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发送res.code 到后台
            wx.request({
              url: 'http://localhost:3000/api/login',
              method: 'post',
              data: {
                code: res.code
              },
              success(res) {
                resolve(res)
              },
              fail(err) {
                reject(err);
              }
            })
          }
        }
      })
    })
  },
  noAuthPower:function(){
    wx.showModal({
      title: '授权提醒',
      content: '未授权将无法使用小程序，请授权获取你的基本信息',
      cancelText:'取消',
      confirmText:"去授权"
    });
  }
})