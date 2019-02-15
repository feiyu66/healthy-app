<template>
    <div class="box">
        <wxc-minibar title="指标监测"
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
            <div class="weight main-children" @click="jump('weight')">
              <div class="children_box" style="width: 95%; marginLeft: 5%;">
                <div class="children_title">
                  <div class="title_left">
                    <text class="title_name">体重</text>
                  </div>
                  <image class="icon_back2" :src="getImgPath('icon_back2.png')"/>
                </div>
                <div class="record">
                    <div style="flex: 1;">
                      <image class="weight_img" :src="getImgPath('weight.png')"/>
                    </div>
                    <div v-if="unrecordedFlag" style="flex: 3; flex-direction: row; align-items: center;">
                      <div class="h_data">
                          <text class="height">体重</text>
                          <b class="data">{{weight}}<i class="company">kg</i></b>
                      </div>
                      <div class="h_data">
                          <text class="height">体脂率</text>
                          <b class="data">{{bodyfat}}<i class="company">%</i></b>
                      </div>
                    </div> 
                    <text v-else class="noTooltip">暂无数据</text> 
                </div>
                <div class="bot_data"><text class="dataTime">{{newData}}</text></div>
              </div>
            </div>
            <div class="pressure main-children" @click="jump('pressure')">
              <div class="children_box" style="width: 95%; marginLeft: 5%;">
                <div class="children_title">
                  <div class="title_left">
                    <text class="title_name">血压</text>
                  </div>
                  <image class="icon_back2" :src="getImgPath('icon_back2.png')"/>
                </div>
                <div class="record">
                  <div style="flex: 1;">
                    <image class="weight_img" :src="getImgPath('bp.png')"/>
                  </div>
                  <div v-if="unrecordedFlag" style="flex: 3; flex-direction: row; align-items: center;">
                    <div class="h_data">
                        <text class="height">收缩压</text>
                        <div class="too_msg">
                            <b :class="[sbp < 90 || sbp > 150 ? 'abnormal_bg' : 'data']">{{sbp}}<i class="company">mmHg</i></b>
                            <image v-if="sbp < 90" class="big_down_arrows" :src="getImgPath('big_up_arrows.png')"/>
                            <image v-if="sbp > 150" class="big_down_arrows" :src="getImgPath('big_down_arrows.png')"/>
                        </div>
                    </div>
                    <div class="h_data">
                        <text class="height">舒张压</text>
                        <div class="too_msg">
                            <b :class="[dbp < 60 || dbp > 90 ? 'abnormal_bg' : 'data']">{{dbp}}<i class="company">mmHg</i></b>
                            <image v-if="dbp < 60" class="big_down_arrows" :src="getImgPath('big_up_arrows.png')"/>
                            <image v-if="dbp > 90" class="big_down_arrows" :src="getImgPath('big_down_arrows.png')"/>
                        </div>
                    </div>
                  </div> 
                  <text v-else class="noTooltip">暂无数据</text> 
                </div>
                <div class="bot_data"><text class="dataTime">{{newData}}</text></div>
              </div>
            </div>
            <div class="sugar main-children" @click="jump('sugar')">
              <div class="children_box" style="width: 95%; marginLeft: 5%;">
                <div class="children_title">
                  <div class="title_left">
                    <text class="title_name">血糖</text>
                  </div>
                  <image class="icon_back2" :src="getImgPath('icon_back2.png')"/>
                </div>
                <div class="record">
                  <div style="flex: 1;">
                    <image class="weight_img" :src="getImgPath('glu.png')"/>
                  </div>
                  <div v-if="unrecordedFlag" style="flex: 3; flex-direction: row; align-items: center;">
                    <div class="h_data">
                        <text class="height">空腹血糖</text>
                        <div class="too_msg">
                            <b :class="[fbg < 3.4 || fbg > 7.0 ? 'abnormal_bg' : 'data']">{{fbg}}<i class="company">mmol/L</i></b>
                            <image v-if="fbg < 3.4" class="big_down_arrows" :src="getImgPath('big_up_arrows.png')"/>
                            <image v-if="fbg > 7.0" class="big_down_arrows" :src="getImgPath('big_down_arrows.png')"/>
                        </div>
                    </div>
                    <div class="h_data">
                        <text class="height">餐后血糖</text>
                        <div class="too_msg">
                            <b :class="[pbg < 6.7 || pbg > 11.1 ? 'abnormal_bg' : 'data']">{{pbg}}<i class="company">mmol/L</i></b>
                            <image v-if="pbg < 6.7" class="big_down_arrows" :src="getImgPath('big_up_arrows.png')"/>
                            <image v-if="pbg > 11.1" class="big_down_arrows" :src="getImgPath('big_down_arrows.png')"/>
                        </div>
                    </div>
                  </div>  
                  <text v-else class="noTooltip">暂无数据</text>  
                </div>
                <div class="bot_data"><text class="dataTime">{{newData}}</text></div>
              </div>
            </div>
            <div class="fat main-children" v-show>
                <text>血脂</text>
                <div class="record">
                    <text>总胆固醇 67kg</text>
                    <text>甘油三酯 25.5%</text>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { WxcMinibar } from 'weex-ui'
import { createLink, storage_getItem} from "../../../shared/utils"
import api from "../../../shared/request"
const storage = weex.requireModule("storage")
export default {
  components: {
    WxcMinibar
  },
  data() {
    return {
      startData:'',
      baseURL: "",
      mbrId: "",
      newData: '',
      unrecordedFlag: false, // 未记录提示
      weight: '--', // 体重
      bodyfat: '--', // 体脂率
      sbp: '--', // 收缩压
      dbp: '--', // 舒张压
      fbg: '--', // 空腹血糖
      pbg: '--', // 餐后血糖
    };
  },
  created() {
    this.gethealth7();
    this.dataTime()
  },
  methods: {
    gethealth7: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("oldApiBase");
      // this.date = await storage_getItem("date");
      console.log(this.mbrId, this.baseURL);
      let params = {
        date: this.startData, // 指定某天(空默认指今天)
        direction: 1, // 方向(1:往前；2:往后)
        type: 1, // 类型(1:体重；2:血压；3:血糖；4:血脂；5:尿酸；6:感受)
        mbrId: this.mbrId
      };
      api.get(`${this.baseURL}appehrservice/gethealth7timelist.json?`,
        params,
        data => {
          console.log(data);
          let item = data.threeHighSumEntityList[0]
          if (data.threeHighSumEntityList.length !== 0) {
            this.unrecordedFlag = true
            this.newData = item.checkDate
            this.weight = item.weight
            this.bodyfat = item.bodyfat
            this.sbp = item.sbp
            this.dbp = item.dbp
            this.fbg = item.fbg
            this.pbg = item.pbg
          } else {
            this.unrecordedFlag = false
          }
        }
      );
    },
    dataTime () {
      let newDate = new Date();
      // 开始时间
      let Month = newDate.getMonth() + 1
      let Data = newDate.getDate()
      if (Month < 10) { // 月
          Month =  '0' + Month
      }
      if (Data < 10) { // 日
          Data =  '0' + Data
      }
      this.startData = newDate.getFullYear() + '-' + Month + '-' + Data
      console.log(this.startData)
    },
    jump(path) {
      if (!path) return;
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
      storage.setItem("type", '2');
    },
    toBack() {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    minibarLeftButtonClick () {

    },
    minibarRightButtonClick () {
        modal.toast({ 'message': 'click rightButton!', 'duration': 1 });
    },
  }
};
</script>
<style>
    /* .wxc-minibar{
        border-bottom-width: 1px;
        border-bottom-color: #cccccc;
    } */
</style>
<style lang="less" scoped>
.abnormal_bg{
  color: rgb(255, 82, 82);
  font-size: 50px;
  margin-top: 15px;
}
.icon_back{
  width: 40px;
  height: 40px;
}
.main {
  flex: 1;
  background-color: #eeeeee;
}
.main-children {
  flex-direction: row;
  background-color: rgb(255, 255, 255);
  border-bottom-width: 1px;
  border-bottom-color: rgb(221, 221, 221);
}
.weight{
  margin-top: 10px;
}
.children_title{
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: rgb(238, 238, 238);
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.title_left{
  flex-direction: row;
  align-items: center;
}
.title_name{
  margin-left: 10px;
  font-size: 34px;
  color: rgb(51, 51, 51);
}
.icon_back2{
  width: 22px;
  height: 34px;
  margin-right: 30px;
}
.record{
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.weight_img{
  width: 125px;
  height: 125px;
  margin-left: 40px;
}
.noTooltip{
  flex: 3;
  margin-left: 180px;
  font-size: 34px;
  color:rgb(153, 153, 153);
}
.h_data{
  flex-direction: column;
  flex: 1;
  margin-left: 50px;
}
.height{
  font-size: 30px;
  color:rgb(102, 102, 102);
  margin-top: 5px;
}
.too_msg{
    flex-direction: row;
    align-items: flex-end;
}
.big_down_arrows{
    width: 30px;
    height: 46px;
    margin-bottom: 5px;
    margin-left: 10px;
}
.data{
  color: rgb(2, 179, 237);
  font-size: 50px;
  margin-top: 15px;
}
.company{
  font-size: 30px;
  color: rgb(102, 102, 102);
}
.bot_data{
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 30px;
  padding-bottom: 20px;
}
.dataTime{
  font-size: 24px;
  color: rgb(102, 102, 102);
}
</style>

