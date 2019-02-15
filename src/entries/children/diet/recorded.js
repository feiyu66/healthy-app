import recorded from '../../../pages/children/diet/recorded.vue'
import sharedMixin from '../../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}


// use shared mixins
Vue.mixin(sharedMixin)

recorded.el = '#root'
new Vue(recorded)
