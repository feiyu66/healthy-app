export default{
  install (Vue, options) {
  // support bmchat send options include function option
    Vue.prototype.$format = (options) => {
      return JSON.stringify(JSON.stringify(options, function (key, val) {
        if (typeof val === 'function') {
          return val + ''
        }
        return val
      }))
    }
  }
}
