import readDetails from '../../../pages/children/read/readDetails.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

readDetails.el = '#root'
new Vue(readDetails)
