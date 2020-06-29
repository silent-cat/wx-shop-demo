// pages/search/search.js

import {request} from '../../request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    //控制按钮是否隐藏
    isFocus:false,
    iptValue:''
  },
  // 采用防抖 一般用于防止输入框中重复输入 重复发送请求
  TimeId: -1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleInput(e){
    const {value} = e.detail
    // 检测合法值
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      return
    }
    this.setData({
      isFocus: true
    })
    // 发送请求获取数据
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(()=>{
      this.search(value)
    },1000)

    
    

  },
  // 发送请求获取搜索数据
  async search(query){
    const res = await request({ url:'/goods/search',data:{query}})
    console.log(res)
    this.setData({
      goods:res.goods
    })
  },
  handleCancel(){
    this.setData({
      iptValue:'',
      goods:[],
      isFocus: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})