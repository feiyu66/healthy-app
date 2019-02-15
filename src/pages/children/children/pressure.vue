<template>
  <div class="box">
    <wxc-minibar title="血压监测"
      background-color="#ffffff"
      text-color="#000000"
      right-text="手动记录"
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
        <div v-if="goRecord">
          <div class="blood_pressure">
            <div class="shrink">
              <text class="blood_wrod">收缩压</text>
              <div class="numericalValue">
                <text :class="[shrinkValue < 90 || shrinkValue > 140 ? 'number_bg' : 'number']">{{shrinkValue}}</text>
                <text class="company_word">mmHg</text>
              </div>
            </div>
            <div class="shrink">
              <text class="blood_wrod">舒张压</text>
              <div class="numericalValue">
                <text :class="[diastoleValue < 60 || diastoleValue > 90 ? 'number_bg' : 'number']">{{diastoleValue}}</text>
                <text class="company_word">mmHg</text>
              </div>
            </div>
          </div>
          <div class="dataRange">
            <div style="flex: 1; flex-direction: row; justify-content: center; align-items: center;"><text class="range" v-if="shrinkFlag">正常范围：90~140</text></div>
            <div style="flex: 1; flex-direction: row; justify-content: center; align-items: center;"><text class="range" v-if="diastoleFlag">正常范围：60~90</text></div>
          </div>
        </div>
        <div v-else class="goRecord">
          <text class="record_wrod">今日未记录</text>
          <div class="record_btn" @click="goRecordData"><text class="btn_word">去记录</text></div>
        </div>
      </div>
      <div class="chart">
        <div class="echarts">
          <bmchart :options="$format(polar)" ref='chartVm' @finish='finish' style="width:750px; height:650px; paddingTop: 50px;"></bmchart>
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
                  <text class="data">收缩压：</text>
                  <input @input="inputShrink" class="input" type="text">
                  <text class="company">mmHg</text>
                </div>
                <div class="record-data">
                  <text class="data">舒张压：</text>
                  <input @input="inputDiastole" class="input" type="text">
                  <text class="company">mmHg</text>
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
import api from "../../../shared/request";
import bmchart from "../../../components/bmchart.vue";
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
      goRecord: false, // 去记录
      shrinkValue: '--', // 收缩压
      shrinkFlag: false,
      diastoleValue: '--', // 舒张压
      diastoleFlag: false,
      popupHeight: 0,
      isBottomShow: false,
      startTime: '',
      baseURL: '',
      mbrId: "",
      selectedDate: [],
      polar: {
        title: {
          text: '血压趋势图',
          left: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 34,
            color: 'rgb(51, 51, 51)'
          }
        },
        tooltip: {
          trigger: "none"
        },
        legend: {
          data: ["收缩压（mmHg）", "舒张压（mmHg）"],
          left: 'right',
          top: 10,
          orient: 'vertical',
          align: 'left'
        },
        xAxis: {
          type: 'time',
          axisTick: {
            show: false
          },
          splitLine:{ //去除网格线
            show: false
          },
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
        },
        series: [
          {
            name: '收缩压（mmHg）',
            symbolSize: 20,
            data: [
              ["12-19 00:00:00", 125],
              ["12-11 00:00:00", 133],
              ["12-08 00:00:00", 149],
            ],
            type: 'scatter',
            itemStyle: {
              color: '#02B3ED'
            }
          }
        ]
      },
      shrik: 0, // 手动记录收缩压
      diastole: 0, // 手动记录舒张压
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
        console.log(444444444444)
        console.log(data)
        if (!data.threeHighSumEntityList) {
          printLog("nodata true");
          this.polar.xAxis.data = ["", ""];
          this.polar.tooltip.trigger = "none";
        } else {
          printLog("nodata false");
          this.sbpData = [] // 收缩压
          this.dbpData = [] // 舒张压
          data.threeHighSumEntityList.map(item => {
            let sbp_newData = [];
            let dbp_newData = []
            let checkDate = item.checkDate.split("-");
            let check = checkDate[1] + "-" + checkDate[2];
            sbp_newData.push(item.checkDate)
            sbp_newData.push(item.sbp)
            this.sbpData.push(sbp_newData)
            
            dbp_newData.push(item.checkDate)
            dbp_newData.push(item.dbp)
            this.dbpData.push(dbp_newData)
            if (item.checkDate.split(' ')[0] == this.startTime) {
              this.goRecord = false
              this.shrinkValue = item.sbp
              this.diastoleValue = item.dbp
            } else {
              this.goRecord = true
            }
          })
          this.polar.series = [
            {
              name: '收缩压（mmHg）',
              symbolSize: 20,
              data: this.sbpData,
              type: 'scatter',
              itemStyle: {
                color: '#02B3ED'
              }
            },
            {
              name: '舒张压（mmHg）',
              symbolSize: 20,
              data: this.dbpData,
              type: 'scatter',
              itemStyle: {
                color: 'rgb(237, 113, 2)'
              }
            }
          ]
          if (WXEnvironment.platform == "Web") {
            this.$refs.chartVm.setOption(this.$format(this.polar), true);
          }
        }
      })
    },
    inputShrink (e) { // 收缩压
      this.shrik = e.value
    },
    inputDiastole (e) { // 舒张压
      this.diastole = e.value
    },
    sureRecord () {
      if (this.shrik == 0) {
        modal.toast({ message: "收缩压不能为空", duration: 1 });
      } else if (this.diastole == 0) {
        modal.toast({ message: "舒张压不能为空", duration: 1 });
      } else if ( this.shrik < 50 || this.shrik > 220) {
        modal.toast({ message: "有效范围：50~220mmHg", duration: 1 });
      } else if ( this.diastole < 50 || this.diastole > 220) {
        modal.toast({ message: "有效范围：50~220mmHg", duration: 1 });
      } else {
        let params = {
          dbp: this.diastole, // 舒张压
          sbp: this.shrik, // 收缩压
          mbrId: this.mbrId,
          checkTime: this.startTime
        }
        api.get(`${this.baseURL}appehrservice/addbloodpressure.json?`, params, data => {
          console.log(data)
          if (data.ERROR_TYPE == null) {
            modal.toast({ message: "手动记录成功", duration: 1 });
            setTimeout(() => {
              this.isBottomShow = false;
            }, 2000)
            this.shrinkValue = this.shrik
            if (this.shrinkValue < 90 || this.shrinkValue > 140) {
              this.shrinkFlag = true
            } else {
              this.shrinkFlag = false
            }
            this.diastoleValue = this.diastole
            if (this.diastoleValue < 60 || this.diastoleValue > 90) {
              this.diastoleFlag = true
            } else {
              this.diastoleFlag = false
            }
          } else if (data.ERROR_TYPE == 1) {
            modal.toast({ message: "系统异常，添加失败", duration: 1 });
          }
        })
      }
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
    .wxc-minibar{
        border-bottom-width: 1px;
        border-bottom-color: #cccccc;
    }
</style>
<style lang="less" scoped>
.icon_back{
  width: 40px;
  height: 40px;
}
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
}
.shrink:nth-child(1){
  border-right-width: 1px;
  border-right-color: #E5E5E5;
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
  color: rgb(255, 82, 82);
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
  background-color: rgb(255, 255, 255);
  margin-top: 20px;
}
// ------ 记录血压-----
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

