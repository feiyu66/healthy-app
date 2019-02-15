import register from '../../../pages/children/register/register.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

register.el = '#root'
new Vue(register)
