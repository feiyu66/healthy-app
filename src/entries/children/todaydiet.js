import Todaydiet from '../../pages/children/Todaydiet.vue'
import sharedMixin from '../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

Todaydiet.el = '#root'
new Vue(Todaydiet)
