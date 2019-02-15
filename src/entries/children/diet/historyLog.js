import historyLog from '../../../pages/children/diet/historyLog.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

historyLog.el = '#root'
new Vue(historyLog)
