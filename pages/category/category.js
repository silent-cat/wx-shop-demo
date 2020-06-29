// pages/category/category.js

import { request } from '../../request/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧滚动条距顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 获取本地存储的数据 */
    const Cates = wx.getStorageSync('cates')
    /* 不存在数据 发送请求获取数据 */
    if (!Cates) {
      this.getCates()
    } else {
      // 有旧的数据，为数据定义过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates()
      }
      else {
        console.log('可以使用旧数据')
        // 使用旧的数据
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({ url: '/categories' }).then(res => {
    //   console.log(res)
    //   this.Cates = res

    //   // 构造左侧的菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name)
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    //   // 把接口数据存储到本地存储
    //   wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    // })
    const res = await request({ url: '/categories' })
    this.Cates = res
    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
    // 把接口数据存储到本地存储
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
  },

  // 左侧菜单的点击切换事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新给右侧scroll-vew设置距顶部的距离
      scrollTop: 0
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