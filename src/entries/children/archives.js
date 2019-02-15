import Archives from '../../pages/children/Archives.vue'
import sharedMixin from '../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

Archives.el = '#root'
new Vue(Archives)
