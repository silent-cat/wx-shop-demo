
// 同时发送异步代码的次数
let ajaxTimes = 0
// 在request中，新建文件，将原生请求修改为promise请求

export const request = (params) => {
  ajaxTimes++
  // 显示加载效果
  wx.showLoading({
    title: '数据加载中'
  });
  // 定义公共的baseUrl
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (res) => { 
        resolve(res.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--
        // 隐藏加载效果
        wx.hideLoading()
      }
    })
  })
}