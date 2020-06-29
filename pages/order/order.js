// pages/order/order.js
/* 
  1.页面打开的时候 onShow
    0 onShow 不同于onLoad 无法接受options参数
    0.5 判断缓存中有没有token
      1 没有 跳转到授权页面
      2 有 直接往下进行
    1.获取url的参数type
    2.根据type来决定页面标题的数组元素 哪个被激活选中
    3.根据type去发送请求获取订单数据
    4.渲染页面
  2.点击不同标题 重新发送请求来获取和渲染数据
*/
import { request } from '../../request/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs: [
      {
        id: 0,
        value: '全部订单',
        isActive: true
      },
      {
        id: 1,
        value: '待发货',
        isActive: false
      },
      {
        id: 2,
        value: '待收货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/售后',
        isActive: false
      }
    ],
  },
  onShow(options) {
    const token = wx.getStorageSync("token")
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return
    }
    console.log(token)
    // 1.获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages()
    // 2.数组中 索引最大的页面就是当前页面
    let curretPages = pages[pages.length - 1]
    console.log(curretPages.options)
    // 3. 获取url上的type参数
    const {type} = curretPages.options
    // 4.激活选中标题 type=1 index=0
    this.changeTitleByIndex(type-1)
    this.getOrders(type)

    console.log(pages)
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all', data: { type } })
    console.log(res)
  },
  // 根据标题索引来激活选中数组 标题数组
  changeTitleByIndex(index){
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    console.log(e)
    // 获取被点击的标题索引
    const { index } = e.detail
    // 修改原数组
    this.changeTitleByIndex(index)
    // 2.重新发送请求
    this.getOrders(index=1)
  },
})