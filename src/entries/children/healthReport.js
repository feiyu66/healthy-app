
import healthReport from '../../pages/children/healthReport.vue'
import sharedMixin from '../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

healthReport.el = '#root'
new Vue(healthReport)
