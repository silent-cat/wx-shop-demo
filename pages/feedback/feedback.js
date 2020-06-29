// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商家投诉',
        isActive: false
      }
    ],

    chooseImgs:[],

    textVal:''
  },
  UpLoadImgs:[],
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

  handleChooseImage(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=>{
        console.log(res)
        this.setData({
          // 拼接
          chooseImgs: [...this.data.chooseImgs,...res.tempFilePaths]
        })
      }
    })
  },
  // 移除图片
  handleRemoveImg(e){
    // console.log(e)
    const { index } = e.currentTarget.dataset
    console.log(index)
    let {chooseImgs} = this.data
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },

  handleTextInput(e){
    this.setData({
      textVal: e.detail.value
    })
  },
  handleFormSubmit(){
    const {textVal,chooseImgs} = this.data
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',
        icon:'none',
        mask: true
      })
      return
    }
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })

    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          url: 'https://img.coolcr.cn/api/upload',
          filePath: v,
          name: 'image',
          success:(res)=>{
            let url = JSON.parse(res.data).data.url

            this.UpLoadImgs.push(url)

            if(i===chooseImgs.length-1){
              wx.hideLoading()
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              this.setData({
                textVal:'',
                chooseImgs:[]
              })

              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    }
    else{
      wx.hideLoading()
      console.log('只是提交了文本')
      wx.navigateBack({
        delta: 1
      })
    }
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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