Component({
  data: {},
  properties: {
    tabs: {
      type: Array,
      value: []
    },
  },
  methods: {
    handleItemTap(e) {
      // console.log(e)
      const { index } = e.currentTarget.dataset
      this.triggerEvent("tabsItemChange", { index })
    }
  }
})