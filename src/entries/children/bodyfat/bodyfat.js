import BodyFat from '../../../pages/children/bodyfat/BodyFat.vue'
import sharedMixin from '../../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

BodyFat.el = '#root'
new Vue(BodyFat)
