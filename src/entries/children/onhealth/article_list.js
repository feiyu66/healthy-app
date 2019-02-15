import ArticleList from '../../../pages/children/onhealth/article_list.vue'
import sharedMixin from '../../../shared/mixin'

// use shared mixins
Vue.mixin(sharedMixin)

ArticleList.el = '#root'
new Vue(ArticleList)
