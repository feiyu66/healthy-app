<template>
  <wxc-tab-bar :tab-titles="tabTitles"
               :tab-styles="tabStyles"
               title-type="icon"
               @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
    <!--The first page content-->
    <div class="item-container" :style="contentStyle"><Home/></div> 

    <!--The second page content-->
    <div class="item-container" :style="contentStyle"><Onhealth/></div> 

    <!-- The third page content-->
    <div class="item-container" :style="contentStyle"><Consultation/></div> 

    <!-- The fourth page content-->
    <div class="item-container" :style="contentStyle"><Mine/></div> 
  </wxc-tab-bar>
</template>

<style scoped>
    *{
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-family: '思源黑体'; 
    }
    a{
        text-decoration: none;
        color: #000;
    } 
    .item-container {
        width: 750px;
        background-color: #ffffff;
    }
</style>
<script>
import { WxcTabBar, Utils } from 'weex-ui'
import Config from '../shared/config'
// 首页
import Home from '../components/children/Home.vue'
// 咨询
import Consultation from '../components/children/Consultation.vue'
// 论健
import Onhealth from '../components/children/Onhealth.vue'
import Mine from '../components/children/Mine.vue'
export default {
    components: { WxcTabBar, Home, Onhealth, Consultation, Mine },
    data: () => ({
        tabTitles: Config.tabTitles,
        tabStyles: Config.tabStyles
    }),
    created () {
        const tabPageHeight = Utils.env.getPageHeight();
        const { tabStyles } = this;
        this.contentStyle = { height: (tabPageHeight - tabStyles.height) + 'px' };
    },
    methods: {
        wxcTabBarCurrentTabSelected (e) {
            const index = e.page;
        }
    }
};
</script>