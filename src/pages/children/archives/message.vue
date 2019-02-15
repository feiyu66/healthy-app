<template>
  <div class="box">
    <wxc-minibar title="个人信息"
        background-color="#ffffff"
        text-color="#000000"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick">
      <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
        <image class="icon_back" :src="getImgPath('icon_back.png')"/>
      </div>
    </wxc-minibar>
    <div class="main">
      <wxc-tab-page ref="wxc-tab-page"
          :title-use-slot="true"
          :tab-titles="tabTitles"
          :tab-styles="tabStyles"
          :tab-page-height="tabPageHeight"
          @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        <div slot="tab-title-0" class="tab_page_left" :class="[num == 0 ? 'bg' : '']"><text class="tab_word" :class="[num == 0 ? 'on' : '']">基本信息</text></div>
        <div slot="tab-title-1" class="tab_page_right" :class="[num == 1 ? 'bg' : '']"><text class="tab_word" :class="[num == 1 ? 'on' : '']">既往史</text></div>
        <div :style="dietStyle"><Message/></div>
        <div :style="dietStyle"><MedicalHistory/></div> 
      </wxc-tab-page> 
    </div>
  </div>
</template>
<script>
import { WxcMinibar, WxcTabPage, Utils } from "weex-ui";
import Message from '../../../components/Archives/message.vue'
import MedicalHistory from '../../../components/Archives/MedicalHistory.vue'
const dom = weex.requireModule('dom');
import { createLink, printLog, storage_getItem } from '../../../shared/utils'
import Config from '../../../shared/message'
export default {
  components: {
    WxcMinibar,
    WxcTabPage,
    Message,
    MedicalHistory
  },
  data () {
    return {
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles,
      tabList: [],
      demoList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      tabPageHeight: 1334,
      num: 0
    }
  },
  created () {
    printLog("Message")
    printLog(Utils.env.getPageHeight())
    this.dietStyle = { width: "750px", height: Utils.env.getPageHeight()  + "px" };
    if (WXEnvironment.platform == "Web") {
        this.tabPageHeight = Utils.env.getPageHeight() - 88;
    }else {
        this.tabPageHeight = Utils.env.getPageHeight()+88;
    }
    this.tabList = [...Array(this.tabTitles.length).keys()].map(i => []);
    Vue.set(this.tabList, 0, this.demoList);
  },
  methods: {
    wxcTabPageCurrentTabSelected (e) {
        const self = this;
        const index = e.page;
        this.num = index
        /* Unloaded tab analog data request */
        if (!Utils.isNonEmptyArray(self.tabList[index])) {
            setTimeout(() => {
                Vue.set(self.tabList, index, self.demoList);
            }, 100);
        }
    },
    minibarLeftButtonClick () {

    }
  }
}
</script>
<style>
.tab-title-list {
  justify-content: center;
}
  .wxc-minibar{
      border-bottom-width: 1px;
      border-bottom-color: #cccccc;
  }
  .icon_back{
    width: 40px;
    height: 40px;
  }
</style>
<style lang="less" scoped>
  .tab_page_left, .tab_page_right{
    width: 200px;
    height: 60px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-width: 1px;
    border-color: rgb(2, 179, 237);
  }
  .tab_page_left{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .tab_page_right{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .tab_word{
    color: rgb(2, 179, 237);
  }
  .bg{
    background-color: rgb(2, 179, 237);
  }
  .on{
    color: rgb(255, 255, 255);
  }
</style>
