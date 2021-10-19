Component({
  options: {
    styleIsolation: "apply-shared"
  },
  externalClasses: ['out-class-diy'],
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 这里是一个自定义方法
    onTap: function(){
      var myEventDetail = {size: 9} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('add', myEventDetail, myEventOption)
    }
  }
})
