import Measured from '../../pages/children/Measured.vue'
import sharedMixin from '../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

Measured.el = '#root'
new Vue(Measured)
