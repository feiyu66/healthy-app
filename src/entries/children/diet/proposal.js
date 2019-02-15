import proposal from '../../../pages/children/diet/proposal.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

proposal.el = '#root'
new Vue(proposal)
