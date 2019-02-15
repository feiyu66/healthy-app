import Motion from '../../pages/children/Motion.vue'
import sharedMixin from '../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}


// use shared mixins
Vue.mixin(sharedMixin)

Motion.el = '#root'
new Vue(Motion)
