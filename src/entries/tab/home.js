// 首页
import Home from '../../components/children/Home.vue'
import sharedMixin from '../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

Home.el = '#root'
new Vue(Home)
