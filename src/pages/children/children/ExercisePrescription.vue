<template>
    <div class="wrapper-app">
        <scroller class="section" :style="listStyle">
            <div class="prompt-box" v-if="flag">
                <image class="hint_info" :src="getImgPath('icon_hint_white.png')"/>
                <text class="tooltip">您的运动处方已过期，请联系医生为您处理!</text>
            </div>
            <div class="main">
                <div class="main-top">
                    <div class="head">
                        <text class="head-one">根据您当前的健康状况，运动处方如下</text>
                        <text class="head-two">运动处方分适应期和提高期两个阶段；每次运动分为：准备活动部分、有效活动部分、整理活动部分。</text>
                        <text class="head-three">当前阶段：{{curStage}}</text>
                    </div>
                    <div class="activity">
                        <text class="Get-ready">准备活动部分</text>
                        <div class="uls-ml">
                            <text class="lis list-border">活动项目: {{preSportItem}}</text>
                            <text class="lis">活动时间: {{preSportTime}}</text>
                        </div>
                        <text class="Get-ready">有效运动部分</text>
                        <div class="total">
                            <div class="every-item">
                                <div v-for="(item, index) in data" :key='index' @click='addStyle(index)' class="every-item-div" :class="[list == index ? 'ondiv' : '']">
                                    <text :class="[list == index ? 'ontext' : '']" class="every-item-text" >{{item}}</text>
                                </div>
                            </div>
                            <div class="tab">
                                <div class="uls" v-if="list == 0">
                                    <text class="active">(有氧运动时间间隔不宜超过一天)</text>
                                    <text class="lis list-border">运动项目: {{validSportItem}}</text>
                                    <text class="lis list-border">运动强度: {{validSportHeart}}</text>
                                    <text class="lis list-border">运动频率: {{validSportFreq}}</text>
                                    <text class="lis">有效时间: {{validSportTime}}</text>
                                </div>
                                <div class="uls" v-else>
                                    <text class="active">(抗阻运动至少要间隔两天)</text>
                                    <text class="lis">运动项目: {{validTrainItem}}</text>
                                    <text class="lis list-border">运动强度: {{validTrainIntensity}}</text>
                                    <text class="lis list-border">运动频率: {{validTrainFreq}}</text>
                                </div> 
                            </div>
                        </div>
                        <text class="Get-ready">整理运动部分</text>
                        <div class="uls-ml">
                            <text class="lis list-border">活动项目: {{tidySportItem}}</text>
                            <text class="lis">活动时间: {{tidySportTime}}</text>
                        </div>
                    </div>
                </div>
            </div>
            <div class="be-careful">
                <text class="foo">注意事项</text>
                <div class="foo-eveny">
                    <text class="list">当出现如下药物反应时，建议停止运动：心慌、胸闷、头晕，四肢冰冷</text>
                    <text class="list">安静时血压未能很好控制或者超过180/110mmHg时，暂时不要运动</text>
                </div>
            </div>
        </scroller>
        <div class="header">
            <div class="header-left" @click="toBack">
                    <image class="icon_back" :src="getImgPath('icon_back_white.png')"/>
                    <text class="back">返回</text>
            </div>
            <div class="header-title"><text class="title">运动处方</text></div>
            <div class="header-right"></div>
        </div>
    </div>
</template>
<script>
import { Utils } from "weex-ui";
import api from "../../../shared/request";
import { printLog, storage_getItem } from "../../../shared/utils";
export default {
  name: "exerciseprescription",
  data() {
    return {
      baseURL: "",
      mbrId: "",
      list: 0,
      data: ["有氧运动", "抗阻训练"],
      flag: false,
      curStage: "", // 时期
      preSportItem: "", // 准备活动项目
      preSportTime: "", // 准备活动时间
      validSportItem: "", // 有氧运动项目
      validSportHeart: "", // 有氧运动运动强度
      validSportTime: "", // 有氧运动运动时间
      validSportFreq: "", // 频率
      preSportTime: "", // 准备活动时间
      validTrainItem: "", // 抗组训练项目
      validTrainIntensity: "", // 抗阻训练强度
      validTrainFreq: "", // 抗组训练频率
      validTrainGroup: "",
      tidySportItem: "", // 整理运动项目
      tidySportTime: "" // 整理运动时间
    };
  },
  created() {
    this.listStyle = { height: Utils.env.getPageHeight() - 100 + "px" };
    this.getmbrnewsportprescription();
  },
  methods: {
    getmbrnewsportprescription: async function() {
      if (!this.mbrId || !this.baseURL) {
        this.mbrId = await storage_getItem("mbrId");
        this.baseURL = await storage_getItem("oldApiBase");
      }
      printLog(this.mbrId);
      printLog(this.baseURL);
      let params = {
        mbrId: this.mbrId
      };
      api.get(
        `${this.baseURL}appemrservice/getmbrnewsportprescription.json?`,
        params,
        data => {
          let entity = data.sportPrescriptionEntity;
          if (!data.sportPrescriptionEntity) {
            printLog("nodata true");
          } else {
            console.log(entity);
            if (entity.curStage == "01") {
              this.curStage = "适应期";
              this.preSportTime = entity.preSportTime1;
              this.validSportHeart =
                entity.validSportHeart11 +
                "-" +
                entity.validSportHeart12 +
                "次/分钟";
              this.validSportTime = entity.validSportTime11 + "分钟";
              if (entity.validSportFreq11 == entity.validSportFreq12) {
                this.validSportFreq = `每周${entity.validSportFreq11}次`;
              } else {
                this.validSportFreq = `每周${entity.validSportFreq11}-${
                  entity.validSportFreq12
                }次`;
              }
            } else if (entity.curStage == "02") {
              this.curStage = "提高期";
              this.preSportTime = entity.preSportTime2;
              this.validSportHeart =
                entity.validSportHeart21 +
                "-" +
                entity.validSportHeart22 +
                "次/分钟";
              this.validSportTime = entity.validSportTime21 + "分钟";
              if (entity.validSportFreq21 == entity.validSportFreq22) {
                this.validSportFreq = `每周${entity.validSportFreq21}次`;
              } else {
                this.validSportFreq = `每周${entity.validSportFreq21}-${
                  entity.validSportFreq22
                }次`;
              }
            }
            // 获取当前时间
            let myDate = new Date(); //2018-05-02 00:00:00
            let Month = myDate.getMonth() + 1;
            let Data = myDate.getDate();
            if (Month < 10) {
              Month = "0" + Month;
            }
            if (Data < 10) {
              Data = "0" + Data;
            }
            let newDate =
              myDate.getFullYear() +
              "-" +
              Month +
              "-" +
              Data +
              " " +
              myDate.getHours() +
              ":" +
              myDate.getMinutes() +
              ":" +
              myDate.getSeconds();
            if (newDate > entity.endDate) {
              this.flag = true;
              console.log("运动处方已过期, 请联系医院复查更新处方");
            } else {
              this.flag = false;
              console.log("222");
            }
            this.preSportItem = entity.preSportItem;
            this.validSportItem = entity.validSportItem;
            this.validTrainItem = entity.validTrainItem;
            this.validTrainIntensity = entity.validTrainIntensity;
            this.validTrainFreq = entity.validTrainFreq;
            this.tidySportItem = entity.tidySportItem;
            this.tidySportTime = entity.tidySportTime;
          }
        }
      );
    },
    toBack() {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    addStyle(index) {
      this.list = index;
    }
  }
};
</script>
<style scoped>
.wrapper-app {
  flex-direction: column;
}
.header {
  position: absolute;
  top: 0px;
  width: 750px;
  height: 100px;
  background-color: #02b3ed;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-left {
  flex: 1;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-title {
  flex: 4;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-right {
  flex: 1;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.back {
  font-size: 28px;
  color: #ffffff;
}
.icon_back {
  width: 40px;
  height: 40px;
}
.title {
  font-size: 38px;
  color: #ffffff;
}
.section {
  margin-top: 100px;
  flex: 1;
}
.prompt-box {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
  text-align: center;
  line-height: 60px;
  background-color: #02b3ed;
  z-index: 999;
}
.hint_info {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}
.tooltip {
  display: inline-block;
  font-size: 26px;
  color: rgb(255, 255, 255);
  line-height: 60px;
}
.main {
  background-color: #eeeeee;
}
.main-top {
  background-color: #fff;
  border-radius: 10px;
  margin: 10px 20px 20px;
}
.head {
  border-bottom-width: 1px;
  border-bottom-color: rgb(238, 238, 238);
}
.head-one {
  margin: 0 20px;
  font-size: 30px;
  color: rgb(51, 51, 51);
  line-height: 50px;
}
.head-two {
  margin: 0 20px;
  font-size: 26px;
  color: rgb(153, 153, 153);
}
.head-three {
  font-size: 36px;
  color: rgb(2, 179, 237);
  line-height: 70px;
  text-align: center;
}
.Get-ready {
  width: 260px;
  height: 60px;
  color: #ffffff;
  line-height: 60px;
  text-align: center;
  background-image: linear-gradient(to right, #63d6fc, #02b3ed);
  border-top-left-radius: 30px;
  border-bottom-right-radius: 30px;
  margin-left: 20px;
  margin-top: 20px;
  font-size: 32px;
}
.total {
  margin-left: 20px;
}
.every-item-div {
  height: 80px;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.every-item {
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.every-item-text {
  justify-content: center;
  align-items: center;
  color: rgb(51, 51, 51);
  font-size: 30px;
}
.ondiv {
  border-bottom-width: 1px;
  border-bottom-color: rgb(2, 179, 237);
}
.ontext {
  color: rgb(2, 179, 237);
  font-size: 34px;
}
.active {
  font-size: 28px;
  color: rgb(2, 179, 237);
  margin-top: 20px;
}
.tab {
  height: 300px;
  display: -webkit-flex;
}
.uls {
}
.uls-ml {
  height: 180px;
  margin-left: 30px;
}
.lis {
  font-size: 28px;
  color: rgb(102, 102, 102);
  margin-top: 14px;
  padding-bottom: 14px;
}
.list-border {
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
}
.be-careful {
  height: 400px;
  background-color: #ffffff;
}
.foo {
  border-left-width: 5px;
  border-left-color: #04b4ef;
  font-size: 34px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 30px;
  padding-left: 30px;
}
.foo-eveny {
  counter-reset: count;
  margin-left: 50px;
}
.list::before {
  content: "●";
  color: #04b4ef;
  margin-right: 10px;
}
.list {
  font-size: 28px;
  color: rgb(102, 102, 102);
  margin-right: 30px;
}
</style>
