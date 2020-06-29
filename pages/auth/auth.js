import { request } from '../../request/request'
import { login } from '../../utils/asyncWx'
// pages/auth/auth.js
Page({
    // 获取用户信息
    async handleGetUserInfo(e) {
        // 1.获取用户信息
        console.log(e)
        const { encryptedData, rawData, iv, signature } = e.detail
        // 2.获取小程序登陆成功的code
        const code = await login()
        console.log(code)
        const loginParams = { encryptedData, rawData, iv, signature, code }
        // 3.发送请求 获取用户token
        // const {token} = await request({ url: "/users/wxlogin", data: loginParams, methods: "post" })
        // console.log(token)
        // 先用已有token进行替代
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
        // 4.把token存到缓存中
        wx.setStorageSync("token", token)
        wx.navigateBack({
          delta:1
        })
        
    }

})