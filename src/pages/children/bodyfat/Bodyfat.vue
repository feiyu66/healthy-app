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
        <scroller class="section">
            <!-- <div class="prompt-box" v-if="connecting">
                <image class="hint_info" :src="getImgPath('hint_info.png')"/>
                <text class="tooltip">正在连接，请在连接成功后测量</text>
            </div>
            <div class="prompt-box" v-if="connected">
                <image class="hint_info" :src="getImgPath('hint_info.png')"/>
                <text class="tooltip">连接成功</text>
            </div> -->
            <div class="main">
                <text :class="[bleopened == true ? 'too' : 'too1']">请站到U-TEST体脂秤上，数字闪烁后测量结果即可同步（光脚可测量体脂率）</text>
                <image class="logo" :src="getImgPath('bodyfat_stepon.png')"/>
                <text class="tip">如app未显示测量结果，可重试一次</text>
                <div class="cont">
                    <div class="uls">
                        <div class="list on">
                            <text class="list-one">体重 （kg）</text>
                            <text class="list-two">{{weight}}</text>
                        </div>
                        <div class="list">
                            <text class="list-one">体脂率 （%）</text>
                            <text class="list-two">{{bodyfat}}</text>
                        </div>
                    </div>
                    <div class="div-btn">
                        <div :class="[qnData.weight ? 'btn-enabled' : 'btn-disabled']"  @click="uploadWeight"><text class="btn-text">提交</text></div>
                    </div>
                </div>
                <div class="div-hints">
                        <image class="hint" :src="getImgPath('hint_warning.png')"/>
                        <text class="text-hints">请不要与他人共用账号测量以免影响您的处方</text>
                </div>
            </div>
        </scroller>
            <div class="open" v-if="bleopened == false">
                <text class="open-left">手机蓝牙未开启</text>
                <text class="open-right" @click="connect">立即开启</text>
            </div>

        <wxc-dialog
            content="您本次体重与上次测量结果相差较大，请确认是否是本人测量"
            :show="show"
            :single="false"
            :is-checked="isChecked"
            :show-no-prompt="false"
            @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
            @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked"
            @wxcDialogNoPromptClicked="wxcDialogNoPromptClicked">
        </wxc-dialog>
    </div>
</template>
<script>
import api from "../../../shared/request";
import { readString, saveString } from "../../../shared/default_preference";
import { createLink, printLog, storage_getItem } from "../../../shared/utils";
import { WxcDialog } from "weex-ui";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
const QNDevice = weex.requireModule("qndevice");
const globalEvent = weex.requireModule("globalEvent");
export default {
  components: { WxcDialog },
  data() {
    return {
      baseURL: "",
      mbrId: "",
      show: false,
      connecting: true,
      connected: false,
      isChecked: false,
      bleopened: true,
      weight: "— —",
      bodyfat: "— —",
      qnData: {},
      autogoback: false,
      storeWeight: 0
    };
  },
  created() {
    this.getparams();
    printLog("aftergetstorage");
    printLog(this.mbrId);
    printLog(this.baseURL);
    printLog(this.autogoback);
    QNDevice.checkBluetooth(
      success => {
        if (success != null && success.errorCode == 0) {
          printLog(success);
          this.bleopened = true;
        } else if (success != null && success.errorCode == 1) {
          printLog(success);
          this.bleopened = false;
        }
      },
      error => {
        if (error != null) {
          printLog(error);
        }
      }
    );
    globalEvent.addEventListener("bleopened", res => {
      printLog(res);
      printLog("bleopened");
      this.bleopened = true;
      if (res['status'] == "connecting")
        return
      this.connect();
    });
    globalEvent.addEventListener("deviceConnected", res => {
      printLog(res);
      printLog("deviceConnected");
      this.connecting = false;
      this.connected = true;
    });
    globalEvent.addEventListener("onUnsteadyWeight", res => {
      printLog(res);
      printLog("onUnsteadyWeight");
      this.weight = res.weight;
    });
    globalEvent.addEventListener("onReceivedData", res => {
      printLog(res);
      printLog("onReceivedData");
      this.qnData = {};
      this.qnData.height = res.height;
      this.qnData.weight = res.weight;
      this.qnData.waistline = res.waistline;
      this.qnData.bodyfat = res.bodyfat;
      this.qnData.subfat = res.subfat;
      this.qnData.visfat = res.visfat;
      this.qnData.water = res.water;
      this.qnData.bmr = res.bmr;
      this.qnData.muscle = res.muscle;
      this.qnData.bone = res.bone;
      this.qnData.protein = res.protein;

      this.weight = res.weight;
      if (res.bodyfat != 0) this.bodyfat = res.bodyfat;
    });
  },
  methods: {
    getparams: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("oldApiBase");
      try {
        this.autogoback = await storage_getItem("autogoback");
      } catch (e) {
        this.autogoback = false;
      }
      printLog("getweight");
      storage.getItem(
        "weight",
        res => {
          printLog(res);
          if (res != null) {
            this.storeWeight = parseFloat(res.data);
          }
        },
        err => {
          printLog(err);
          this.storeWeight = 0;
        }
      );
    },
    connect() {
      QNDevice.connectDevice(
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
    uploadWeight() {
      if (this.qnData.weight) {
        if (Math.abs(this.storeWeight - this.qnData.weight) > 5) {
          this.show = true;
        } else {
          this.qnData.mbrId = this.mbrId;
          this.qnData.checkTime =
            new Date(
              new Date().getTime() - new Date().getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 19) + "Z";
          api.post(
            `${this.baseURL}appehrservice/addweight2.json?`,
            this.qnData,
            data => {
              printLog(data);
              if (!data.ERROR_TYPE) {
                console.log("error null");
                storage.setItem("weight", this.weight);
                if (this.autogoback) {
                  modal.toast({
                    message: "更新成功"
                  });
                } else {
                  modal.toast({
                    message: "更新成功,请到记录页查看数据"
                  });
                }
                this.qnData = {};
                if (this.autogoback) {
                  let navigator = weex.requireModule("navigator");
                  navigator.pop({
                    animated: "true"
                  });
                } else {
                  this.weight = "— —";
                  this.bodyfat = "— —";
                }
                const refresh = new BroadcastChannel("refresh-weight-data");
                refresh.postMessage("refresh-weight-data");
                const refresh2 = new BroadcastChannel(
                  "refresh-home-evaluation"
                );
                refresh2.postMessage("refresh!");
              } else {
                modal.toast({
                  message: "系统异常，发送失败"
                });
              }
            }
          );
        }
      }
    },
    openDialog() {
      this.show = true;
    },
    wxcDialogCancelBtnClicked() {
      // must setting,control by yourself
      this.show = false;
    },
    wxcDialogConfirmBtnClicked() {
      // must setting,control by yourself
      this.show = false;
      this.qnData.mbrId = this.mbrId;
      this.qnData.checkTime =
        new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 19) + "Z";
      api.post(
        `${this.baseURL}appehrservice/addweight2.json?`,
        this.qnData,
        data => {
          console.log(data);
          if (!data.ERROR_TYPE) {
            console.log("error null");
            storage.setItem("weight", this.weight);
            if (this.autogoback) {
              modal.toast({
                message: "更新成功"
              });
            } else {
              modal.toast({
                message: "更新成功,请到记录页查看数据"
              });
            }
            if (this.autogoback) {
              let navigator = weex.requireModule("navigator");
              navigator.pop({
                animated: "true"
              });
            } else {
              this.weight = "— —";
              this.bodyfat = "— —";
            }

            const refresh = new BroadcastChannel("refresh-weight-data");
            refresh.postMessage("refresh-weight-data");
            const refresh2 = new BroadcastChannel("refresh-home-evaluation");
            refresh2.postMessage("refresh!");
          } else {
            modal.toast({
              message: "系统异常，发送失败"
            });
          }
        }
      );
    },
    wxcDialogNoPromptClicked(e) {
      // must setting,control by yourself
      this.isChecked = e.isChecked;
    },
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
    }
  }
};
</script>

<style lang="less" scoped>
.content-subtext {
  font-size: 36px;
  color: rgb(51, 51, 51);
}
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
.prompt-box {
  height: 80px;
  text-align: center;
  line-height: 60px;
  padding-top: 5px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
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
  color: #02b3ed;
}
.open {
  position: absolute;
  left: 0;
  top: 0;
  width: 750px;
  height: 80px;
  margin-top: 100px;
  text-align: center;
  line-height: 60px;
  background-color: #eee;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
}
.open-left {
  font-size: 32px;
  color: #333;
  margin-left: 20px;
}
.open-right {
  width: 160px;
  height: 54px;
  text-align: center;
  line-height: 54px;
  border-width: 2px;
  border-color: #333;
  color: #333;
  font-size: 30px;
  border-radius: 5px;
  margin-right: 30px;
}
.main {
  height: 1140px;
  padding: 0 20px;
  align-items: center;
  justify-content: center;
}
.too {
  margin-top: 30px;
  font-size: 35px;
  color: rgb(102, 102, 102);
  margin-bottom: 40px;
}
.too1 {
  margin-top: 70px;
  font-size: 35px;
  color: rgb(102, 102, 102);
  margin-bottom: 40px;
}
.logo {
  margin: 0 auto;
  width: 400px;
  height: 420px;
}
.tip {
  margin: 0px auto 20px;
  font-size: 30px;
  color: rgb(2, 179, 237);
}
.cont {
  margin: 0 auto;
  width: 680px;
  height: 340px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px #cccccc;
}
.uls {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.list {
  flex: 1;
  height: 170px;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.list-one {
  font-size: 38px;
  color: rgb(102, 102, 102);
}
.on {
  border-right-width: 1px;
  border-right-color: rgb(221, 221, 221);
}
.list-two {
  font-size: 40px;
  color: rgb(2, 179, 237);
  margin-top: 24px;
}
.btn-enabled {
  width: 250px;
  height: 80px;
  color: #ffffff;
  background-color: rgb(2, 179, 237);
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 0 30px #71adc1;
}
.btn-disabled {
  width: 250px;
  height: 80px;
  color: #ffffff;
  background-color: #ccc;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 0 30px #71adc1;
}
.btn-text {
  font-size: 36px;
  color: #ffffff;
}
.div-btn {
  height: 80px;
  margin-top: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.div-hints {
  width: 750px;
  height: 80px;
  margin-top: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.text-hints {
  width: 580px;
  height: 80px;
  margin-top: 46px;
  margin-left: 10px;
  font-size: 28px;
  color: rgb(253, 143, 0);
  display: flex;
}
.hint {
  width: 40px;
  height: 40px;
}
</style>
