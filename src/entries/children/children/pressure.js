import pressure from '../../../pages/children/children/pressure.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

pressure.el = '#root'
new Vue(pressure)
