// pages/goods_list/goods_list.js
/* 
  1.用户上滑页面 滚动条触底 开始加载下一跳数据
    1.找到滚动条触底事件
    2.判断还有没有下一条数据
      1.获取到总页数
      2.获取到当前页码 pagenum
      3.判断一下 当前的页码是否大于等于 总页数 
        表示没有下一页数据
    3.假如没有下一条数据 弹出一个提示
    4.加入还有下一页数据 来加载下一条数据
      1.当前的页码++
      2.重新发送请求
      3.数据请求回来 要对data中的数组进行拼接 而不是全部替换

  2.下拉刷新页面
    1.触发下拉刷新事件
    2.重置数据 数组
    3.重置页码 设置为1
    4.重新发送请求 需要手动的关闭 等待效果

*/
import { request } from '../../request/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab栏数据
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.cid)
    // 把当前页的cid赋给接口要的参数请求数据
    this.QueryParams.cid = options.cid
    this.getGoodsList()

  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    console.log(e)
    // 获取被点击的标题索引
    const { index } = e.detail
    // 修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 获取商品列表
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams })
    // 获取到数据总条数
    const total = res.total
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    console.log(res)
    this.setData({
      // 拼接了数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 1.判断还有没有下一页数据
    if (this.QueryParams.pagenum > this.totalPages) {
      wx.showToast({
        title: '没有数据啦',
      });
    }
    // 没有下一页数据
    else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }

  },
  /* 监听用户下拉 */
  onPullDownRefresh: function () {
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    // 2.重置页码
    this.QueryParams.pagenum = 1
    // 3.重新发送请求
    this.getGoodsList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})