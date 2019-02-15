import Article from '../../../pages/children/onhealth/article.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

Article.el = '#root'
new Vue(Article)
