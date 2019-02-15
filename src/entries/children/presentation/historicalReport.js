import historicalReport from '../../../pages/children/presentation/historicalReport.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

historicalReport.el = '#root'
new Vue(historicalReport)
