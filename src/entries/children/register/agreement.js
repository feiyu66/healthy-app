import agreement from '../../../pages/children/register/agreement.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

agreement.el = '#root'
new Vue(agreement)
