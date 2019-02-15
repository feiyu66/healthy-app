// 论健
import Onhealth from '../../components/children/Onhealth.vue'
import sharedMixin from '../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

Onhealth.el = '#root'
new Vue(Onhealth)
