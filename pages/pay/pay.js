// pages/pay/pay.js
/* 
  1.页面加载的时候
    1.从缓存中获取购物车数据渲染到页面
    checked = true
  2.微信支付
    1.哪些人 哪些账号 可以实现微信支付
      1.企业账号
      2.企业账号的小程序后台中必须给开发者 添加上白名单
        1.一个appid 可以同时绑定多个开发者
        2.这些开发者就可以共用appid和它的开放权限
  3.支付按钮
    1.先判断缓存有没有token
    2.没有 跳转到授权页面 进行token的获取
    3.有token
    4.创建订单 获取订单编号
    5.已经完成了微信支付
    6.手动删除缓存中已被选中的物品
    7.删除后的购物车数据 填充回缓存
    8.再跳转页面
*/
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from '../../utils/asyncWx'
import {request} from '../../request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}, 
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  // 页面加载完毕
  onShow() {
    // 1.获取缓存中的收获地址信息
    const address = wx.getStorageSync("address")
    // 2.获取缓存中的购物车数组信息
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    this.setData({
      address
    })
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    // 如果cart数组为空，代码不会执行
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num
      totalNum += v.num
    })
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
  },
  // 点击 支付
  async handlePay(){
   try{
     // 1.判断缓存中有没有token
     const token = wx.getStorageSync('token')
     // 2.判断
     if (!token) {
       wx.navigateTo({
         url: '/pages/auth/auth',
       })

     }
     // 创建订单
     // 1.准备请求头参数
     const header = { Authorization: token }
     // 准备 请求体参数
     const order_price = this.data.totalPrice
     const consignee_addr = this.data.address.all
     const cart = this.data.cart
     let goods = []
     cart.forEach(v => goods.push({
       goods_id: v.goods_id,
       goods_number: v.num,
       goods_price: v.goods_price
     }))
     const orderParams = { order_price, consignee_addr, goods }
     // 4.发送请求 创建订单
     const { order_number } = await request({ url: '/my/orders/create', method: "POST", data: orderParams, header })
     console.log(order_number)
     // 5.发起预支付接口
     const { pay } = await request({ url: '/my/orders/req_unifiedorder', method: 'POST', header, data: { order_number } })
     console.log(pay)


      // 注意：由于没有权限支付，故以下功能无法显现
      
     // 6.发起微信支付
     await requestPayment(pay)
     console.log(res)
    //  // 7.查询后台 订单状态
     const res = await request({ url: '/my/orders/chkOrder', method: 'POST', header, data: { order_number } })
    //  console.log(res)
     await showToast({title:'支付成功'})
    //  8.手动删除缓存中 已经支付了的商品
    let newCart = wx.getStorageSync('cart')
    newCart = newCart.filter(v=>!v.checked )
    wx.setStorageSync('cart', newCart)
    //  8. 支付成功跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/order',
    })
   }catch(error){
     await showToast({title:'支付失败'})
     let newCart = wx.getStorageSync('cart')
     wx.setStorageSync('cart', newCart)

     console.log(error)
   }

  }
})