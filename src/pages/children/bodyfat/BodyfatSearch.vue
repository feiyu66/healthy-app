<template>
    <div class="wrapper-app">
        <div class="header">
            <div class="header-left" @click="toBack">
                    <image class="icon_back" :src="getImgPath('icon_back_white.png')"/>
                    <text class="back">返回</text>
            </div>
            <div class="header-title"><text class="title">体脂秤</text></div>
            <div class="header-right"></div>
        </div>
        <scroller class="section" v-if="!flag_search">
            <text class="toolip">踩亮设备(开机)，踩亮后离开设备</text>
            <div class="main-tip">
                <div class="main-img">
                    <image class="connect_fat" :src="getImgPath('connect_fat.png')"/>
                    <image class="footed_left" v-if="flag_left" :src="getImgPath('footed_left.png')"/>
                    <image class="footed_right" v-if="flag_right" :src="getImgPath('footed_right.png')"/>
                </div>
                <div class="btn-next" @click="beginsearch()"><text class="btn-text">下一步：搜索设备</text></div>
            </div>
        </scroller>
         <scroller class="section" v-else>
            <div class="main">
                <image class="phone" :src="getImgPath('phone.png')"/>
                <div class="uls" ref="ulStyle">
                    <div :class="[count == 0 ? 'list-on' : 'list']"></div>
                    <div :class="[count == 1 ? 'list-on' : 'list']"></div>
                    <div :class="[count == 2 ? 'list-on' : 'list']"></div>
                    <div :class="[count == 3 ? 'list-on' : 'list']"></div>
                    <div :class="[count == 4 ? 'list-on' : 'list']"></div>
                    <div :class="[count == 5 ? 'list-on' : 'list']"></div>
                </div>
                <image class="fat_img" :src="getImgPath('fat_img.png')"/>
            </div>
            <div class="cent">
                <text v-if="searching == true && flag == false" class="moment">正在搜索设备，请稍后</text> 
                <text v-else-if="searching == false && flag == false" class="olChildren" @click="search()">重新搜索</text> 
                <div v-else-if="flag == true && fail == false" class="bg_search">
                  <image class="bg_search_img" :src="getImgPath('bg_search.png')"/>
                  <text class="result">搜索结果</text>
                </div>
                <text v-else-if="fail == true" class="fail">连接失败，请重新连接</text>
            </div>
            <div class="tip-search">
                <text class="tip-title">已搜索到的设备</text> 
            </div>
            <list class="balance">
                <cell class="ols" v-for="(item, index) in devices" :key='index'>
                    <div class="ol-lis">
                      <text class="word">{{item.name}}</text>
                      <div @click="connect(index)" :class="[btnidx == index ? 'btn-connected' : 'btn']">
                        <text class="connect-text"  v-if="btnidx != index">立即连接</text>
                        <text class="connected-text"  v-else-if="btnidx == index">已连接</text>
                      </div>
                    </div>
                </cell>
            </list>
            <div class="jump_search">
            <div v-if="connected == true" class="btn-next" @click="jump('bodyfat')"><text class="btn-text">开始测量</text></div>
            </div>
        </scroller>
    </div>
</template>
<script>
import { createLink, printLog, uniqueQNDevice } from "../../../shared/utils";
const modal = weex.requireModule("modal");
const QNDevice = weex.requireModule("qndevice");
const globalEvent = weex.requireModule("globalEvent");
export default {
  data() {
    return {
      flag_left: false,
      flag_right: false,
      flag_search: false,
      searching: true,
      flag: false,
      connected: false,
      count: 0,
      btnidx: -1,
      fail: false,
      success: false,
      content: "立即连接",
      anime: 0,
      devices: []
    };
  },
  created() {
    setInterval(() => {
      this.flag_left = !this.flag_left;
    }, 1000);
    setInterval(() => {
      this.flag_right = !this.flag_right;
    }, 2000);
    globalEvent.addEventListener("deviceConnected", function(e) {
      printLog(e);
      printLog("deviceConnected");
    });
    globalEvent.addEventListener("deviceFound", res => {
      printLog(res);
      let device = {};
      device.name = res.name;
      device.mac = res.mac;
      this.devices.push(device);
      //this.devices = uniqueQNDevice(this.devices)
    });
  },
  mounted() {},
  methods: {
    toBack() {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    jump(path) {
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    },
    beginsearch() {
      this.devices = [];
      this.flag_search = true;

      QNDevice.startSearchDevice(
        success => {
          if (success != null) {
            printLog(success);
          }
        },
        error => {
          if (error != null) {
            printLog(error);
            this.stopanime();
          }
        }
      );
      this.startanime();
      setTimeout(() => {
        this.stopanime();
      }, 60000);
    },
    search() {
      this.devices = [];
      this.btnidx = -1;
      this.connected = false;
      QNDevice.startSearchDevice(
        success => {
          if (success != null) {
            printLog(success);
          }
        },
        error => {
          if (error != null) {
            printLog(error);
            this.stopanime();
          }
        }
      );
      this.startanime();
      setTimeout(() => {
        this.stopanime();
      }, 60000);
    },
    startanime() {
      this.searching = true;
      this.$nextTick(() => {
        // DOM updated
        let data = this.$refs.ulStyle.children;
        this.count = 0;
        this.anime = setInterval(() => {
          this.count++;
          if (this.count > data.length - 1) {
            this.count = 0;
          }
        }, 1000);
        printLog(this.anime);
      });
    },
    stopanime() {
      this.searching = false;
      clearInterval(this.anime);
      this.count = 7;
    },
    connect(index) {
      let devicemac = this.devices[index].mac;
      QNDevice.connectDevice(
        devicemac,
        success => {
          if (success != null) {
            printLog(success);
            this.btnidx = index;
            this.connected = true;
            this.stopanime();
          }
        },
        error => {
          if (error != null) {
            printLog(error);
            this.stopanime();
          }
        }
      );

      // if(this.success) {
      // this.content = '已连接'
      // this.success = true
      // } else {
      //     this.fail = true
      // }
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper-app {
  flex-direction: column;
}
.header {
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
.content {
  flex: 4;
}
.section {
  flex: 1;
}
.toolip {
  margin-top: 100px;
  text-align: center;
  font-size: 36px;
  color: rgb(51, 51, 51);
}
.main-tip {
  height: 850px;
  position: relative;
  padding: 0 35px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.main {
  height: 400px;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.main-img {
}
.connect_fat {
  width: 500px;
  height: 500px;
  position: relative;
}
.footed_left {
  position: absolute;
  width: 115px;
  height: 210px;
  left: 120px;
  bottom: 100px;
}
.footed_right {
  position: absolute;
  width: 115px;
  height: 210px;
  right: 120px;
  bottom: 100px;
}
.btn-next {
  background-color: rgb(2, 179, 237);
  width: 500px;
  height: 100px;
  margin-top: 80px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}
.btn-text {
  font-size: 36px;
  color: #ffffff;
}
.phone {
  width: 100px;
  height: 150px;
}
.uls {
  display: -webkit-flex;
  flex-direction: row;
}
.list {
  width: 25px;
  height: 25px;
  background-color: #dddddd;
  border-radius: 50%;
  margin-left: 15px;
}
.on {
  background-color: #02b3ed;
}
.list-on {
  width: 25px;
  height: 25px;
  background-color: #02b3ed;
  border-radius: 50%;
  margin-left: 15px;
}
.fat_img {
  width: 260px;
  height: 260px;
}
.cent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.moment {
  text-align: center;
  font-size: 34px;
  color: rgb(51, 51, 51);
}
.olChildren {
  width: 240px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  font-size: 36px;
  color: #ffffff;
  background-color: rgb(2, 179, 237);
  border-radius: 5px;
}
.bg_search {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.bg_search_img {
  width: 150px;
  height: 150px;
}
.result {
  width: 150px;
  text-align: center;
  font-size: 34px;
  color: rgb(51, 51, 51);
  margin-top: 20px;
}
.fail {
  width: 340px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 28px;
  color: rgb(254, 254, 254);
  background-color: rgb(153, 153, 153);
  border-radius: 30px;
}
.tip-search {
  height: 80px;
  background-color: #eeeeee;
  flex-direction: row;
  align-items: center;
  margin-top: 70px;
}
.tip-title {
  margin-left: 30px;
  border-left-width: 5px;
  border-left-color: #02b3ed;
  padding-left: 20px;
  font-size: 36px;
  color: rgb(51, 51, 51);
}
.balance {
  padding: 0 30px;
  height: 340px;
}
.ols {
  flex-direction: column;
  height: 80px;
}
.ol-lis {
  height: 80px;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: rgb(238, 238, 238);
}
.word {
  margin-top: 40px;
  height: 80px;
  font-size: 32px;
  color: rgb(2, 179, 237);
}
.btn {
  width: 160px;
  height: 46px;
  border-radius: 30px;
  background-color: rgb(2, 179, 237);
  justify-content: center;
  align-items: center;
  line-height: 46px;
}
.btn-connected {
  width: 160px;
  height: 46px;
  border-radius: 30px;
  border-width: 1px;
  border-color: rgb(153, 153, 153);
  justify-content: center;
  align-items: center;
  line-height: 46px;
}
.jump_search {
  justify-content: center;
  align-items: center;
  height: 200px;
}
.btn-search {
  background-color: rgb(2, 179, 237);
  width: 500px;
  height: 100px;
  margin-top: 40px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}
.connect-text {
  font-size: 28px;
  color: #ffffff;
}
.connected-text {
  font-size: 28px;
  color: rgb(153, 153, 153);
}
</style>
