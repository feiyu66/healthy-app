import dietquestions from '../../../pages/children/diet/dietquestions.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

dietquestions.el = '#root'
new Vue(dietquestions)
