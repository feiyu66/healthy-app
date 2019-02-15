<template>
    <div class="box">
        <wxc-minibar title="历史日志"
            background-color="#ffffff"
            text-color="#000000"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;">
          <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
          </div>
        </wxc-minibar>  
        <div class="main" style="flex: 1; overflow-y: scroll;">
            <div class="main-date">
                <text class="date" @click='showCalendarModel'>{{selectedDate[0]}}</text>
            </div>
            <div class="echarts" id="chartVm">
              <div class="week">
                <text class="week_word" v-for="(item, index) in weekData" :key='index'>{{item}}</text>
              </div>
                <bmchart :options="$format(polar)" ref='chartVm' :style="chartStyle" @click="onChartClick"></bmchart>
            </div>
            <div class="backroundColor"></div>
            <div class="tooltip">
                <div class="too">
                    <text class="too-on" style="background-color: #37C734;"></text>
                    <text class="word">已记录</text>
                </div>
                <div class="too">
                    <text class="too-on" style="background-color: #999999;"></text>
                    <text class="word">未记录</text>
                </div>
                <div class="too">
                    <text class="too-on" style="background-color: rgb(2, 179, 237);"></text>
                    <text class="word">去记录</text>
                </div>
                <div class="too">
                    <text class="too-on" style="background-color: rgb(217, 244, 252);"></text>
                    <text class="word">日历当天</text>
                </div>
            </div>
            <!--<div class="jump" style="width: 750px; flex: 1;">
                <text class="jump-title">{{title}}</text>
                <text class="jump-click">{{wordClick}}</text>
            </div>-->
        </div>
        <wxc-dialog title="提示"
          content="您当天未记录饮食日志。"
          :show="show"
          :single="true"
          :show-no-prompt="false"
          main-btn-color="#02b4ed"
          confirm-text="好的"
          @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
    </wxc-dialog>
    </div>
</template>
<script>
import { WxcMinibar, WxcDialog } from "weex-ui";
import {
  createLink,
  calcAge,
  printLog,
  storage_getItem
} from "../../../shared/utils";
import api from "../../../shared/request";
import bmchart from "../../../components/bmchart.vue";
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
const DatePicker = weex.requireModule("datepicker");
import vueplugin from "../../../shared/vueplugin";
Vue.use(vueplugin);
var layouts = [];
var pathes = [];
var colors = ["#c4332b", "#16B644", "#f00", "#FDC763"];

function getVirtulData2(year, datadic, selectedDate) {
  // yyyy-MM-dd
  let today = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10);
  let yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1) -
      new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10);
  console.log("today", today);
  console.log("yesterday", yesterday);
  var date = new Date(`${year}-01-01`.replace(/-/g, "/")).getTime(); //+echarts.number.parseDate(year + "-01-01")
  var end = new Date(`${year + 1}-01-01`.replace(/-/g, "/")).getTime(); //echarts.number.parseDate(+year + 1 + "-01-01")
  var dayTime = 3600 * 24 * 1000;
  var data = [];
  for (var time = date; time < end; time += dayTime) {
    var items = {};
    let day = new Date(time).toISOString().slice(0, 10); //echarts.format.formatTime("yyyy-MM-dd", time);
    // console.log('day111', day)
    if (datadic[day] == null) {
      if (day == today) {
        console.log('day', day)
        let label = {
          show: true,
          formatter: function(params) {
            //var d = echarts.number.parseDate(params.value[0]);
            return params.value[0].slice(8, 10) + "\n\n" + "去记录" + "\n\n\n"; //date \n\n
          },
          textStyle: {
            color: "#02b3ed",
            fontSize: 14
          },
          offset: [0, 20],
          backgroundColor: "rgb(217, 244, 252)",
          // borderRadius: 999,
          width: 100,
          height: 100
        };
        items.label = label;
      } else if (day == yesterday) {
        let label = {
          show: true,
          formatter: function(params) {
            //var d = echarts.number.parseDate(params.value[0]);
            return params.value[0].slice(8, 10) + "\n\n" + "去记录" + "\n\n\n"; //date \n\n
          },
          textStyle: {
            color: "#02b3ed",
            fontSize: 14
          },
          offset: [0, 20]
        };
        items.label = label;
      } else if (new Date(day) > new Date(today)) {
        let label = {
          show: true,
          formatter: function(params) {
            //var d = echarts.number.parseDate(params.value[0]);
            return params.value[0].slice(8, 10); //date \n\n
          },
          textStyle: {
            color: "#cccccc",
            fontSize: 14
          },
          offset: [0, -15]
        };
        items.label = label;
      } else {
        let label = {
          show: true,
          formatter: function(params) {
            //var d = echarts.number.parseDate(params.value[0]);
            return params.value[0].slice(8, 10) + "\n\n" + "未记录" + "\n\n\n"; //date \n\n
          },
          textStyle: {
            color: "#999999",
            fontSize: 14
          },
          offset: [0, 20]
        };
        items.label = label;
      }
    } else {
      if(datadic[day].recordTime == today) {
        let label = {
          show: true,
          formatter: function(params) {
            //var d = echarts.number.parseDate(params.value[0]);
            return params.value[0].slice(8, 10) + "\n\n" + "已记录" + "\n\n\n";
          },
          textStyle: {
            color: "#37C734",
            fontSize: 14
          },
          offset: [0, 20],
          backgroundColor: 'rgb(217, 244, 252)'
        };
        items.label = label;
      } else {
        let label = {
          show: true,
          formatter: function(params) {
            //var d = echarts.number.parseDate(params.value[0]);
            return params.value[0].slice(8, 10) + "\n\n" + "已记录" + "\n\n\n";
          },
          textStyle: {
            color: "#37C734",
            fontSize: 14
          },
          offset: [0, 20]
        };
        items.label = label;
      }
    }
    if (day == selectedDate) {
      items.label.textStyle = {
        color: "#02b3ed",
        fontSize: 14
      };
    }
    //items.value = [echarts.format.formatTime("yyyy-MM-dd", time), ""];
    items.value = [new Date(time).toISOString().slice(0, 10), ""];
    data.push(items);
  }
  return data;
}
export default {
  components: {
    WxcMinibar,
    WxcDialog,
    bmchart
  },
  data() {
    return {
      show: false,
      weekData: ["一", "二", "三", "四", "五", "六", "日"],
      selectedDate: [],
      polar: {},
      title: "您当天已经记录饮食日志",
      wordClick: "点击查看",
      timeData: [], // 记录日期
      baseURL: "",
      mbrId: "",
      datadic: {},
      today: "",
      yesterday: "",
      chartStyle: 0,
      nav: false
    };
  },
  created() {
    // yyyy-MM
    let today = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);
    printLog(today);
    this.selectedDate = [today];
    printLog(this.selectedDate);
    printLog(weex.config.env.deviceHeight)
    if (weex.config.env.deviceHeight == 1920) {
      this.chartStyle = {
        width: "750px",
        height: 950 + "px"
      };
      printLog(this.chartStyle);
    } else if (weex.config.env.deviceHeight < 1300) {
      // 1208 1280
      this.chartStyle = {
        width: "750px",
        height: 870 + "px"
      };
    } else {
      this.chartStyle = {
        width: "750px",
        height: 950 + "px"
      };
    }
    const reset = new BroadcastChannel("reset-historylog-nav");
    reset.onmessage = event => {
      printLog(event.data); // Assemble!
      this.nav = false;
    };
  },
  watch: {
    selectedDate(value) {
      //   printLog(this.polar);
      //   if (WXEnvironment.platform == "Web") {
      //     this.$refs.chartVm.setOption(this.polar);
      //   }
      // this.$refs.chartVm.myChart.on("click", params => {
      //     console.log(params);
      // });
      this.dataTime();
      this.listData();
    }
  },
  methods: {
    showCalendarModel() {
      DatePicker.pickDate(this.selectedDate[0], res => {
        if (res != null) {
          this.selectedDate = [res];
          printLog(res)
        }
      });
    },
    dataTime() {
      this.today = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);

      this.yesterday = new Date(
        new Date().setDate(new Date().getDate() - 1) -
          new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
    },
    listData: async function() {
      if (!this.mbrId || !this.baseURL) {
        this.mbrId = await storage_getItem("mbrId");
        this.baseURL = await storage_getItem("newApiBase");
      }
      let params = {
        pageNum: 1,
        userId: this.mbrId
      };
      api.get(`${this.baseURL}health/diet/list?`, params, data => {
        console.log(data);
        data.data.datas.map(item => {
          this.timeData.push(item.recordTime);
        });
        this.datadic = {};
        for (let i = 0; i < data.data.datas.length; i++) {
          this.datadic[data.data.datas[i].recordTime] =
            data.data.datas[i];
        }
        console.log(this.datadic);
        let FullYear = new Date().getFullYear();
        let sl = this.selectedDate[0].split("-")
        let selectedMonth = sl[0] + "-" + sl[1]
        if (WXEnvironment.platform == "Web") {
          this.polar = {
            calendar: [
              {
                left: "center",
                top: "top",
                cellSize: [100, 100],
                yearLabel: { show: false },
                orient: "vertical",
                itemStyle: {
                  color: "#ffffff",
                  borderColor: "#ffffff"
                },
                dayLabel: {
                  show: false,
                  firstDay: 1,
                  nameMap: "cn",
                  fontSize: 18
                },
                splitLine: { show: false },
                monthLabel: { show: false },
                range: selectedMonth
              }
            ],
            series: [
              {
                type: "heatmap",
                coordinateSystem: "calendar",
                symbolSize: 1,
                data: getVirtulData2(
                  FullYear,
                  this.datadic,
                  this.selectedDate[0]
                ),
                itemStyle: {
                  color: "#ffffff"
                }
              }
              // ,{
              //   type: "heatmap",
              //   coordinateSystem: "calendar",
              //   data: getVirtulData(FullYear),
              //   itemStyle: {
              //     color: "#fff"
              //   }
              // }
            ]
          };
        } else {
          let cellwidth = 0;
          let cellheight = 0;
          if (weex.config.env.deviceHeight == 2560) {       //iphone X
            cellwidth = weex.config.env.deviceWidth / 28;
            cellheight = weex.config.env.deviceHeight / 34;
          }else if (weex.config.env.deviceHeight == 2436) { //iphone 6p/7p/8p
            cellwidth = weex.config.env.deviceWidth / 21;
            cellheight = weex.config.env.deviceHeight / 32;
          }else if (weex.config.env.deviceHeight == 2208) {
            cellwidth = weex.config.env.deviceWidth / 21;
            cellheight = weex.config.env.deviceHeight / 26;
          }else if (weex.config.env.deviceHeight == 1920) {
            cellwidth = weex.config.env.deviceWidth / 18;
            cellheight = weex.config.env.deviceHeight / 22;
          }else if (weex.config.env.deviceHeight == 1334) { //iphone 6/7/8
            cellwidth = weex.config.env.deviceWidth / 14.5;
            cellheight = weex.config.env.deviceHeight / 19;
          }else if (weex.config.env.deviceHeight < 1300) {
            // 1208 1280
            cellwidth = weex.config.env.deviceWidth / 14;
            cellheight = weex.config.env.deviceHeight / 19;
          } else {
            cellwidth = weex.config.env.deviceWidth / 18;
            cellheight = weex.config.env.deviceHeight / 22;
          }
          printLog(weex.config.env.deviceWidth / 18);
          printLog(weex.config.env.deviceHeight);
          printLog(weex.config.env.deviceHeight / 19);
          this.polar = {
            calendar: [
              {
                left: "center",
                cellSize: [cellwidth, cellheight],
                top: "top",
                yearLabel: { show: false },
                orient: "vertical",
                itemStyle: {
                  color: "#ffffff",
                  borderColor: "#ffffff"
                },
                dayLabel: {
                  show: false,
                  firstDay: 1,
                  nameMap: "cn",
                  fontSize: 14
                  // margin: 10
                },
                splitLine: { show: false },
                monthLabel: { show: false },
                range: selectedMonth
              }
            ],
            series: [
              {
                type: "heatmap",
                coordinateSystem: "calendar",
                symbolSize: 1,
                data: getVirtulData2(FullYear, this.datadic, this.selectedDate),
                itemStyle: {
                  color: "#ffffff"
                }
              }
              // ,{
              //   type: "heatmap",
              //   coordinateSystem: "calendar",
              //   data: getVirtulData(FullYear),
              //   itemStyle: {
              //     color: "#fff"
              //   }
              // }
            ]
          };
        }
        //在网页预览时需要手动设一下
        printLog(this.polar);
        if (WXEnvironment.platform == "Web") {
          this.$refs.chartVm.setOption(this.$format(this.polar), true);
        }
        if (WXEnvironment.platform == "Web") {
          //web环境当图表被点击
          this.$refs.chartVm.myChart.on("click", params => {
            printLog(params);
            console.log(this.datadic);
            let dateclicked = params.value[0];
            console.log(dateclicked)
            for (let i in this.datadic) {
              console.log(this.datadic[i].recordTime, 'this.datadic[i].recordTime')
              if (this.datadic[i].recordTime == dateclicked) {
                storage.setItem("date", dateclicked);
                const navigator = weex.requireModule("navigator");
                navigator.push({
                  url: createLink("recorded"),
                  animated: "true"
                });
              } else if (
                (this.datadic[i].recordTime !== dateclicked &&
                  dateclicked == this.today) ||
                (this.datadic[i].recordTime !== dateclicked &&
                  dateclicked == this.yesterday)
              ) {
                storage.setItem("date", dateclicked);
                const navigator = weex.requireModule("navigator");
                navigator.push({
                  url: createLink("supplement"),
                  animated: "true"
                });
              } else if (new Date(dateclicked) < new Date()) {
                this.show = true;
                // var modal = weex.requireModule("modal");
                // modal.toast({
                //   message: "您当天未记录饮食日志！",
                //   duration: 0.3
                // });
              }
            }
          });
        }
      });
    },
    wxcDialogConfirmBtnClicked () {
    //此处必须设置，组件为无状态组件，自己管理
      this.show = false;
    },
    minibarLeftButtonClick() {},
    minibarRightButtonClick() {
      modal.toast({ message: "click rightButton!", duration: 1 });
    },
    onChartClick(res) {
      //只在原生环境被调用
      printLog("onChartClick");
      printLog(this.nav);
      if (this.nav) {
        //有可能被回调多次，过滤掉以后的
        return;
      }
      this.nav = true;
      setTimeout(() => {
          this.nav = false;
      }, 300);
      let resarray = JSON.parse(res.data);
      let dateclicked = resarray[0];
      printLog(this.datadic);
      let recorded = this.datadic[dateclicked];
      if (recorded) {
        printLog("已记录");
        storage.setItem("date", dateclicked);
        const navigator = weex.requireModule("navigator");
        navigator.push({
          url: createLink("recorded"),
          animated: "true"
        });
      } else if (!recorded && dateclicked == this.today) {
        printLog("去记录今天");
        // storage.setItem("date", dateclicked);
        // const navigator = weex.requireModule("navigator");
        // navigator.push({
        //   url: createLink("supplement"),
        //   animated: "true"
        // });
        const record = new BroadcastChannel("setpage-todaydiet-tabpage");
        record.postMessage('today!')
        let navigator = weex.requireModule("navigator");
        navigator.pop({
          animated: "true"
        });
      } else if (!recorded && dateclicked == this.yesterday) {
        printLog("去记录昨天");
        const record = new BroadcastChannel("setpage-todaydiet-tabpage");
        record.postMessage('yesterday!')
        let navigator = weex.requireModule("navigator");
        navigator.pop({
          animated: "true"
        });
      } else if (new Date(dateclicked) < new Date()) {
        this.show = true
        // var modal = weex.requireModule("modal");
        // modal.toast({
        //   message: "您当天未记录饮食日志！",
        //   duration: 0.3
        // });
      }
    }
  }
};
</script>
<style scoped>
.icon_back {
  width: 40px;
  height: 40px;
}
.week {
  padding-left: 10px;
  padding-right: 15px;
  height: 64px;
  background-color: rgb(238, 238, 238);
  flex-direction: row;
}
.week_word {
  flex: 1;
  height: 64px;
  font-size: 26px;
  color: rgb(51, 51, 51);
  text-align: center;
  line-height: 64px;
}
.main-date {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.date {
  margin: 20px 0;
  font-size: 24px;
  border-width: 1px;
  border-color: #02b3ed;
  border-style: solid; 
  padding: 5px 20px;
  border-radius: 25px;
}
.echarts {
  width: 750px;
}
.backroundColor {
  height: 10px;
  background-color: #eeffff;
}
.tooltip {
  height: 70px;
  /*border-bottom-width: 1px;
  border-bottom-color: #cccccc;*/
  flex-direction: row;
  align-items: center;
}
.too {
  height: 70px;
  margin-left: 50px;
  flex-direction: row;
  align-items: center;
}
.too-on {
  width: 25px;
  height: 25px;
}
.word {
  font-size: 22px;
  margin-left: 5px;
}
.jump {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.jump-title {
  font-size: 32px;
}
.jump-click {
  border-width: 1px;
  border-color: #02b3ed;
  margin-top: 40px;
  padding: 8px 40px;
  border-radius: 25px;
  color: #02b3ed;
  font-size: 28px;
}
</style>


