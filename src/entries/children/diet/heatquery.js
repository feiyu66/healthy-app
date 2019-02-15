import heatquery from '../../../pages/children/diet/heatquery.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

heatquery.el = '#root'
new Vue(heatquery)
