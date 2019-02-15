<template>
  <div class="box">
    <wxc-minibar title="血糖监测"
        background-color="#ffffff"
        text-color="#000000"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
        @wxcMinibarRightButtonClicked="minibarRightButtonClick"
        >
        <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
          <image class="icon_back" :src="getImgPath('icon_back.png')"/>
        </div>
    </wxc-minibar>
    <div class="main">
      <div style="height: 480px; backgroundColor: rgb(255, 255, 255);">
        <div class="main-date">
          <text class="date" @click='showCalendarModel'>{{selectedDate[0]}}</text>
        </div>
        <div v-if="goRecord.length != 0">
          <div class="blood_pressure">
            <div class="shrink">
              <text class="blood_wrod">空腹</text>
              <div class="numericalValue">
                <text :class="[fbg < 3.4 || fbg > 7.0 ? 'number_bg' : 'number']">{{fbg}}</text>
                <text class="company_word">mmol/L</text>
              </div>
            </div>
            <div class="shrink">
              <text class="blood_wrod">餐后</text>
              <div class="numericalValue">
                <text :class="[pbg < 6.7 || pbg > 11.1 ? 'number_bg' : 'number']">{{pbg}}</text>
                <text class="company_word">mmol/L</text>
              </div>
            </div>
            <div class="shrink">
              <text class="blood_wrod">糖化血红蛋白</text>
              <div class="numericalValue">
                <text :class="[hgb < 4.1 || hgb > 6.5 ? 'number_bg' : 'number']">{{hgb}}</text>
                <text class="company_word">%</text>
              </div>
            </div>
          </div>
          <div class="dataRange">
            <div style="flex: 1; flex-direction: row; justify-content: center; align-items: center;"><text class="range" v-if="fbg < 3.4 || fbg > 7.0">正常范围：3.4~7.0</text></div>
            <div style="flex: 1; flex-direction: row; justify-content: center; align-items: center;"><text class="range" v-if="pbg < 6.7 || pbg > 11.1">正常范围：6.7~11.1</text></div>
            <div style="flex: 1; flex-direction: row; justify-content: center; align-items: center;"><text class="range" v-if="hgb < 4.1 || hgb > 6.5">正常范围：4.1~6.5</text></div>
          </div>
        </div>
        <div v-else class="goRecord">
          <text class="record_wrod">今日未记录</text>
          <div class="record_btn" @click="goRecordData"><text class="btn_word">去记录</text></div>
        </div>
      </div>
      <div class="chart">
        <div class="chart_title"><text class="chart_word">血糖趋势图</text></div>
        <div class="chart_logo">
          <div class="details_box" @click="fbgStatus">
            <image v-if="fbgFlag" class="yellow_selected" :src="getImgPath('yellow_selected.png')"/>
            <image v-else class="yellow_selected" :src="getImgPath('yellow_not_selected.png')"/>
            <text class="selected_w">空腹血糖</text>
          </div>
          <div class="details_box" @click="pbgStatus" style="marginLeft: 66px;">
            <image v-if="pbgFlag" class="yellow_selected" :src="getImgPath('blue_selected.png')"/>
            <image v-else class="yellow_selected" :src="getImgPath('blue_not_selected.png')"/>
            <text class="selected_c">餐后血糖</text>
          </div>
        </div>
        <div class="company_too"><text class="company_word">单位：(mmol/L)</text></div>
        <div class="echarts">
          <bmchart :options="$format(polar)" ref='chartVm' @finish='finish' style="width:750px; height:550px;"></bmchart>
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
            <div style="display: -webkit-flex;" class="head-title"><text class="title">记录血压</text></div>
            <div style="display: -webkit-flex;" class="head" @click="cancelPopup"><text class="cancel">取消</text></div>
          </div>
          <div class="demo-main">
            <div class="recordBox" style="width: 90%;">
                <div class="record-data">
                  <text class="data">记录时间：</text>
                  <input disabled v-model="startTime" class="input" type="text">
                  <text></text>
                </div>
                <div class="record-data">
                  <text class="data">空腹血糖：</text>
                  <input @input="inputFbg" class="input" type="text">
                  <text class="company">mmol/L</text>
                </div>
                <div class="record-data">
                  <text class="data">餐后血糖：</text>
                  <input @input="inputPbg" class="input" type="text">
                  <text class="company">mmol/L</text>
                </div>
                <div class="record-data">
                  <text style="width: 220px;" class="data">糖化血红蛋白：</text>
                  <input style="width: 340px;" @input="inputHgb" class="input" type="text">
                  <text class="company">%</text>
                </div>
                <div class="sure" style="width: 100%;">
                  <text style="width: 100%;" class="sure-btn" @click="sureRecord">确定</text>
                </div>
            </div> 
          </div>
      </div>
    </wxc-popup>
  </div>
</template>
<script>
import { WxcMinibar, WxcPopup, Utils } from 'weex-ui'
import { calcAge, printLog, storage_getItem } from "../../../shared/utils";
import bmchart from "../../../components/bmchart.vue";
import api from "../../../shared/request";
const DatePicker = weex.requireModule("datepicker");
const modal = weex.requireModule("modal");
import vueplugin from "../../../shared/vueplugin";
Vue.use(vueplugin);
export default {
  components: {
    bmchart,
    WxcMinibar,
    WxcPopup
  },
  data () {
    return {
      goRecord: [], // 去记录
      popupHeight: 0,
      isBottomShow: false,
      startTime: '',
      baseURL: '',
      mbrId: "",
      selectedDate: [],
      fbg: '--', // 空腹血糖
      pbg: '--', // 餐后血糖
      hgb: '--', // 糖化血红蛋白
      fbgFlag: true,
      pbgFlag: true,
      recordFbg: 0, // 手动记录空腹血糖
      recordPbg: 0, // 手动记录餐后血糖
      recordHgb: 0, // 手动记录糖化血红蛋白
      polar: {
        backgroundColor: "#ffffff",
        animation: false,
        tooltip: {
          trigger: "none"
        },
        dataZoom: [
          // 缩放
          {
            type: 'inside',
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
          // {
          //   name: "空腹血糖",
          //   type: "line",
          //   data: [0, 0],
          //   lineStyle: {
          //     color: "#cccccc",
          //     width: 0.5
          //   },
          //   itemStyle: {
          //     color: "#cccccc"
          //   }
          // }
        ]
      },
    }
  },
  created () {
    this.dataTime()
    // yyyy-MM-dd
    let today = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    printLog(today);
    if (WXEnvironment.platform == "Web") {
      this.selectedDate = ["2018-09-02"]; // // ["2018-5-15"];
    } else {
      this.selectedDate = [today];
    }
    printLog(this.selectedDate);
    if (WXEnvironment.platform == "Web") {
      this.popupHeight = Utils.env.getPageHeight();
    }else {
      this.popupHeight = Utils.env.getPageHeight()+88;
    }
    printLog(this.popupHeight);
  },
  watch: {
    selectedDate(value) {
      this.getChartData(this.mbrId, this.num);
    }
  },
  methods: {
    fbgStatus() {
      this.fbgFlag = !this.fbgFlag
      this.statusData()
    },
    pbgStatus() {
      this.pbgFlag = !this.pbgFlag
      this.statusData()
    },
    statusData () {
      this.polar.series = []
      if(this.fbgFlag == false && this.pbgFlag == true){
        this.polar.series.push({
          type: "line",
          symbol: "circle",
          symbolSize: 16,
          data: this.pbgData,
          lineStyle: {
            color: "#02b3ed",
            width: 0.5
          },
          itemStyle: {
            color: "#02b3ed"
          }
        })
      } else if ( this.fbgFlag == true && this.pbgFlag == false) {
        this.polar.series.push({
          type: "line",
          symbol: "circle",
          symbolSize: 16,
          data: this.fbgData,
          lineStyle: {
            color: "rgb(237, 113, 2)",
            width: 0.5
          },
          itemStyle: {
            color: "rgb(237, 113, 2)"
          }
        })
      } else if (this.fbgFlag == true && this.pbgFlag == true){
        this.trueStatus()
      } else {
        this.polar.series = []
      }
      if (WXEnvironment.platform == "Web") {
        this.$refs.chartVm.setOption(this.$format(this.polar), true);
      }
    },
    getChartData: async function(mbrId, index) {
      printLog("getChartData");
      if (!this.mbrId || !this.baseURL) {
        this.mbrId = await storage_getItem("mbrId");
        this.baseURL = await storage_getItem("oldApiBase");
      }
      let params = {
        date: this.selectedDate,
        type: 2,
        direction: 1,
        mbrId: this.mbrId
      };
      api.get(`${this.baseURL}appehrservice/gethealth7timelist.json?`, params, data => {
        printLog("gethealth7timelist");
        printLog(data);
        console.log(data)
        if (!data.threeHighSumEntityList) {
          printLog("nodata true");
          this.polar.xAxis.data = ["", ""];
          this.polar.tooltip.trigger = "none";
        } else {
          printLog("nodata false");
          this.xAxisData = [];
          this.fbgData = [];
          this.pbgData = []
          this.polar.tooltip.trigger = "axis";
          data.threeHighSumEntityList.map(item => {
            let newData = [];
            let checkDate = item.checkDate.split("-");
            let check = checkDate[1] + "-" + checkDate[2];
            newData.push(check);
            this.xAxisData.unshift(check);
            this.fbgData.push(item.fbg)
            this.fbgData.reverse()
            this.pbgData.push(item.pbg)
            this.pbgData.reverse()
            if (item.checkDate.split(' ')[0] == this.startTime) {
              this.goRecord.push(item.checkDate)
              this.fbg = item.fbg
              this.pbg = item.pbg
              this.hgb = item.hgb
            } else {
              // this.goRecord = false
            }
          })
          this.polar.xAxis.data = this.xAxisData;
          if (this.fbgFlag && this.pbgFlag) {
            this.trueStatus()
            // this.polar.series = [
            //   {
            //     type: "line",
            //     symbol: "circle",
            //     symbolSize: 16,
            //     data: this.fbgData,
            //     lineStyle: {
            //       color: "rgb(237, 113, 2)",
            //       width: 0.5
            //     },
            //     itemStyle: {
            //       color: "rgb(237, 113, 2)"
            //     }
            //   },
            //   {
            //     type: "line",
            //     symbol: "circle",
            //     symbolSize: 16,
            //     data: this.pbgData,
            //     lineStyle: {
            //       color: "#02b3ed",
            //       width: 0.5
            //     },
            //     itemStyle: {
            //       color: "#02b3ed"
            //     }
            //   }
            // ];
          } 
          // else if (!this.pbgFlag && this.fbgFlag) {
          //   this.polar.series = [
          //     {
          //       type: "line",
          //       symbol: "circle",
          //       symbolSize: 16,
          //       data: this.fbgData.reverse(),
          //       lineStyle: {
          //         color: "rgb(237, 113, 2)",
          //         width: 0.5
          //       },
          //       itemStyle: {
          //         color: "rgb(237, 113, 2)"
          //       }
          //     }
          //   ];
          // } else if (this.pbgFlag && !this.fbgFlag) {
          //   this.polar.series.push({
          //     type: "line",
          //     symbol: "circle",
          //     symbolSize: 16,
          //     data: this.pbgData.reverse(),
          //     lineStyle: {
          //       color: "#02b3ed",
          //       width: 0.5
          //     },
          //     itemStyle: {
          //       color: "#02b3ed"
          //     }
          //   })
          // }
          // console.log(this.seriesData)
          if (WXEnvironment.platform == "Web") {
            this.$refs.chartVm.setOption(this.$format(this.polar), true);
          }
        }
      })
    },
    trueStatus () {
      this.polar.series = [
        {
          type: "line",
          symbol: "circle",
          symbolSize: 16,
          data: this.fbgData,
          lineStyle: {
            color: "rgb(237, 113, 2)",
            width: 0.5
          },
          itemStyle: {
            color: "rgb(237, 113, 2)"
          }
        },
        {
          type: "line",
          symbol: "circle",
          symbolSize: 16,
          data: this.pbgData,
          lineStyle: {
            color: "#02b3ed",
            width: 0.5
          },
          itemStyle: {
            color: "#02b3ed"
          }
        }
      ];
    },
    sureRecord () {
      if (this.recordFbg == 0 && this.recordHgb == 0 && this.recordPbg == 0) {
        modal.toast({ message: "至少填写一项", duration: 1 });
      } else if (this.recordFbg < 0 || this.recordFbg > 30) {
        modal.toast({ message: "空腹血糖范围: 0~30mmol/L", duration: 1 });
      } else if (this.recordPbg < 0 || this.recordPbg > 30) {
        modal.toast({ message: "餐后血糖范围: 0~30mmol/L", duration: 1 });
      } else if (this.recordHgb < 0 || this.recordHgb > 30) {
        modal.toast({ message: "血红蛋白范围: 0~30", duration: 1 });
      } else {
        let params = {
          pbg: this.recordPbg,
          fbg: this.recordFbg,
          hgb: this.recordHgb,
          mbrId: this.mmbrId,
          checkTime: this.startTime
        }
        api.get(`${this.baseURL}appehrservice/addbloodsugar.json?`, params, data => {
          console.log(data)
          if (data.ERROR_TYPE == null) {
            modal.toast({ message: "添加成功", duration: 1 });
            setTimeout(() => {
              this.isBottomShow = false;
            }, 2000)
            this.fbg = this.recordFbg
            this.pbg = this.recordPbg
            this.hgb = this.recordHgb
          } else if (data.ERROR_TYPE == 1) {
            modal.toast({ message: "系统异常，添加失败", duration: 1 });
          }
        })
      }
    },
    inputFbg (e) {
      this.recordFbg = e.value
    },
    inputPbg (e) {
      this.recordPbg = e.value
    },
    inputHgb (e) {
      this.recordHgb = e.value
    },
    showCalendarModel () {
      DatePicker.pickDate(this.selectedDate[0], res => {
        if (res != null) {
          this.selectedDate = [res];
        }
      });
    },
    goRecordData () {
      this.isBottomShow = true;
    },
    cancelPopup() {
      this.isBottomShow = false;
    },
    //非状态组件，需要在这里关闭
    popupOverlayBottomClick() {
      this.isBottomShow = false;
    },
    dataTime () {
      let newDate = new Date()
      let Month = newDate.getMonth() + 1
      let Data = newDate.getDate()
      if (Month < 10) {
          Month =  '0' + Month
      }
      if (Data < 10) {
          Data =  '0' + Data
      }
      this.startTime = newDate.getFullYear() + '-' + Month + '-' + Data
    },
    minibarLeftButtonClick () {

    },
    minibarRightButtonClick () {
       this.isBottomShow = true;
    },
  }
}
</script>
<style>
  .icon_back{
    width: 40px;
    height: 40px;
  } 
    .wxc-minibar{
        border-bottom-width: 1px;
        border-bottom-color: #cccccc;
    }
</style>
<style lang="less" scoped>
.main{
  flex: 1;
  background-color: #eeeeee;
}
.main-date {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.date {
  font-size: 26px;
  margin-top: 30px;
  color: rgb(102, 102, 102);
}
.blood_pressure{
  flex-direction: row;
  justify-content: space-around;
  margin-top: 110px;
}
.shrink{
  flex: 1;
  flex-direction: column;
  align-items: center;
  border-right-width: 1px;
  border-right-color: #E5E5E5;
}
.shrink:last-child{
  border: none;
}
.blood_wrod{
  font-size: 30px;
  color:rgb(102, 102, 102);
}
.numericalValue{
  flex-direction: row;
  align-items: flex-end;
  margin-top: 54px;
}
.number{
  font-size: 60px;
  color:rgb(2, 179, 237);
}
.number_bg{
  font-size: 60px;
  color:rgb(255, 82, 82);
}
.company_word{
  font-size: 26px;
  color:rgb(102, 102, 102);
  margin-bottom: 10px;
}
.dataRange{
  flex-direction: row;
  margin-top: 40px;
}
.range {
  font-size: 22px;
  color: rgb(55, 199, 52);
}
.goRecord{
  flex-direction: column;
  align-items: center;
}
.record_wrod{
  font-size: 34px;
  color: rgb(102, 102, 102);
  margin-top: 130px;
}
.record_btn{
  margin-top: 120px;
  width: 264px;
  height: 61px;
  background-color: rgb(2, 179, 237);
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.btn_word{
  font-size: 30px;
  color: rgb(255, 255, 255);
}
.chart{
  margin-top: 20px;
  background-color: rgb(255, 255, 255);
}
.chart_title{
  margin-top: 50px;
  flex-direction: row;
  justify-content: center;
}
.chart_word{
  font-size: 34px;
  color:rgb(51, 51, 51);
}
.chart_logo{
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 42px;
}
.details_box{
  flex-direction: row;
  align-items: center;
}
.yellow_selected{
  width: 35px;
  height: 35px;
}
.selected_w, .selected_c{
  font-size: 28px;
  margin-left: 15px;
}
.selected_w{
  color: rgb(237, 113, 2);
}
.selected_c{
  color:rgb(2, 179, 237);
}
.company_too{
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 40px;
  margin-top: 20px;
}
.company_word{
  font-size: 20px;
  color: rgb(102, 102, 102);
}
// ------ 记录血糖-----
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
  margin: 80px auto 0;
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

