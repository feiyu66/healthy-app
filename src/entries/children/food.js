import Food from '../../pages/children/Food.vue'
import sharedMixin from '../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

Food.el = '#root'
new Vue(Food)
