// pages/goods_detail/goods_detail.js
/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */

import { request } from '../../request/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是够被收藏
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length-1]
    let options = currentPage.options
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
  },
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } })
    this.GoodsInfo = goodsObj
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || []
    // 2.判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id) 
    this.setData({
      goodsObj: {
        pics: goodsObj.pics,
        goods_price: goodsObj.goods_price,
        goods_name: goodsObj.goods_name,
        // 用正则表达式解决iphone部分手机无法识别.webp
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
      },
      isCollect
    })
  },
  // 点击轮播图，放大预览图片
  handlePreviewImage(e) {
    // 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    // 接受传递过来的图片urls
    const { current } = e.currentTarget.dataset
    wx.previewImage({
      current,
      urls
    })
  },
  // 点击 加入购物车
  handleCartAdd() {
    // 1.获取缓存中的购物车 []
    let cart = wx.getStorageSync('cart') || []
    // 判断产品是否在购物车内
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    // 不存在，第一次添加
    if (index === -1) {
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 已经存在购物车 num++
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1500,
      mask: true
    });
  },
  // 点击收藏
  handleCollect(){
    let isCollect = false
    // 1.获取缓存中的商品收藏数组
    let collect=wx.getStorageSync('collect')||[]
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    // 3.当index!=-1时表示已经收藏过
    if(index!=-1){
      collect.splice(index,1)
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:'true'
      })
    }else{
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask: true
      })
    }
    // 4.把数组存入到缓存
    wx.setStorageSync('collect',collect)
    // 5.修改data的属性 isCollect
    this.setData({
      isCollect
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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