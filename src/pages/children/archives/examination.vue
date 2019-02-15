<template>
  <div class="box">
    <wxc-minibar title="体检指标"
        background-color="#ffffff"
        text-color="#000000"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
        @wxcMinibarRightButtonClicked="minibarRightButtonClick"
        >
      <!-- <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
        <image class="icon_back" :src="getImgPath('icon_back.png')"/>
      </div> -->
    </wxc-minibar>
    <scroller class="main" :style="scrollStyle">
      <div class="hospital" v-for="(item, index) in hospitalData" :key='index'>
        <div class="hospital_message" @click="displayInformation(index)">
          <div class="msg_left">
            <image class="hint_info" :src="getImgPath('hospital.png')"/>
            <div class="name_data">
              <text class="hospital_name">{{item.orgName}}</text>
              <text class="hospital_data">{{item.checkTime}}</text>
            </div>
          </div>
          <image v-if="num == index" class="btn_pull_down" :src="getImgPath('btn_pull_down.png')"/>
          <image v-else class="icon_back2" :src="getImgPath('icon_back2.png')"/>
        </div>
        <div class="message" v-if="num == index">
          <div class="information">
            <text class="msg_title">一般检查</text>
            <div class="msg">
              <text class="name">身高</text>
              <div class="number"><text class="number_num">{{item.mbrHeight}}</text><text class="company">cm</text></div>
            </div>
            <div class="msg">
              <text class="name">体重</text>
              <div class="number"><text class="number_num">{{item.mbrWeight}}</text><text class="company">kg</text></div>
            </div>
            <div class="msg">
              <text class="name">BMI</text>
              <div class="number"><text class="number_num">{{item.bmi}}</text><text class="company">%</text></div>
            </div>
            <div class="msg">
              <text class="name">腰围</text>
              <div class="number"><text class="number_num">{{item.mbrHeight}}</text><text class="company">cm</text></div>
            </div>
          </div>
          <div class="information">
            <text class="msg_title">血压</text>
            <div class="msg">
              <text class="name">收缩压</text>
              <div class="number">
                <text class="number_num">{{item.sbp}}</text>
                <text class="company">mmHg</text>
                <image v-if="item.sbp < 90" class="medical_examination_arrows" :src="getImgPath('big_up_arrows.png')"/>
                <image v-if="item.sbp > 150" class="medical_examination_arrows" :src="getImgPath('medical_examination_arrows.png')"/>
              </div>
            </div>
            <div class="msg">
              <text class="name">舒张压</text>
              <div class="number">
                <text class="number_num">{{item.dbp}}</text><text class="company">mmHg</text>
                <image v-if="item.dbp < 60" class="medical_examination_arrows" :src="getImgPath('big_up_arrows.png')"/>
                <image v-if="item.dbp > 90" class="medical_examination_arrows" :src="getImgPath('medical_examination_arrows.png')"/>
              </div>
            </div>
          </div>
          <div class="information">
            <text class="msg_title">血糖</text>
            <div class="msg">
              <text class="name">空腹血糖</text>
              <div class="number"><text class="number_num">{{item.fbg}}</text><text class="company">mmol/L</text></div>
            </div>
            <div class="msg">
              <text class="name">餐后血糖</text>
              <div class="number"><text class="number_num">{{item.pbg}}</text><text class="company">mmol/L</text></div>
            </div>
            <div class="msg">
              <text class="name">糖化血红蛋白</text>
              <div class="number"><text class="number_num">{{item.hbA1c}}</text><text class="company">%</text></div>
            </div>
          </div>
          <div class="information">
            <text class="msg_title">血脂</text>
            <div class="msg">
              <text class="name">总胆固醇</text>
              <div class="number"><text class="number_num">{{item.tc}}</text><text class="company">mmol/L</text></div>
            </div>
            <div class="msg">
              <text class="name">甘油三酯</text>
              <div class="number"><text class="number_num">{{item.tg}}</text><text class="company">mmol/L</text></div>
            </div>
            <div class="msg">
              <text class="name">低密度脂蛋白固醇</text>
              <div class="number"><text class="number_num">{{item.ldl}}</text><text class="company">mmol/L</text></div>
            </div>
            <div class="msg">
              <text class="name">高密度脂蛋白固醇</text>
              <div class="number"><text class="number_num">{{item.hdl}}</text><text class="company">mmol/L</text></div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import { WxcMinibar, Utils } from "weex-ui"
import { createLink, storage_getItem} from '../../../shared/utils'
import api from '../../../shared/request'
const modal = weex.requireModule("modal");
export default {
  components: { WxcMinibar },
  data () {
    return {
      hospitalData: [],
      num: null,
      mbrId: '',
      baseURL: ''
    }
  },
  created () {
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 100 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
    }
    this.medicalIndexData()
  },
  methods: {
    medicalIndexData: async function () {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      let userId = '13020058080-mbr'
      console.log(this.mbrId, this.baseURL)
      let params = {}
      api.get(`${this.baseURL}health/healthCheck/medicalIndex/${userId}`, params, data => {
        console.log(data)
        data.data.map(item => {
          item.bmi = ((item.mbrWeight / (item.mbrHeight * item.mbrHeight)) *10000).toFixed(2)
        })
        this.hospitalData = data.data
      })
    },
    displayInformation (index) {
      this.num = index
    },
    minibarLeftButtonClick() {},
    minibarRightButtonClick() {
      modal.toast({ message: "click rightButton!", duration: 1 });
    },
  }
}
</script>
<style>
.wxc-minibar {
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
}
</style>
<style lang="less" scoped>
  .main{
    flex: 1;
    background-color: #eeeeee;
    padding-top: 10px;
  }
  .hospital{
    padding-left: 30px;
    border-bottom-color: rgb(221, 221, 221);
    border-bottom-width: 1px;
    background-color: rgb(255, 255, 255);
  }
  .hospital_message{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding-bottom: 20px;
  }
  .btn_pull_down{
    width: 34px;
    height: 20px;
    margin-right: 30px;
  }
  .icon_back2{
    width: 22px;
    height: 34px;
    margin-right: 30px;
  }
  .msg_left{
    flex-direction: row;
    align-items: center;
  }
  .hint_info{
    width: 48px;
    height: 48px;
  }
  .name_data{
    margin-left: 20px;
  }
  .hospital_name{
    font-size: 32px;
    color: rgb(51, 51, 51);
    margin-top: 10px;
  }
  .hospital_data{
    font-size: 28px;
    color:rgb(102, 102, 102);
  }
  .msg_title{
    width: 200px;
    height: 60px;
    margin-top: 30px;
    background-color: rgb(2, 179, 237);
    font-size: 30px;
    color: rgb(255, 255, 255);
    border-radius: 99px;
    text-align: center;
    line-height: 60px;
  }
  .msg{
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: rgb(221, 221, 221);
    margin-top: 20px;
    padding-bottom: 20px;
  }
  .name{
    width: 350px;
    font-size: 28px;
    color: rgb(102, 102, 102);
    padding-left: 20px;
  }
  .number{
    flex-direction: row;
    align-items: center;
  }
  .number_num{
    font-size: 30px;
    color: rgb(51, 51, 51);
  }
  .company{
    font-size: 28px;
    color: rgb(102, 102, 102);
  }
  .medical_examination_arrows{
    margin-left: 10px;
    width: 22px;
    height: 32px;
  }
  .information>.msg:last-child{
    border: none;
  }
</style>

