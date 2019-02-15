<template>
    <div class="box">
        <wxc-minibar title="运动详情"
            background-color="#ffffff"
            text-color="#000000"
            right-text="运动处方"
            :use-default-return="false"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;"
            > 
        </wxc-minibar>
        <scroller class="main" :style="scrollStyle">
            <div class="main-head" >
                <div class="main-date" :style="selectedDateStyle">
                    <text class="date" @click='showCalendarModel'>{{selectedDate[0]}}</text>
                </div>
                <div class="fraction">
                    <bmchart :options="$format(exercise)" style="width:360px; height:360px;position: relative;" ref='chartEx'></bmchart>
                    <div class="fraction-top">
                      <div class="fraction-score">
                        <text class="sum">{{sportScore}}</text>
                        <text class="branch">分</text>
                      </div>
                    </div>
                    <text class="fraction-foo">{{sportRisk}}</text>
                </div>
                <div class="main-btn">

                      <div v-if="isUploading" class="uploading-btn">
                        <wxc-part-loading :show="true"></wxc-part-loading>
                        <text class="recordWord">正在上传({{percentage}}%)</text>
                      </div>
                      <div v-else class="canupload-btn" @click="startUpload()">
                        <image class="Upload" :src="getImgPath('upload.png')"/>
                        <text class="upWord">上传运动数据</text>
                      </div>

                    <!-- <div class="loading">
                        <wxc-loading :show="isShow" type="trip"></wxc-loading>  
                    </div> -->
                </div>
                <div class="wrist_watch" style="position: absolute;left: 100px;bottom: 100px;">
                  <image v-if="powerLevel >= 0 && powerLevel <= 20" class="watchImg" :src="getImgPath('wrist_watch1.png')"/>
                  <image v-if="powerLevel > 20 && powerLevel <= 50" class="watchImg" :src="getImgPath('wrist_watch2.png')"/>
                  <image v-if="powerLevel > 50 && powerLevel <= 80" class="watchImg" :src="getImgPath('wrist_watch3.png')"/>
                  <image v-if="powerLevel > 80 && powerLevel <= 100" class="watchImg" :src="getImgPath('wrist_watch4.png')"/>
                  <text v-if="powerLevel >= 0" class="powerLevel" :class="[powerLevel <= 20 ? 'Alert' : '']">{{powerLevel}}%</text>
                </div>
            </div>
            <div class="main-box">
                <div class="cent">
                    <div class="tootip-top">
                        <text class="num">{{validTime}}</text>
                        <text class="word">分钟</text>
                    </div>
                    <text class="tootip-bottom">有效运动时长</text>
                </div>
                <div class="cent">
                    <div class="tootip-top">
                        <text class="num">{{validAvgHeart}}</text>
                        <text class="word">次/分钟</text>
                    </div>
                    <text class="tootip-bottom">有效运动平均心率</text>
                </div>
                <div class="cent">
                    <div class="tootip-top">
                        <text class="num">{{hheartExcTime}}</text>
                        <text class="word">分钟</text>
                    </div>
                    <text class="tootip-bottom">过强运动时长</text>
                </div>
                <div class="cent">
                    <div class="tootip-top">
                        <text class="num">{{hAvgHeart}}</text>
                        <text class="word">次/分钟</text>
                    </div>
                    <text class="tootip-bottom">过强运动平均心率</text>
                </div>
                <div class="cent">
                    <div class="tootip-top">
                        <text class="num">{{calorie}}</text>
                        <text class="word">千卡</text>
                    </div>
                    <text class="tootip-bottom">运动能量消耗</text>
                </div>
                <div class="cent">
                    <div class="tootip-top">
                        <text class="num">{{stepCount}}</text>
                        <text class="word">步</text>
                    </div>
                    <text class="tootip-bottom">步数</text>
                </div>
            </div>
            <div class="echarts">
                <bmchart :options="$format(polar)" ref='chartVm' @finish='finish' style="width:750px; height:450px;"></bmchart>
                <div class="echarte-title">
                    <text class="title-left">今日运动心率趋势图</text>
                </div>
                <div v-if="nodata" class="echarts-nodata" style="width:750px; height: 450px;">
                  <text class="nodata-text">暂无数据</text>
                </div>
            </div>
            <div class="ideal">
                <text class="ideal-title">理想模式</text>
                <image class="ideal_motion_mode" :src="getImgPath('ideal_motion_mode.png')"/>
            </div>
        </scroller>
          <div class="prompt-box">
            <div class="bleopened" v-if="bleopened == false">
                <text class="open-left">手机蓝牙未开启</text>
                <text class="open-right" @click="connect">立即开启</text>
            </div>
            <div class="prescription-status" v-if="isExpired">
                <image class="hint_info" :src="getImgPath('icon_hint_white.png')"/>
                <text class="tooltip">您的运动处方已过期，请联系医生为您处理!</text>
            </div>
            <div class="prescription-status" v-if="isInvalid">
                <image class="hint_info" :src="getImgPath('icon_hint_white.png')"/>
                <text class="tooltip">您的运动处方未激活，请联系体检医生为您处理!</text>
            </div>
          </div>
        <wxc-loading :show="isLoading"
              :loading-text="loadingText"
              ></wxc-loading>
        <wxc-dialog
            :content="dialogcontent"
            :show="showDialog"
            :single="true"
            :show-no-prompt="false"
            confirm-text="我知道了"
            :main-btn-color="mainbtncolor"
            @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
        </wxc-dialog>
    </div>
</template>
<script>
import {
  WxcDialog,
  WxcLoading,
  WxcMinibar,
  WxcPartLoading,
  Utils
} from "weex-ui";
//import bmchart from "../../components/bmchart.vue";
import api from "../../shared/request";
import {
  createLink,
  calcAge,
  printLog,
  storage_getItem
} from "../../shared/utils";
const DatePicker = weex.requireModule("datepicker");
const modal = weex.requireModule("modal");
const BandDevice = weex.requireModule("banddevice");
const globalEvent = weex.requireModule("globalEvent");
const messaging = weex.requireModule("MessagingModule");

import vueplugin from "../../shared/vueplugin";
Vue.use(vueplugin);
export default {
  components: {
    WxcDialog,
    WxcLoading,
    WxcMinibar,
    WxcPartLoading,
    //bmchart
  },
  data() {
    return {
      isExpired: false, // 提示运动处方过期
      isInvalid: false, // 提示运动处方无效
      powerLevel: -1,
      powerAlert: false,
      timeOut: null,
      timer: null,
      percentage: 0, //上传数据百分比
      isUploading: false, //显示灰色按钮
      baseURL: "",
      showDialog: false,
      isLoading: true, // 加载
      nodata: false, // 无数据
      sportScore: 0, //运动得分
      sportRisk: "", //运动风险
      validTime: "--", // 有效运动时长
      validAvgHeart: "--", // 有效运动平均心率
      calorie: "--", //运动能量消耗
      stepCount: "--", //步数
      hheartExcTime: "--", //过强运动时长
      hAvgHeart: "--", //过强运动平均心率
      loadingText: "加载中...",
      selectedDateStyle: {},
      selectedDate: [],
      mbrId: "",
      bleopened: true,
      dialogcontent: "",
      mainbtncolor: "#02b3ed",
      polar: {
        backgroundColor: "#ffffff",
        animation: false,
        tooltip: {
          trigger: "none"
        },
        grid: {
          left: "3%",
          //right: "4%",
          bottom: "3%",
          containLabel: true
        },
        dataZoom: [
          // 缩放
          {
            type: "inside",
            throttle: 50
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
          type: "value",
          axisLabel: {
            showMinLabel: false //是否显示最小刻度
          },
          splitLine: {
            //是否显示刻度线
            show: false
          },
          axisTick: {
            show: false
          },
          max: 220,
          // minInterval: 60,
          interval: 60
        },
        series: [
          {
            name: "心率值",
            type: "line",
            symbol: "none",
            data: [0, 0],
            lineStyle: {
              color: "#cccccc",
              width: 0.5
            },
            itemStyle: {
              color: "#cccccc"
            }
          },
          {
            type: "line",
            markLine: {
              silent: true,
              symbol: "none",
              lineStyle: {
                normal: {
                  type: "solid",
                  color: "#00ff48"
                }
              },
              data: [
                {
                  name: "运动心率上限",
                  yAxis: 150
                },
                {
                  name: "运动心率下限",
                  yAxis: 130
                }
              ]
            }
          },
          {
            type: "line",
            markLine: {
              silent: true,
              symbol: "none",
              lineStyle: {
                type: "solid",
                color: "#f00"
              },
              data: [
                {
                  name: "警戒心率",
                  yAxis: 180
                }
              ]
            }
          }
        ]
      },
      exercise: {
        backgroundColor: "#ffffff",
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
          {
            name: "业务指标",
            type: "gauge",
            detail: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: [[1, "#ccc"]],
                width: 5
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ]
      }
    };
  },
  created() {
    if (this.powerLevel <= 20) {
      this.powerAlert = false;
    } else {
      this.powerAlert = true;
    }
    printLog(Utils.env.getPageHeight());
    this.selectedDateStyle['margin-top'] = "45px"
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 50 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
    }
    // yyyy-MM-dd
    let today = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);
    printLog(today);
    if (WXEnvironment.platform == "Web") {
      this.selectedDate = ["2018-10-20"]; // // ["2018-5-15"];
    } else {
      this.selectedDate = [today];
    }
    printLog(this.selectedDate);

    globalEvent.addEventListener("bleopened", res => {
      printLog(res);
      printLog("bleopened");
      this.bleopened = true;
    });
    globalEvent.addEventListener("show_dialog", res => {
      printLog(res);
      printLog("show_dialog");
      this.dialogcontent = res.msg;
      this.showDialog = true;
    });
    globalEvent.addEventListener("show_toast", res => {
      printLog(res);
      printLog("show_toast");
      const modal = weex.requireModule("modal");
      modal.toast({ message: res.toast, duration: 1 });
    });
    globalEvent.addEventListener("show_progress", res => {
      printLog(res);
      printLog("show_progress");
      if (res.progress == 1 && this.isUploading == false) {
        //设进度为1，开始计数
        this.isUploading = true; //按钮置灰
        messaging.toggleBackButton();
        this.timer = setInterval(() => {
          this.bumpProgress();
        }, 1000);
      } else if (res.progress <= 0 && this.isUploading == true) {
        //设进度为-1，停止计数
        this.isUploading = false;
        messaging.toggleBackButton();
        this.percentage = 0;
        clearInterval(this.timer);
      }
    });
    globalEvent.addEventListener("show_power", res => {
      printLog(res);
      printLog("show_power");
      this.powerLevel = res.power;
    });
    globalEvent.addEventListener("uploadfinished", res => {
      printLog(res);
      printLog("uploadfinished");
      this.isUploading = false;
      messaging.toggleBackButton();
      this.percentage = 0;
      clearInterval(this.timer);
    });
    globalEvent.addEventListener("refresh_sportscore", res => {
      printLog(res);
      printLog("refresh_sportscore");
      this.getChartData();

      const refresh = new BroadcastChannel("refresh-home-evaluation");
      refresh.postMessage("refresh!");
    });

    if (WXEnvironment.platform != "Web") {
      BandDevice.checkBluetooth(
        success => {
          if (success != null && success.errorCode == 0) {
            printLog(success);
            this.bleopened = true;
          }
        },
        error => {
          if (error != null) {
            printLog(error);
          }
        }
      );
    }
  },
  watch: {
    selectedDate(value) {
      setTimeout(() => {
        if (this.isLoading == true) this.isLoading = false;
      }, 1000);
      this.isLoading = true;
      this.getChartData();
    }
  },
  beforeDestroy() {
    if (this.timeOut) {
      clearInterval(this.timeOut);
    }
  },
  methods: {
    startUpload() {
      // this.isUploading = !this.isUploading;
      // this.timer = setInterval(() => {
      //         this.bumpProgress();
      //         }, 1000);
      // 上传运动数据

        printLog("ccess320")
        BandDevice.uploadSportData(
          success => {
            printLog("ccess321")
            if (success != null && success.errorCode == 0) {
              printLog(success);
              this.isUploading = true; //按钮置灰
              messaging.toggleBackButton();
              this.timer = setInterval(() => {
                this.bumpProgress();
              }, 1000);
            }
          },
          error => {
            printLog("ccess322")
            if (error != null) {
              if (error.errorCode != 1) {
                modal.toast({ message: error.errorMsg, duration: 1 });
              }
            }
          }
        );
    },
    bumpProgress() {
      if (this.isUploading == true && this.percentage > 94) {
        return;
      } else {
        this.percentage += 1;
      }
    },
    wxcDialogConfirmBtnClicked() {
      this.showDialog = !this.showDialog;
    },
    connect() {
      BandDevice.connectDevice(
        "",
        success => {
          if (success != null) {
            printLog(success);
          }
        },
        error => {
          if (error != null) {
            printLog(error);
          }
        }
      );
    },
    showCalendarModel() {
      if (this.isUploading) 
        return
        
      DatePicker.pickDate(this.selectedDate[0], res => {
        if (res != null) {
          this.resetCounter();
          this.selectedDate = [res];
        }
      });
    },
    resetCounter() {
      this.validTime = "--"; // 有效运动时长
      this.validAvgHeart = "--"; // 有效运动平均心率
      this.stepCount = "--"; //步数
      this.calorie = "--"; //运动能量消耗
      this.hheartExcTime = "--"; //过强运动时长
      this.hAvgHeart = "--"; //过强运动平均心率
      this.sportScore = 0; //运动得分
      this.sportRisk = ""; //运动风险
    },
    getChartData: async function() {
      printLog("getChartData");
      if (!this.mbrId || !this.baseURL || !this.age) {
        printLog("storage_getItem");
        printLog(this.mbrId);
        this.mbrId = await storage_getItem("mbrId");
        //this.mbrId = "13800002222-mbr"
        //this.mbrId = "13900000097-mbr"
        this.baseURL = await storage_getItem("oldApiBase");
        let birth = await storage_getItem("birth");
        let birthday = new Date(birth.replace(/-/g, "/"));
        this.age = calcAge(birthday, new Date());
      }
      printLog(this.mbrId);
      printLog(this.baseURL);
      printLog(this.age);
      var params = {
        date: this.selectedDate,
        mbrId: this.mbrId
      };
      api.get(
        `${this.baseURL}appehrservice/getsportheartlist.json?`,
        params,
        data => {
          printLog("getsportheartlist");
          printLog(data);
          if (!data.sportHeartEntityList) {
            printLog("nodata true");
            this.nodata = true;
            this.polar.xAxis.data = ["", ""];
            this.polar.tooltip.trigger = "none";
            this.getMbrNewPrescription();
          } else {
            printLog("nodata false");
            this.nodata = false;
            let xAxisData = [];
            this.polar.tooltip.trigger = "axis";
            let heart_rate = [];
            for (let entity of data.sportHeartEntityList) {
              let startTime = new Date(entity.startTime.replace(/-/g, "/")); //"2018-04-03 11:43:14" to "2018/04/03 11:43:14"
              let heartlist = entity.heartDetail.split(",");
              console.log(heartlist);
              heart_rate = heart_rate.concat(heartlist); //心率值
              console.log(heart_rate);
              //heart_rate = heart_rate.slice(0,100);
              this.heartrate_alert = 220 - this.age; //警戒心率
              this.heartrate_high = entity.hheart; //运动心率上限
              this.heartrate_low = entity.lheart; //运动心率下限

              for (let i = 0; i < heartlist.length; i++) {
                var myDate = new Date(startTime.getTime() + i * 1000);
                let minutes = myDate.getMinutes();
                let seconds = myDate.getSeconds();
                if (minutes < 10) {
                  minutes = "0" + minutes;
                }
                if (seconds < 10) {
                  seconds = "0" + seconds;
                }
                let newTime = `${myDate.getHours()}:${minutes}:${seconds}`;
                xAxisData.push(newTime);
              }
            }
            console.log(xAxisData);
            this.polar.xAxis.data = xAxisData;
            this.polar.series = [
              {
                type: "line",
                markLine: {
                  silent: true,
                  symbol: "none",
                  lineStyle: {
                    normal: {
                      type: "solid",
                      color: "#00ff48"
                    }
                  },
                  data: [
                    {
                      name: "运动心率上限",
                      yAxis: this.heartrate_high
                    },
                    {
                      name: "运动心率下限",
                      yAxis: this.heartrate_low
                    }
                  ]
                }
              },
              {
                type: "line",
                markLine: {
                  silent: true,
                  symbol: "none",
                  lineStyle: {
                    normal: {
                      type: "solid",
                      color: "#f00"
                    }
                  },
                  data: [
                    {
                      name: "警戒心率",
                      yAxis: this.heartrate_alert
                    }
                  ]
                }
              },
              {
                name: "心率值",
                type: "line",
                // sampling: 'average',
                data: heart_rate,
                symbol: "none",
                lineStyle: {
                  color: "#02b3ed",
                  width: 0.5
                },
                itemStyle: {
                  color: "#02b3ed"
                }
              }
            ];
            api.get(
              `${this.baseURL}appemrservice/getmbrnewsportprescription.json?`,
              params,
              data => {
                let entity = data.sportPrescriptionEntity;
                if (entity != null) {
                  //计算有效圆环
                  if (entity.curStage == "01") {
                    //this.planTime = entity.planTime;
                    let ratio = this.validTime / 40;
                    if (ratio == 0) {
                      this.exercise.series[0].axisLine.lineStyle.color = [
                        [1, "#ccc"]
                      ];
                    } else {
                      this.exercise.series[0].axisLine.lineStyle.color = [
                        [ratio, "#02b3ed"],
                        [1, "#ccc"]
                      ];
                    }
                  } else if (entity.curStage == "02") {
                    //this.planTime = entity.planTime;
                    let ratio = this.validTime / 60;
                    if (ratio == 0) {
                      this.exercise.series[0].axisLine.lineStyle.color = [
                        [1, "#ccc"]
                      ];
                    } else {
                      this.exercise.series[0].axisLine.lineStyle.color = [
                        [ratio, "#02b3ed"],
                        [1, "#ccc"]
                      ];
                    }
                  }
                  
                  // 获取当前时间
                  let now =
                    new Date(
                      new Date().getTime() -
                        new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 19) + "Z";
                  if (now > entity.endDate) {
                    this.isExpired = true;
                    this.selectedDateStyle['margin-top'] = "85px"
                  }
                } else {
                  this.isInvalid = true;
                  this.selectedDateStyle['margin-top'] = "85px"
                }
                printLog(this.polar.series);
                printLog(this.polar.xAxis);
                if (WXEnvironment.platform == "Web") {
                  this.$refs.chartVm.setOption(this.$format(this.polar), true);
                  this.$refs.chartEx.setOption(this.$format(this.exercise), true);
                }
              }
            );
          }
        }
      );
      api.get(
        `${this.baseURL}appehrservice/getsportsumdata.json?`,
        params,
        data => {
          console.log(data);
          if (!data.sportSumEntity) {
            this.exercise.series[0].axisLine.lineStyle.color = [[1, "#ccc"]];
          } else {
            let entity = data.sportSumEntity;
            this.validTime = Math.round(entity.validTime);
            this.validAvgHeart = entity.validAvgHeart;
            this.calorie = entity.calorie;
            this.stepCount = entity.stepCount;
            this.sportScore = entity.sportScore;
            this.sportRisk = entity.sportRisk;
            if (entity.hheartExcTime > 0) {
              this.hheartExcTime = entity.hheartExcTime;
            }
            if (entity.hAvgHeart > 0) {
              this.hAvgHeart = entity.hAvgHeart;
            }
          }
          
        }
      );
    },
    getMbrNewPrescription() {
      var params = {
        date: this.selectedDate,
        mbrId: this.mbrId
      };
      api.get(
        `${this.baseURL}appemrservice/getmbrnewsportprescription.json?`,
        params,
        data => {
          let entity = data.sportPrescriptionEntity;
          if (entity != null) {
            // 获取当前时间
            let now =
              new Date(
                new Date().getTime() - new Date().getTimezoneOffset() * 60000
              )
                .toISOString()
                .slice(0, 19) + "Z";
            if (now > entity.endDate) {
              this.isExpired = true;
              this.selectedDateStyle['margin-top'] = "85px"
            }
            this.heartrate_alert = 220 - this.age; //警戒心率
            this.heartrate_high = entity.validSportHeart12; //运动心率上限
            this.heartrate_low = entity.validSportHeart11; //运动心率下限
            this.planTime = entity.validSportTime11;
            if (entity.curStage == "02") {
              this.planTime = entity.validSportTime21;
              this.heartrate_high = entity.validSportHeart22; //运动心率上限
              this.heartrate_low = entity.validSportHeart21; //运动心率下限
            }
            this.polar.series = [
              {
                name: "心率值",
                type: "line",
                symbol: "none",
                data: [0, 0]
              },
              {
                type: "line",
                markLine: {
                  silent: true,
                  symbol: "none",
                  lineStyle: {
                    normal: {
                      type: "solid",
                      color: "#00ff48"
                    }
                  },
                  data: [
                    {
                      name: "运动心率上限",
                      yAxis: this.heartrate_high
                    },
                    {
                      name: "运动心率下限",
                      yAxis: this.heartrate_low
                    }
                  ]
                }
              },
              {
                type: "line",
                markLine: {
                  silent: true,
                  symbol: "none",
                  lineStyle: {
                    normal: {
                      type: "solid",
                      color: "#f00"
                    }
                  },
                  data: [
                    {
                      name: "警戒心率",
                      yAxis: this.heartrate_alert
                    }
                  ]
                }
              }
            ];
            printLog(this.polar.series);
          } else {
            this.isInvalid = true;
            this.selectedDateStyle['margin-top'] = "85px"
          }
        }
      );
    },
    minibarLeftButtonClick() {
      if (this.isUploading) {
        return;
      }
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    minibarRightButtonClick() {
      if (this.isUploading) {
        return;
      }
      if (this.isInvalid) {
        modal.toast({
          message: "您的运动处方未激活，请联系体检医生为您处理",
          duration: 1
        });
        return;
      }
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink("exerciseprescription"),
        animated: "true"
      });
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
<style lang="less" scoped>
.header {
  height: 100px;
  background-color: #02b3ed;
  flex-direction: row;
}
.text {
  flex: 1;
  height: 100px;
  color: rgb(255, 255, 255);
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
.icon_back {
  width: 40px;
  height: 40px;
}
.main {
  flex: 1;
  overflow-y: scroll;
  background-color: #eeeeee;
}
.prescription-status {
  width: 750px;
  height: 80px;
  text-align: center;
  line-height: 60px;
  padding-top: 5px;
  background-color: rgb(2, 179, 237);
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.hint_info {
  width: 40px;
  height: 40px;
}
.tooltip {
  margin-left: 20px;
  font-size: 26px;
  color: rgb(255, 255, 255);
}
.main-head {
  width: 750px;
  flex-direction: column;
  align-items: center;
  background-color: rgb(255, 255, 255);
}
.wrist_watch {
  flex-direction: column;
  align-items: center;
}
.watchImg {
  width: 48px;
  height: 64px;
}
.powerLevel {
  font-size: 24px;
  color: #333333;
  margin-top: 5px;
}
.watchOn {
  color: #ff4d00;
}
.cent {
  width: 375px;
}
.main-date {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 45px;
}
.date {
  font-size: 24px;
  border-width: 1px;
  border-color: #02b3ed;
  border-style: solid;
  padding: 5px 20px;
  border-radius: 25px;
}
.fraction {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.fraction-top {
  position: absolute;
  left: 0;
  top: 0;
  width: 360px;
  height: 360px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.fraction-score {
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}
.sum {
  font-size: 86px;
  color: rgb(2, 179, 237);
  font-family: "DIN";
}
.branch {
  font-size: 30px;
  color: rgb(2, 179, 237);
  padding-bottom: 15px;
}
.fraction-foo {
  text-align: center;
  font-size: 28px;
  color: rgb(102, 102, 102);
  margin-top: -30px;
}
.main-btn {
  width: 750px;
  height: 110px;
  flex-direction: row;
  justify-content: center;
}
.uploading-btn,
.canupload-btn {
  width: 264px;
  height: 61px;
  border-radius: 5px;
  margin-top: 30px;
  margin-bottom: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.canupload-btn {
  background-color: #02b3ed;
}
.uploading-btn {
  background-color: #eeeeee;
}
.recordWord {
  font-size: 28px;
  margin-left: 10px;
  color: rgb(51, 51, 51);
}
.Upload {
  width: 36px;
  height: 30px;
}
.upWord {
  color: rgb(255, 255, 255);
  font-size: 28px;
  margin-left: 10px;
}
.main-box {
  flex-direction: row;
  flex-wrap: wrap;
  background-color: rgb(255, 255, 255);
  margin-bottom: 10px;
}
.cent {
  height: 100px;
  flex-direction: column;
  padding-left: 30px;
  border-top-color: rgb(238, 238, 238);
  border-top-width: 1px;
  border-right-color: rgb(238, 238, 238);
  border-right-width: 1px;
}
.cent:nth-child(even) {
  border-right: none;
}
.tootip-top {
  flex-direction: row;
  align-items: flex-end;
  margin-top: 10px;
  margin-bottom: 10px;
}
.num {
  font-size: 34px;
  color: rgb(51, 51, 51);
}
.word {
  font-size: 24px;
  color: rgb(51, 51, 51);
}
.tootip-bottom {
  font-size: 24px;
  color: rgb(102, 102, 102);
  margin-bottom: 20px;
}
.echarts {
  height: 450px;
  background-color: rgb(255, 255, 255);
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.echarte-title {
  position: absolute;
  left: 0;
  top: 0;
  padding-top: 10px;
  height: 50px;
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.title-left {
  font-size: 32px;
  border-left-width: 5px;
  border-left-color: #39c3f2;
  margin-left: 30px;
  padding-left: 20px;
}
.echarts-nodata {
  position: absolute;
  left: 0;
  top: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.nodata-text {
  font-size: 28px;
  color: #cccccc;
}
.ideal {
  margin-top: 10px;
  background-color: rgb(255, 255, 255);
}
.ideal-title {
  font-size: 32px;
  border-left-width: 5px;
  border-left-color: #39c3f2;
  margin-left: 30px;
  padding-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.ideal_motion_mode {
  margin-left: 30px;
  width: 670px;
  height: 350px;
  margin-bottom: 10px;
}
.prompt-box {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 80px;
}
.bleopened {
  width: 750px;
  height: 80px;
  text-align: center;
  line-height: 60px;
  background-color: rgb(2, 179, 237);
  display: -webkit-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
}
.open-left {
  font-size: 32px;
  color: #fff;
  margin-left: 20px;
}
.open-right {
  width: 160px;
  height: 54px;
  text-align: center;
  line-height: 54px;
  border-width: 2px;
  border-color: rgb(255, 255, 255);
  color: rgb(255, 255, 255);
  font-size: 30px;
  border-radius: 5px;
  margin-right: 30px;
}
</style>

