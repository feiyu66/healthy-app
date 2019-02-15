import Guide from '../pages/Guide.vue'
import sharedMixin from '../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}


// use shared mixins
Vue.mixin(sharedMixin)

Guide.el = '#root'
new Vue(Guide)
