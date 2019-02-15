import ExercisePrescription from '../../../pages/children/children/ExercisePrescription.vue'
import sharedMixin from '../../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

ExercisePrescription.el = '#root'
new Vue(ExercisePrescription)
