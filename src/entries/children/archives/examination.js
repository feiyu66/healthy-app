import examination from '../../../pages/children/archives/examination.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

examination.el = '#root'
new Vue(examination)
