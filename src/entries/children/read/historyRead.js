import historyRead from '../../../pages/children/read/historyRead.vue'
import sharedMixin from '../../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

historyRead.el = '#root'
new Vue(historyRead)
