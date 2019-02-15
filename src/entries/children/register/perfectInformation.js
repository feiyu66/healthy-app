import perfectInformation from '../../../pages/children/register/perfectInformation.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

perfectInformation.el = '#root'
new Vue(perfectInformation)
