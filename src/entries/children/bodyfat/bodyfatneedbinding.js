import BodyFatNeedBinding from '../../../pages/children/bodyfat/BodyFatNeedBinding.vue'
import sharedMixin from '../../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

BodyFatNeedBinding.el = '#root'
new Vue(BodyFatNeedBinding)
