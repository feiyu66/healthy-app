import Weight from '../../../pages/children/children/weight.vue'
import sharedMixin from '../../../shared/mixin'

// hide title bar
try {
  const titleBar = weex.requireModule('titleBar')
  titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

Weight.el = '#root'
new Vue(Weight)
