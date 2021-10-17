const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const wxRequest =  function(param){
  let local_token = wx.getStorageSync('le_token');
  let header = {
      'content-type': 'application/json',
      'Access-Control-Allow-Credentials': true
  }
  if(local_token){
      header['Authorization'] = "Bearer " + local_token
  }
  return new Promise((resolve,reject) => {
      wx.request({
          header:header,
          url: param.url || '/api',
          data: param.data || {},
          method: param.method || 'get',
          // dataType: 'json',
          success: res => {
              resolve(res)
          },
          fail: res => {
              reject(res)
          },
      });
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  wxRequest: wxRequest
}
