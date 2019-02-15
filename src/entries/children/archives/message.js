import message from '../../../pages/children/archives/message.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

message.el = '#root'
new Vue(message)
