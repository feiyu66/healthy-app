import sugar from '../../../pages/children/children/sugar.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

sugar.el = '#root'
new Vue(sugar)
