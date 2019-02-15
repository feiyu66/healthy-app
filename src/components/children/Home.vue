<template>
    <div class="box">
        <div class="head" @click="openMask">
            <div class="navbar" v-if="isShowNavbar"></div>
            <text class="tip" style="cursor: pointer;" @click="openMask">健康行为评价</text>
            <div class="header" v-if="flag">
                <text class="data" style="cursor: pointer;" @click="openMask">{{startTime}}~{{endTime}}</text>
                <div class="branch" @click="openMask">
                  <text class="fraction" style="cursor: pointer;">{{score}}</text>
                  <text class="branchNum">分</text>
                </div>
                <div class="foo">
                    <image v-if="difference" class="min_img" :src="getImgPath('expression_worse.png')"/>
                    <image v-if="commonly" class="min_img" :src="getImgPath('expression_ordinary.png')"/>
                    <image v-if="excellent" class="min_img" :src="getImgPath('expression_excellent.png')"/>
                    <div class="word">
                        <text class="result">前七天评价结果：{{evaluation}}!</text>
                        <text class="comment">{{comment}}</text>
                    </div>
                </div>
            </div> 
            <div style="height: auto;" class="header_smile" v-else>
                <image class="icon_smile" :src="getImgPath('icon_smile.png')"/>
                <div style="margin-top: 46px;"><text class="tooltip">满七天后会为您进行健康行为评价</text></div>
            </div>
        </div>
        <div class="main">
            <div class="main-box">
                <div class="logo" @click="jump('motion')">
                    <image v-if="isRecorded[0] == 0" class="unfinished" :src="getImgPath('sports_unfinished.png')"/>
                    <image v-if="isRecorded[0] == 1" class="unfinished" :src="getImgPath('sports_finish.png')"/>
                    <text class="text">今日运动</text>
                </div>
            </div>
            <div class="main-box">
                <div class="logo" @click="jump('food')">
                    <image v-if="isRecorded[1] == 0" class="unfinished" :src="getImgPath('diet_unfinished.png')"/>
                    <image v-if="isRecorded[1] == 1" class="unfinished" :src="getImgPath('diet_finish.png')"/>
                    <text class="text">今日饮食</text>
                </div>
            </div>
            <div class="main-box">
                <div class="logo" @click="jump('measured')">
                    <image v-if="isRecorded[2] == 0" class="unfinished" :src="getImgPath('measure_unfinished.png')"/>
                    <image v-if="isRecorded[2] == 1" class="unfinished" :src="getImgPath('measure_finish.png')"/>
                    <text class="text" style="marginBottom: 50px">今日必测</text>
                </div>
            </div>
            <div class="main-box">
                <div class="logo" @click="jump('read')">
                    <image v-if="isRecorded[3] == 0" class="unfinished" :src="getImgPath('book_unfinished.png')"/>
                    <image v-if="isRecorded[3] == 1" class="unfinished" :src="getImgPath('book_finish.png')"/>
                    <text class="text" style="marginBottom: 50px">今日必读</text>
                </div>
            </div>
        </div>
        <wxc-mask :height="maskHeight"
            width="520"
            border-radius="20"
            duration="200"
            mask-bg-color="#FFFFFF"
            :has-animation="hasAnimation"
            :has-overlay="true"
            :show-close="false"
            :show="show"
            @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <div class="demo-title">
                    <div class="symbol" style="width: 750px;">
                        <image class="icon_cancel" @click="wxcMaskSetHidden" :src="getImgPath('icon_cancel.png')"/>
                    </div>
                    <text class="title">健康行为评价</text>
                </div>
                <text class="content-text">        自开展健康管理之日起，以七天为周期，对您的主要健康行为进行的综合评价。
                </text>
                <div class="too-word">
                    <text class="color">优秀：</text>
                    <text class="explain">≥90分，代表您积极落实了健康管理所要求的各项健康行为。</text>
                </div>
                <div class="too-word">
                    <text class="color">一般：</text>
                    <text class="explain">75-89分，代表您基本落实了健康管理所要求的各项健康行为。</text>
                </div>
                <div class="too-word">
                    <text class="color">较差：</text>
                    <text class="explain"> < 75分，代表您未落实好健康管理所要求的各项健康行为。</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>
<script>
import { createLink, printLog } from "../../shared/utils";
import { WxcMask } from "weex-ui";
import api from "../../shared/request";
const storage = weex.requireModule("storage");
const globalEvent = weex.requireModule("globalEvent");
export default {
  components: {
    WxcMask
  },
  data() {
    return {
      isShowNavbar: true,
      startTime: "", // 开始时间
      endTime: "", // 结束时间
      show: false,
      hasAnimation: true,
      score: null, // 分数
      evaluation: "", // 评价结果
      comment: "", // 评语
      difference: false, // 较差
      commonly: false, // 一般
      excellent: false, // 优秀
      flag: true,
      isRecorded: [0, 0, 0, 0],
      mbrId: "",
      birth: "",
      oldApiBase: "",
      newApiBase: ""
    };
  },
  created() {
    printLog(weex.config.env.deviceHeight)
    if (WXEnvironment.platform === "android") {
      this.maskHeight = 650
      if (weex.config.env.deviceHeight == 1920) {
        this.isShowNavbar = true;
      } else if (weex.config.env.deviceHeight < 1300) {
        // 1208 1280
        this.isShowNavbar = false;
      } else {
        this.isShowNavbar = true;
      }
    } else {
      this.maskHeight = 740
      this.isShowNavbar = false;
    }

    this.mbrId = weex.config.mbrId ? weex.config.mbrId : "13900000098-mbr";
    this.birth = weex.config.birth ? weex.config.birth : "1988-07-08";
    this.oldApiBase = weex.config.oldApiBase
      ? weex.config.oldApiBase
      : "http://47.93.97.118:8088/dl_biz/rest/";
    this.newApiBase = weex.config.newApiBase
      ? weex.config.newApiBase
      : "http://test.dlcaring.com/";
    printLog(weex.config.mbrId);
    storage.setItem("mbrId", this.mbrId, function(e) {
      printLog(e.result);
      printLog(e.data);
    });
    storage.setItem("birth", this.birth);
    storage.setItem("oldApiBase", this.oldApiBase);
    storage.setItem("newApiBase", this.newApiBase);

    this.dataTime();
    this.getHealthEvaluation();

    const refresh = new BroadcastChannel("refresh-home-evaluation");
    refresh.onmessage = event => {
      printLog(event.data); // Assemble!
      this.getHealthEvaluation();
    };
    if (WXEnvironment.platform == "iOS") {
    globalEvent.addEventListener("refresh-home-evaluation", res => {
      this.getHealthEvaluation();
    });
    }
  },
  methods: {
    getHealthEvaluation() {
      let params = {
        userId: this.mbrId
      };
      printLog(`${this.newApiBase}health/evaluation?`)
      api.get(`${this.newApiBase}health/evaluation?`, params, data => {
        printLog(data);
        if (data.code == 200) {
          // if (data.data == "暂无评分") {
          //   this.flag = false
          // } else {
          //   this.flag = true
          this.isRecorded = data.data.isRecorded.split(",");
          if (data.data.score != "暂无评分") {
            this.flag = true;
            this.score = data.data.score;
            this.evaluation = data.data.evaluation;
            if (data.data.evaluation == "较差") {
              this.comment = "今天需要加油！";
              this.difference = true;
              this.commonly = false;
              this.excellent = false;
            } else if (data.data.evaluation == "一般") {
              this.comment = "今天需要加油！";
              this.difference = false;
              this.commonly = true;
              this.excellent = false;
            } else {
              this.comment = "不错，继续保持！";
              this.difference = false;
              this.commonly = false;
              this.excellent = true;
            }
            if (data.data.score != null) {
              this.flag = true;
            } else {
              this.flag = false;
            }
          } else {
            this.flag = false;
          }
          // }
        }
      });
    },
    openMask(e) {
      this.show = true;
      this.hasAnimation = true;
    },
    wxcMaskSetHidden() {
      this.show = false;
    },
    dataTime() {
      let newTime = new Date();
      let Month = newTime.getMonth() + 1;
      let Data = newTime.getDate() - 1;
      let oldTime = new Date();
      oldTime.setDate(newTime.getDate() - 7);
      let oldData = oldTime.getDate();
      // if (Month < 10) {
      //     Month =  '0' + Month
      // }
      if (Data < 10) {
        Data = "0" + Data;
      }
      if (oldData < 10) {
        oldData = "0" + oldData;
      }
      this.endTime = Month + "." + Data;
      this.startTime = oldTime.getMonth() + 1 + "." + oldData;
    },
    jump(path) {
      if (!path) return;
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../../style/styles.scss";
.box {
  overflow-y: scroll;
}
.head {
  width: 750px;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(to bottom, #02b3ed, #028ced);
}
.tip {
  font-size: 38px;
  margin-top: 100px;
  color: rgb(255, 255, 255);
}
.data {
  margin-top: 20px;
  font-size: 24px;
  color: rgb(255, 255, 255);
}
.branch{
  flex-direction: row;
  align-items: flex-end;
}
.fraction {
  font-size: 100px;
  margin-top: 56px;
  color: rgb(255, 255, 255);
  font-family: "DIN";
}
.branchNum{
  font-size: 38px;
  color: rgb(255, 255, 255);
  margin-bottom: 20px;
  margin-left: 10px;
}
.foo {
  height: 50px;
  margin-top: 40px;
  margin-bottom: 40px;
  flex-direction: row;
}
.min_img {
  width: 44px;
  height: 44px;
  margin-right: 20px;
}
.word {
  flex-direction: row;
  align-items: center;
}
.result,
.comment {
  font-size: 30px;
  color: rgb(255, 255, 255);
}
.comment {
  margin-left: 10px;
}
.header,
.header_smile {
  flex-direction: column;
  align-items: center;
}
.header_smile {
  padding-top: 46px;
  padding-bottom: 40px;
}
.icon_smile {
  width: 128px;
  height: 128px;
  // margin-top: 46px;
  // margin-bottom: 46px;
}
.tooltip {
  font-size: 30px;
  color: rgb(255, 255, 255);
  // margin-bottom: 40px;
}
.main {
  width: 750px;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
}
.main-box {
  width: 375px;
  height: 340px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logo {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.unfinished {
  width: 210px;
  height: 210px;
  margin-top: 50px;
}
.text {
  margin-top: 20px;
  font-size: 30px;
  color: rgb(51, 51, 51);
}
/*-------------提示弹层-------------------*/
.content {
  padding-top: 20px;
  padding-left: 50px;
  padding-right: 50px;
}
.symbol {
  flex-direction: row;
  justify-content: flex-end;
}
.icon_cancel {
  width: 36px;
  height: 36px;
}
.title {
  text-align: center;
  font-size: 34px;
  color: rgb(51, 51, 51);
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom-width: 2px;
  border-bottom-color: #eeeeee;
}
.content-text {
  margin-bottom: 20px;
}
.too-word {
  flex-direction: row;
  margin-bottom: 28px;
}
.explain {
  width: 340px;
  font-size: 28px;
  color: rgb(51, 51, 51);
  /* text-indent: 2em; */
}
.color {
  font-size: 28px;
  color: rgb(2, 179, 237);
}
</style>
<style>
.content-text {
  text-indent: 50px;
  font-size: 28px;
  color: rgb(51, 51, 51);
}
.weex-text {
  white-space: normal;
}
</style>
