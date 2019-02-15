import indicatorMonitoring from '../../../pages/children/archives/indicatorMonitoring.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

indicatorMonitoring.el = '#root'
new Vue(indicatorMonitoring)
