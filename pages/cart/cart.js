// pages/cart/cart.js
/* 
  1.获取用户收货地址
    1.绑定点击事件
    2.调用内置api wx.chooseAdress

    2.获取 用户 对小程序 所授予 获取地址的 权限 状态 scope
      1.假设用户点击获取地址的的提示框 确定
        scope值为true
      2.假设 用户 从未调用过api
        scope undefined 直接获取收货地址
      3.假设 点击 取消 
        scope值为fasle
        1.诱导用户自己打开授权设置页面 当用户重新给与 获取地址权限的时候
        2.获取收货地址
      4.把获取到的收货地址 存储到本地存储
    2.页面加载完毕
      0 onLoad onShow
      1 获取本地存储的数据
      2 把数据 设置给data中的一个变量
    3.onShow
      0.回到详情页 第一次添加商品时 手动添加属性
      1.获取本地存储的cart数组
      2.把数据填充到data中
    4.全选的实现 数据的展示
      1.onShow 获取购物车的商品数据 所有商品都被选中 checked=true
    5.总价格和总数量
      1.都需要商品被选中 我们才拿来计算
      2.获取购物车数组
      3.遍历
      4.判断商品是否被选中
      5.总价格 += 商品单价*商品数量
      6.总数量 += 商品的数量
      7.把计算后的价格和数量 设置回data中
    6.商品的绑定
      1.绑定change事件
      2.获取到被改变的商品对象
      3.商品对象的选中状态 取反
      4.重新填充回data中和缓存中
      5.重新计算全选 总价格 总数量      
    7.全选和反选
      1.全选复选框绑定事件 change
      2.获取data中的全选变量 allChecked
      3.循环修改cart 的商品选中状态
      4.把修改后的值 填充回data和缓存中
    8.商品数量的编辑
      1. + - 绑定同一个点击事件 区分的关键 自定义属性
      2.传递被点击的商品id
      3.获取data中的购物车的数组 来获取需要被修改的商品对象
      4.当购物车的数量为1同时用户点击 - 
        弹窗(showModal)提示询问用户是否要删除
        1.取消 什么丢不做
        2.确定 删除
      4.直接修改商品的数量
      5.把cart数组的重新设置回缓存和data中
    9.点击结算
      1.判断有没有收货地址信息
      2.判断用户有没有选购商品
      3.经过验证 跳转到支付页面

*/
import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 页面加载完毕
  onShow() {
    // 1.获取缓存中的收获地址信息
    const address = wx.getStorageSync("address")
    // 2.获取缓存中的购物车数组信息
    const cart = wx.getStorageSync("cart") || [];
    // 1.计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true
    // 只要 有一个回调函数返回false 则不再循环执行 直接返回false
    // 空数组调用every,返回值就是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false
    this.setData({
      address
    })
    this.setCart(cart)
  },
  // 点击收货地址
  async handleChooseAdress() {
    // // 1.获取权限状态
    // wx.getSetting({
    //   success: (res) => {
    //     // 2.获取权限状态 
    //     const scopeAdress = res.authSetting["scope.address"]
    //     if (scopeAdress === true || scopeAdress
    //       === undefined) {
    //       wx.chooseAddress({
    //         success: (res1) => {
    //           console.log(res1)
    //         },
    //       })
    //     } else {
    //       //  3.用户 以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (res2) => {
    //           //  4.可以调用 收货地址代码
    //           wx.chooseAddress({
    //             success: (res3) => {
    //               console.log(res3)
    //             },
    //           });
    //         },
    //       });
    //     }
    //   }
    // });


    try {
      // 1.获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"]
      //2.判断 权限状态
      if (scopeAddress === false) {
        await openSetting()
      }
      const address = await chooseAddress()

      address.all = address.provinceName + address.cityName + address.countyName + address.countyName
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error)
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 1.获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id
    console.log(e)
    console.log(goods_id)
    // 2.获取购物车数组
    let { cart } = this.data
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 4.选中状态反选
    cart[index].checked = !cart[index].checked
    // 5.把购物车数据重新设置为data中和缓存中
    this.setCart(cart)

  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 总数量
  setCart(cart) {
    let allChecked = true
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    // 如果cart数组为空，代码不会执行
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断数字组是否为空
    allChecked = cart.length != 0 ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart)

  },
  // 商品全选功能
  handleItemAllChanged() {
    // 1.获取data中的数据cart allChecked
    let { cart, allChecked } = this.data
    // 2.修改值allChecked
    allChecked = !allChecked
    // 3.循环修改cart 的商品选中状态
    cart.forEach(v => v.checked = allChecked)
    // 4.把修改后的值 填充回data和缓存中
    this.setCart(cart)
  },
  // 商品数量的编辑
  async handleItemNumEdit(e) {

    // console.log(e)
    // 1.获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset
    // 2.获取购物车数组
    let { cart } = this.data
    // 3.找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 4.判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1弹窗提示 
      const res = await showModal({ content: '是否要删除?' })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      // 4.进行数据修改
      cart[index].num += operation
      // 5.设置会缓存和data中
      this.setCart(cart)
    }

  },
  // 点击 结算
  async handlePay() {
    //   1.判断有没有收货地址信息
    const { address, totalNum } = this.data
    if (!address.userName) {
      await showToast({ title: '还没有选择地址' })
      return
    }

    //   2.判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: '还没有选中商品' })
      return
    }
    //   3.经过验证 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    });
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