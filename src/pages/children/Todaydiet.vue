<template>
    <div class="box" style="position: relative;">
        <wxc-minibar title="今日饮食"
            background-color="#ffffff"
            text-color="#000000"
            right-text="历史日志"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;">
            <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
          </div>
        </wxc-minibar>
        <div class="mian">
            <wxc-tab-page ref="wxc-tab-page"
                :title-use-slot="true"
                :tab-titles="tabTitles"
                :tab-styles="tabStyles"
                :tab-page-height="tabPageHeight"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected"> 
                <div slot="tab-title-0" :class="[num == 0 ? 'tab_active' : 'tab_inactive']" class="tab_page">
                  <text class="tab_title" :class="[num == 0 ? 'on' : '']">今日饮食日志</text>
                </div>
                <div slot="tab-title-1" :class="[num == 1 ? 'tab_active' : 'tab_inactive']" class="tab_page">
                  <text class="tab_title" :class="[num == 1 ? 'on' : '']">昨日饮食日志</text>
                  <text :class="[recordFlag == true ? 'word_bg' : 'word_on']">（{{tooWord}}）</text>
                </div>
                <div :style="dietStyle"><TodayDiet/></div>
                <div :style="dietStyle"><YesterdayDiet @submitAdd="appendToList" ref="yesterday"/></div>
            </wxc-tab-page> 
        </div>
    </div>
</template>
<script>
const dom = weex.requireModule("dom");
import { createLink, printLog, storage_getItem } from "../../shared/utils";
import { WxcMinibar, WxcTabPage, WxcPanItem, Utils, BindEnv } from "weex-ui";
import api from "../../shared/request";
import TodayDiet from "../../components/Diet/todayDiet.vue";
import YesterdayDiet from "../../components/Diet/yesterdayDiet.vue";
import Config from "../../shared/todaydiet";
const storage = weex.requireModule("storage");
export default {
  components: { WxcMinibar, WxcTabPage, WxcPanItem, TodayDiet, YesterdayDiet },
  data: () => ({
    tabTitles: Config.tabTitles,
    tabStyles: {
      bgColor: "#FFFFFF",
      titleColor: "#666666",
      activeTitleColor: "#02b3ed",
      activeBgColor: "#FFFFFF",
      isActiveTitleBold: false,
      iconWidth: 46,
      iconHeight: 36,
      width: 374,   //ios在自定义slot时还是用这里的宽和高,ios在tab上还要指定个不激活的样式不然激活的样式去不掉
      height: 100,
      fontSize: 28,
      textPaddingLeft: 30,
      textPaddingRight: 30
    },
    tabList: [],
    demoList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    tabPageHeight: 1334,
    tooWord: "",
    num: 0,
    baseURL: "",
    mbrId: "",
    startData: "",
    recordFlag: null,
    statusFlag: ''
  }),
  created() {
    printLog("Todaydiet");
    printLog(Utils.env.getPageHeight());
    this.dietStyle = {
      width: "750px",
      height: Utils.env.getPageHeight() + "px"
    };
    if (WXEnvironment.platform == "Web") {
      this.tabPageHeight = Utils.env.getPageHeight() - 88;
    } else {
      this.tabPageHeight = Utils.env.getPageHeight() + 88;
    }
    this.tabList = [...Array(this.tabTitles.length).keys()].map(i => []);
    Vue.set(this.tabList, 0, this.demoList);
    const setpage = new BroadcastChannel("setpage-todaydiet-tabpage");
    setpage.onmessage = event => {
      printLog(event.data); // Assemble!
      if (event.data == "yesterday!") {
        this.$refs["wxc-tab-page"].setPage(1, null, false);
      } else {
        this.$refs["wxc-tab-page"].setPage(0, null, false);
      }
    };
    this.getquestions();
  },
  methods: {
    getquestions: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      let newDate = new Date();
      let Month = newDate.getMonth() + 1;
      let Data = newDate.getDate() - 1;
      this.startData = new Date(
        new Date().setDate(new Date().getDate() - 1) -
          new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
      let params = {
        date: this.startData,
        userId: this.mbrId
      };
      api.get(`${this.baseURL}health/diet/one?`, params, data => {
        console.log(data);
        if (data.code == 200) {
          data.data.questions.map(item => {
            if (item.chose == null) {
              this.recordFlag = false;
              this.tooWord = "需补记";
            } else {
              this.recordFlag = true;
              this.tooWord = "已记录";
            }
          });
        }
      });
    },
    wxcTabPageCurrentTabSelected(e) {
      const self = this;
      const index = e.page;
      this.num = index;
      // if (this.num == 2) {
      //   let questions = this.$refs.yesterday.$emit('bridge').questions
      //   questions.map(item => {
      //     if (item.chose == null) {
      //       this.recordFlag = false;
      //       this.tooWord = "需补记";
      //     } else {
      //       this.recordFlag = true;
      //       this.tooWord = "已记录";
      //     }
      //   });
      // }
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    wxcPanItemPan(e) {
      if (BindEnv.supportsEBForAndroid()) {
        this.$refs["wxc-tab-page"].bindExp(e.element);
      }
    },
    appendToList (item) {
      printLog("appendToList")
      printLog(item)
      if (item == true) {
        this.recordFlag = true;
        this.tooWord = "已记录";
      } else {
        this.recordFlag = false;
        this.tooWord = "需补记";
      }
    },
    jump(path) {
      if (!path) return;
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    },
    minibarLeftButtonClick() {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    minibarRightButtonClick() {
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink("historyLog"),
        animated: "true"
      });
    }
  }
};
</script>
<style>
.tab-title-list {
  justify-content: center;
}
</style>

<style scoped>
.tab_page {
  width: 374px;
  height: 100px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.word_bg {
  font-size: 32px;
  color: rgb(55, 199, 52);
}
.word_on {
  font-size: 32px;
  color: #e78942;
}
.tab_title {
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size: 32px;
  color: rgb(51, 51, 51);
}
.tab_active {
  border-bottom-width: 2px;
  border-bottom-color: #02B3ED;
}
.tab_inactive {
  border-bottom-width: 0px;
  border-bottom-color: #fff;
}
.on {
  color: rgb(2, 179, 237);
}
.icon_back {
  width: 40px;
  height: 40px;
}
.header {
  height: 100px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
}
.text {
  flex: 1.5;
  height: 100px;
  justify-content: center;
  align-items: center;
}
.text-one {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 20px;
}
.text-jump {
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.returnImg {
  width: 50px;
  height: 50px;
}
.text-password {
  flex: 4;
  font-size: 40px;
}
</style>

