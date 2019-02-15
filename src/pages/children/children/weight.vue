<template>
    <div class="box">
        <wxc-minibar title="体重监测"
            background-color="#ffffff"
            text-color="#000000"
            right-text="手动记录"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;"> 
        </wxc-minibar>
        <div class="main" style="overflow-y: scroll;">
              <div class="main-date">
                  <text class="date">{{selectedDate[0]}}</text>
              </div>
              <div v-if="today_recorded == true" class="each-item">
                  <div class="weight">
                      <text class="word">体重</text>
                      <text class="sumData">{{weight}}kg</text>
                  </div>
                  <div class="fat-rate">
                      <text class="word">体脂率</text>
                      <text class="sumData">{{bodyfat}}%</text>
                  </div>
                  <div class="bmI">
                      <text class="word">BMI</text>
                      <text class="sumData" :class="[ bmIwarning == true ? 'bmIon' : '']">{{bmI}}</text>
                  </div>
              </div> 
              <div v-else class="goRecord">
                <text class="record_wrod">今日未记录</text>
              </div>
              <div class="dataRange"><text v-if="bmIwarning" class="range">正常范围：18.5~24</text></div>
            <div class="fat-scale">
                <div class="scale-btn" @click='openBodyFat'>
                    <image class="scales" :src="getImgPath('scales.png')"/>
                    <text class="tip">体脂秤测量</text>
                </div>
            </div>
            <div class="background"></div>
            <div class="tabBox">
                <div class="tab-top">
                    <text class="list" :class="[num == index ? 'on' : '']" @click="tabData(index)" v-for="(item, index) in data" :key="index">{{item}}</text>
                </div>
                <div v-if="noDataFlag">
                    <text class="noData_word">暂无数据</text>
                </div>
                    <div class="echarts" v-else>
                    <bmchart :options="$format(polar)" ref='chartVm' @finish='finish' style="width:750px; height:650px;" @click="onChartClick"></bmchart>
                    </div>
            </div>
        </div>
        <wxc-popup popup-color="rgb(255, 255, 255)"
            :show="isBottomShow"
            @wxcPopupOverlayClicked="popupOverlayBottomClick"
            pos="bottom"
            :height="popupHeight">
            <div class="demo-content">
                <div class="demo-head">
                    <div style="" class="head"></div>
                    <div style="display: -webkit-flex;" class="head-title"><text class="title">记录体重</text></div>
                    <div style="display: -webkit-flex;" class="head" @click="cancelPopup"><text class="cancel">取消</text></div>
                </div>
                <div class="demo-main">
                    <div class="recordBox" style="width: 674px;">
                        <div class="record-data" @click='showCalendarModel'>
                            <text class="data">记录时间：</text>
                            <text class="inputdate">{{startTime}}</text>
                            <!-- <wxc-searchbar ref="wxc-searchbar"
                                @wxcSearchbarInputOnInput="wxcSearchbarInputOnInput"></wxc-searchbar> -->
                        </div>
                        <div class="record-data">
                            <text class="data">身高：</text>
                            <input ref="height" @input="inputHeight" class="input" type="number">
                            <text class="company">cm</text>
                        </div>
                        <div class="record-data">
                            <text class="data">体重：</text>
                            <input ref="weight" @input="inputWeight" class="input" type="number">
                            <text class="company">kg</text>
                        </div>
                        <div class="record-data">
                            <text class="data">BMI：</text>
                            <input ref="bmi" v-model="recordBmi" class="input" type="text" disabled='true'>
                            <text class="company">kg/m²</text>
                        </div>
                        <div class="record-data">
                            <text class="data">腰围：</text>
                            <input ref="waist" @input="inputWaist" class="input" type="number">
                            <text class="company">cm</text>
                        </div>
                        <div class="sure" style="width: 674px;">
                            <text style="width: 674px;" class="sure-btn" @click="sureRecord">确定</text>
                        </div>
                    </div>
                </div>
            </div>
        </wxc-popup>
    </div>
</template>
<script>
import api from "../../../shared/request";
//import bmchart from "../../../components/bmchart.vue";
import { WxcPopup, WxcSearchbar, WxcMinibar, Utils } from "weex-ui";
import {
  createLink,
  calcAge,
  printLog,
  storage_getItem
} from "../../../shared/utils";
const dateTimePicker = weex.requireModule("dateTimePicker");
const modal = weex.requireModule("modal");
const QNDevice = weex.requireModule("qndevice");
const storage = weex.requireModule("storage");
const globalEvent = weex.requireModule("globalEvent");
import vueplugin from "../../../shared/vueplugin";
Vue.use(vueplugin);
export default {
  components: {
    WxcPopup,
    WxcSearchbar,
    WxcMinibar
    //bmchart
  },
  data() {
    return {
      today_recorded: true,
      value: "",
      isBottomShow: false,
      selectedDate: [],
      num: 0,
      data: ["体重", "体脂率", "BMI"],
      totalData: [],
      polar: {
        backgroundColor: "#ffffff",
        animation: false,
        tooltip: {
          trigger: "none"
        },
        dataZoom: [
          // 缩放
          {
            type: "inside",
            startValue: 3,
            endValue: 6,
            minValueSpan: 3,
            maxValueSpan: 3,
            zoomLock: true
          }
        ],
        xAxis: {
          type: "category",
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          boundaryGap: false,
          data: ["", ""]
        },
        yAxis: {
          show: true,
          type: "value",
          // axisLabel: {
          //     showMinLabel: false //是否显示最小刻度
          // },
          axisLine: {
            //是否显示坐标轴线
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: "",
            type: "line",
            data: [0, 0],
            lineStyle: {
              color: "#cccccc",
              width: 0.5
            },
            itemStyle: {
              color: "#cccccc"
            }
          }
        ]
      },
      weight: "--", // 体重
      bodyfat: "--", // 体脂率
      bmI: "--", // bmi
      bmIwarning: false,
      popupHeight: 0,
      baseURL: "",
      mbrId: "",
      startTime: "", // 手动记录时间
      recordHeight: 0, // 手动记录身高
      recordWeight: 0, // 手动记录体重
      recordBmi: "", // 手动记录bmi
      recordWaist: 0, // 腰围
      waiting: false,
      type: null,
      noDataFlag: false, // 暂无数据
      isTabClicked: false
    };
  },
  created() {
    this.startTime = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    // yyyy-MM-dd
    let today = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);
    if (WXEnvironment.platform == "Web") {
      this.selectedDate = ["2018-10-16"]; // // ["2018-5-15"];
    } else {
      this.selectedDate = [today];
      //this.selectedDate = ["2018-04-02"];
    }
    this.getChartData(this.mbrId, this.num);
    printLog(this.selectedDate);
    if (WXEnvironment.platform == "Web") {
      this.popupHeight = Utils.env.getPageHeight();
    } else {
      this.popupHeight = Utils.env.getPageHeight() + 88;
    }
    printLog(this.popupHeight);

    const refresh = new BroadcastChannel("refresh-weight-data");
    refresh.onmessage = event => {
      printLog(event.data); // Assemble!
      this.selectedDate = [];
      this.selectedDate.push(this.startTime);
      this.isTabClicked = false;
      this.getChartData(this.mbrId, this.num);
    };
    if (WXEnvironment.platform == "iOS") {
      globalEvent.addEventListener("refresh-weight-data", res => {
        this.selectedDate = [];
        this.selectedDate.push(this.startTime);
        this.isTabClicked = false;
        this.getChartData(this.mbrId, this.num);
      });
    }
  },
  // watch: {
  //   selectedDate(value) {
  //     this.getChartData(this.mbrId, this.num);
  //   }
  // },
  methods: {
    inputHeight(e) {
      this.recordHeight = e.value;
      if (this.recordHeight > 0 && this.recordWeight > 0) {
        this.calcBmi();
      } else {
        this.recordBmi = "";
      }
    },
    inputWeight(e) {
      this.recordWeight = e.value;
      if (this.recordHeight > 0 && this.recordWeight > 0) {
        this.calcBmi();
      } else {
        this.recordBmi = "";
      }
    },
    inputWaist(e) {
      this.recordWaist = e.value;
    },
    calcBmi() {
      this.recordBmi = (
        (this.recordWeight / (this.recordHeight * this.recordHeight)) *
        10000
      ).toFixed(2);
    },
    sureRecord() {
      if (
        this.recordHeight == 0 &&
        this.recordWaist == 0 &&
        this.recordWeight == 0
      ) {
        modal.toast({ message: "至少填写一项", duration: 1 });
      } else if (
        this.recordHeight < 0 ||
        this.recordHeight > 300 ||
        (this.recordHeight == 0 && this.recordWeight != 0) /*身高体重两个都要*/
      ) {
        modal.toast({ message: "身高范围0~300cm", duration: 1 });
      } else if (
        this.recordWeight < 0 ||
        this.recordWeight > 1000 ||
        (this.recordHeight != 0 && this.recordWeight == 0) /*身高体重两个都要*/
      ) {
        modal.toast({ message: "体重范围0~1000kg", duration: 1 });
      } else if (
        this.recordWaist > 0 &&
        (this.recordWaist < 30 || this.recordWaist > 220)
      ) {
        modal.toast({ message: "腰围范围30~220cm", duration: 1 });
      } else {
        if (this.waiting) {
          modal.toast({ message: "正在上传请稍候", duration: 1 });
          return;
        }
        this.waiting = true;
        let params = {
          height: this.recordHeight,
          weight: this.recordWeight,
          waistline: this.recordWaist,
          mbrId: this.mbrId,
          checkTime: this.startTime
        };
        api.get(
          `${this.baseURL}appehrservice/addweight.json?`,
          params,
          data => {
            console.log(data);
            if (data.ERROR_TYPE == null) {
              modal.toast({ message: "手动记录成功", duration: 1 });
              setTimeout(() => {
                this.cancelPopup();
                this.waiting = false;
              }, 2000);
              this.startTime = new Date(
                new Date().getTime() - new Date().getTimezoneOffset() * 60000
              )
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              this.selectedDate = [];
              this.selectedDate.push(this.startTime.split(" ")[0]);
              this.isTabClicked = false;
              this.getChartData(this.mbrId, this.num);
              storage.setItem("weight", this.recordWeight);
              const refresh = new BroadcastChannel("refresh-home-evaluation");
              refresh.postMessage("refresh!");
            }
          }
        );
      }
    },
    tabData(index) {
      this.num = index;
      this.isTabClicked = true;
      this.getChartData(this.mbrId, this.num);
    },
    resetCounter() {
      this.weight = "--";
      this.bodyfat = "--";
      this.bmI = "--";
    },
    getChartData: async function(mbrId, index) {
      printLog("getChartData");
      try {
        this.type = await storage_getItem("type");
      } catch (e) {
        this.type = 0;
      }
      printLog(this.type);
      if (!this.mbrId || !this.baseURL) {
        this.mbrId = await storage_getItem("mbrId");
        this.baseURL = await storage_getItem("oldApiBase");
      }
      printLog(this.mbrId);
      printLog(this.baseURL);
      let params = {
        date: this.selectedDate,
        type: 1,
        direction: 1,
        mbrId: this.mbrId
      };
      api.get(
        `${this.baseURL}appehrservice/getweightlistall.json?`,
        params,
        data => {
          printLog("getweightlistall");
          //printLog(data);
          this.today_recorded = false;
          this.bmIwarning = false;
          if (this.type == 2 && !data.weightEntityList) {
            this.noDataFlag = true;
            printLog("nodata true");
            this.polar.xAxis.data = ["", ""];
            this.polar.tooltip.trigger = "none";
          } else if (this.type == 1 && !data.weightEntityList) {
            printLog("nodata true");
            this.polar.xAxis.data = ["", ""];
            this.polar.tooltip.trigger = "none";
          } else if (!data.weightEntityList) {
            this.noDataFlag = true;
            printLog("nodata true");
            this.polar.xAxis.data = ["", ""];
            this.polar.tooltip.trigger = "none";
          } else {
            this.noDataFlag = false;
            printLog("nodata false");
            this.xAxisData = [];
            this.seriesData = [];
            this.polar.tooltip.trigger = "axis";
            // this.polar.tooltip.formatter = function(params) {
            //     console.log(params)
            // }
            this.totalData = [];
            data.weightEntityList.map(item => {
              let obj = {
                checkTime: item.checkTime,
                data: []
              };
              obj.data.push(item.weight.toFixed(1));
              obj.data.push(item.bodyfat.toFixed(1));
              obj.data.push(item.bmi.toFixed(1));
              this.totalData.push(obj);

              if (index == "0" && item.weight.toFixed(1) > 0) {
                let newData = [];
                newData.push(item.checkTime);
                this.xAxisData.push(item.checkTime);
                newData.push(item.weight.toFixed(1));
                //console.log(item.weight.toFixed(1));
                printLog(newData);
                this.seriesData.push(newData);
              } else if (index == "1" && item.bodyfat.toFixed(1) > 0) {
                let newData = [];
                newData.push(item.checkTime);
                this.xAxisData.push(item.checkTime);
                newData.push(item.bodyfat.toFixed(1));
                //console.log(item.bodyfat.toFixed(1));
                printLog(newData);
                this.seriesData.push(newData);
              } else if (index == "2" && item.bmi.toFixed(1) > 0) {
                let newData = [];
                newData.push(item.checkTime);
                this.xAxisData.push(item.checkTime);
                newData.push(item.bmi.toFixed(1));
                printLog(newData);
                //console.log(item.bmi.toFixed(1));
                this.seriesData.push(newData);
              }
              if (this.isTabClicked) {
                if (
                  this.weight != "--" ||
                  this.bodyfat != "--" ||
                  this.bmI != "--"
                ) {
                  this.today_recorded = true;
                  if (this.bmI > 24 || this.bmI < 18.5) {
                    this.bmIwarning = true;
                  } else {
                    this.bmIwarning = false;
                  }
                }
              } else if (
                item.checkTime.split(" ")[0] == this.startTime.split(" ")[0] &&
                (item.weight > 0 || item.bodyfat > 0 || item.bmi > 0)
              ) {
                //今天且至少三个有一个
                this.weight = "--";
                this.bodyfat = "--";
                this.bmI = "--";
                if (item.weight > 0) {
                  this.weight = item.weight.toFixed(1);
                }
                if (item.bodyfat > 0) {
                  this.bodyfat = item.bodyfat.toFixed(1);
                }
                if (item.bmi > 0) {
                  this.bmI = item.bmi.toFixed(1);
                  if (this.bmI > 24 || this.bmI < 18.5) {
                    this.bmIwarning = true;
                  } else {
                    this.bmIwarning = false;
                  }
                }
                this.today_recorded = true;
              }
            });
            if (this.seriesData.length == 0) {
              this.noDataFlag = true;
              printLog("nodata true");
              this.polar.xAxis.data = ["", ""];
              this.polar.tooltip.trigger = "none";
            } else {
              this.polar.xAxis.data = this.xAxisData;
              this.polar.series = [
                {
                  type: "line",
                  symbol: "circle",
                  symbolSize: 18,
                  data: this.seriesData,
                  lineStyle: {
                    color: "#02b4ed",
                    width: 0.5
                  },
                  itemStyle: {
                    color: "#02b4ed"
                  }
                }
              ];
            }
            let end = this.seriesData.length - 1;
            let start;
            let span;
            end >= 6 ? (start = end - 6) : (start = 0);
            end >= 6 ? (span = 7) : (span = this.seriesData.length);
            this.polar.dataZoom = [
              {
                type: "inside",
                startValue: start,
                endValue: end,
                minValueSpan: 7,
                maxValueSpan: 7,
                zoomLock: true
              }
            ];
            printLog(this.seriesData);
            if (WXEnvironment.platform == "Web") {
              this.$refs.chartVm.setOption(this.$format(this.polar), true);
            }
            if (WXEnvironment.platform == "Web") {
              //web环境当图表被点击
              this.$refs.chartVm.myChart.on("click", params => {
                this.today_recorded = true;
                //console.log(params.data)
                this.totalData.map(item => {
                  if (params.data[0] == item.checkTime) {
                    this.weight = item.data[0] > 0 ? item.data[0] : "--";
                    this.bodyfat = item.data[1] > 0 ? item.data[1] : "--";
                    this.bmI = item.data[2] > 0 ? item.data[2] : "--";

                    if (this.bmI > 24 || this.bmI < 18.5) {
                      this.bmIwarning = true;
                    } else {
                      this.bmIwarning = false;
                    }
                  }
                });
                let datetime = params.data[0];
                let date = params.data[0].split(" ")[0];
                this.selectedDate = [];
                this.selectedDate.push(date);
              });
            }
          }
        }
      );
    },
    showCalendarModel() {
      printLog(this.startTime.slice(0, 16));
      dateTimePicker.open(
        {
          value: this.startTime.slice(0, 16)
        },
        res => {
          if (res.result === "success") {
            let iso = res.data.replace(" ", "T") + ":00Z";
            this.resetCounter();
            let now = new Date(
              new Date().getTime() - new Date().getTimezoneOffset() * 60000
            );
            let select = new Date(iso);
            if (select > now) {
              this.startTime = new Date(
                new Date().getTime() - new Date().getTimezoneOffset() * 60000
              )
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
            } else {
              this.startTime = `${res.data}:00`;
            }
          }
        }
      );
    },
    wxcSearchbarInputOnInput(e) {
      this.value = e.value;
    },
    cancelPopup() {
      this.$refs["height"].blur();
      this.$refs["weight"].blur();
      this.$refs["bmi"].blur();
      this.$refs["waist"].blur();
      this.isBottomShow = false;
    },
    //非状态组件，需要在这里关闭
    popupOverlayBottomClick() {
      this.isBottomShow = false;
    },
    minibarLeftButtonClick() {
      // let navigator = weex.requireModule("navigator");
      // navigator.pop({
      //   animated: "true"
      // });
    },
    minibarRightButtonClick() {
      this.startTime = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      this.isBottomShow = true;
      this.recordHeight = 0; // 手动记录身高
      this.recordWeight = 0; // 手动记录体重
      this.recordBmi = ""; // 手动记录bmi
      this.recordWaist = 0; // 腰围
    },
    openBodyFat() {
      if (WXEnvironment.platform === "android") {
        const navigator = weex.requireModule("navigator");
        QNDevice.isSaved(
          success => {
            storage.setItem("autogoback", true);
            navigator.push({
              url: createLink("bodyfat"),
              animated: "true"
            });
          },
          error => {
            navigator.push({
              url: createLink("bodyfatneedbinding"),
              animated: "true"
            });
          }
        );
      }
      if (WXEnvironment.platform === "iOS") {
        const messaging = weex.requireModule("MessagingModule");
        messaging.openBodyFat();
      }
    },
    onChartClick(res) {
      //只在原生环境被调用
      printLog(res.data);
      let resarray = JSON.parse(res.data);
      let timeclicked = resarray[0];
      this.today_recorded = true;
      this.weight = "--";
      this.bodyfat = "--";
      this.bmI = "--";
      this.totalData.map(item => {
        if (timeclicked == item.checkTime) {
          this.weight = item.data[0] > 0 ? item.data[0] : "--";
          this.bodyfat = item.data[1] > 0 ? item.data[1] : "--";
          this.bmI = item.data[2] > 0 ? item.data[2] : "--";

          if (this.bmI > 24 || this.bmI < 18.5) {
            this.bmIwarning = true;
          } else {
            this.bmIwarning = false;
          }
        }
      });
      let datetime = timeclicked;
      let date = timeclicked.split(" ")[0];
      this.selectedDate = [];
      this.selectedDate.push(date);
    }
  }
};
</script>
<style>
.wxc-minibar {
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
}
</style>

<style scoped lang="scss">
.noData_word {
  margin-top: 180px;
  margin-bottom: 180px;
  text-align: center;
  font-size: 30px;
  color: rgb(153, 153, 153);
}
.icon_back {
  width: 40px;
  height: 40px;
}
.header {
  height: 100px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
  flex-direction: row;
}
.text {
  flex: 1;
  height: 100px;
  color: rgb(51, 51, 51);
  justify-content: center;
  align-items: center;
}
.text-one {
  justify-content: center;
  align-items: center;
}
.returnImg {
  width: 50px;
  height: 50px;
}
.text-password {
  flex: 5;
  font-size: 40px;
}
.text-record {
  flex: 1.5;
}
.main {
  flex: 1;
}
.main-date {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.date {
  font-size: 26px;
  color: rgb(102, 102, 102);
  /* border-width: 1px;
        border-color: #02b3ed;
        border-style: solid;
        padding: 5px 20px;
        border-radius: 25px; */
}
.each-item {
  margin-top: 70px;
  flex-direction: row;
}
.weight,
.fat-rate,
.bmI {
  flex: 1;
  flex-direction: column;
  align-items: center;
}
.weight,
.fat-rate {
  border-right-color: #e6e6e6;
  border-right-width: 1px;
}
.goRecord {
  flex-direction: column;
  align-items: center;
}
.record_wrod {
  font-size: 30px;
  color: #999999;
  margin-top: 130px;
}
.dataRange {
  margin-top: 30px;
  margin-bottom: 50px;
  flex-direction: row;
  justify-content: flex-end;
}
.range {
  font-size: 22px;
  margin-right: 30px;
  color: rgb(55, 199, 52);
}
.word {
  font-size: 36px;
  color: rgb(102, 102, 102);
}
.sumData {
  font-size: 60px;
  color: rgb(2, 179, 237);
  margin-top: 50px;
}
.bmIon {
  color: rgb(234, 118, 24);
}
.fat-scale {
  flex-direction: row;
  justify-content: center;
}
.scale-btn {
  width: 294px;
  height: 75px;
  background-color: rgb(2, 179, 237);
  margin-bottom: 20px;
  border-radius: 5px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.scales {
  width: 44px;
  height: 41px;
  margin-right: 10px;
}
.tip {
  color: rgb(255, 255, 255);
  font-size: 30px;
}
.background {
  background-color: #eeeeee;
  height: 20px;
}
.tabBox {
  margin-top: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tab-top {
  width: 480px;
  height: 60px;
  flex-direction: row;
  border-width: 1px;
  border-color: rgb(2, 179, 237);
  border-radius: 5px;
}
.list {
  flex: 1;
  font-size: 30px;
  color: rgb(2, 179, 237);
  text-align: center;
  line-height: 60px;
}
.on {
  background-color: rgb(2, 179, 237);
  border-radius: 5px;
  color: rgb(255, 255, 255);
}
.echarts {
  background-color: #fff;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
/*记录体重  */
.demo-head {
  width: 750px;
  height: 100px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.head {
  flex: 1;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.cancel {
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.head-title {
  flex: 4;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 38px;
  color: rgb(51, 51, 51);
}
.demo-main {
  flex: 1;
}
.recordBox {
  margin-top: 80px;
  margin-left: 38px;
}
.record-data {
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
}
.data {
  width: 170px;
  text-align: center;
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.inputdate {
  width: 390px;
  height: 70px;
  line-height: 70px;
  font-size: 30px;
  color: rgb(51, 51, 51);
  border-width: 1px;
  border-color: #cccccc;
  border-radius: 10px;
  outline: none;
  padding-left: 20px;
}
.input {
  width: 390px;
  height: 70px;
  font-size: 30px;
  color: rgb(51, 51, 51);
  border-width: 1px;
  border-color: #cccccc;
  border-radius: 10px;
  outline: none;
  padding-left: 20px;
}
.company {
  width: 110px;
  text-align: center;
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.sure {
  margin-top: 50px;
}
.sure-btn {
  height: 80px;
  color: rgb(255, 255, 255);
  font-size: 34px;
  background-color: rgb(2, 179, 237);
  text-align: center;
  line-height: 80px;
  border-radius: 10px;
  cursor: pointer;
}
</style>

