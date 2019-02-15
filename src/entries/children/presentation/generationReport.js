import generationReport from '../../../pages/children/presentation/generationReport.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

generationReport.el = '#root'
new Vue(generationReport)
