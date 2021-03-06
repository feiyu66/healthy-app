import BodyfatSearch from '../../../pages/children/bodyfat/BodyfatSearch.vue'
import sharedMixin from '../../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

BodyfatSearch.el = '#root'
new Vue(BodyfatSearch)
