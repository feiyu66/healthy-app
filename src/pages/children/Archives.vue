<template>
  <div class="box">
    <div class="head" style="position: relative;">
        <image style="position: absolute; left: 0; top: 0;" class="backg" :src="getImgPath('bg.png')"/>
        <div class="portrait_img" style="position: absolute;">
            <image class="head_portrait" :src="getImgPath('dialog.png')"/>
        </div>
        <div class="backImg">
            <div class="block" @click="minibarLeftButtonClick">
                <image class="icon_back" :src="getImgPath('icon_back_white.png')"/>
            </div>
        </div>
    </div>
    <div class="main">
        <div class="message">
            <text class="msg_name">张迪 （女）</text>
            <text class="msg_age">27岁/170cm/50kg</text>
        </div>
        <div class="item_box">
            <div class="item" @click="jump('message')">
                <image class="personal_details" :src="getImgPath('personal_details.png')"/>
                <text class="item_word">个人信息</text>
            </div>
            <div class="item" @click="jump('examination')">
                <image class="personal_details" :src="getImgPath('medical_examination.png')"/>
                <text class="item_word">体检指标</text>
            </div>
            <div class="item" @click="jump('indicatorMonitoring')">
                <image class="personal_details" :src="getImgPath('index.png')"/>
                <text class="item_word">指标监测</text>
            </div>
        </div>
        <div class="data_record">
            <div class="record_title">
                <image class="health_img" :src="getImgPath('health.png')"/>
                <text class="title_word">健康数据记录</text>
            </div>
            <scroller :style="scrollStyle">
                <div v-if="tooltipFlag" style="marginBottom: 40px;">
                    <div class="record_box" v-for="(item, index) in timeData" :key='index'>
                        <div class="data_frame">
                            <text class="data">{{item.checkTime}}</text>
                        </div>
                        <div v-if="item.type == 1" class="record_message" style="position:relative;">
                            <div style="position: absolute; left: -20px; top: 20px;"><div class="triangle_border_left"><span class="border_span"></span></div></div>
                            <div class="record_details">
                                <image class="message_img" :src="getImgPath('weight.png')"/>
                                <div class="details_msg">
                                    <text class="details_title">体重监测记录</text>
                                    <div class="specific">
                                        <text class="specific_name">体重：{{item.weight}}kg</text>
                                        <text class="specific_name">BMI：{{item.bmi}}kg/m2</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="item.type == 2" class="record_message1" style="position:relative;">
                            <div style="position: absolute; left: -20px; top: 20px;"><div class="triangle_border_left"><span class="border_span"></span></div></div>
                            <div class="record_details">
                                <image class="message_img" :src="getImgPath('bp.png')"/>
                                <div class="details_msg">
                                    <text class="details_title">血压监测记录</text>
                                    <div class="specific">
                                        <text class="specific_name">收缩压：{{item.sbp}}mmHg</text>
                                        <text class="specific_name">舒张压：{{item.dbp}}mmHg</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="item.type == 3" class="record_message" style="position:relative;">
                            <div style="position: absolute; left: -20px; top: 20px;"><div class="triangle_border_left"><span class="border_span"></span></div></div>
                            <div class="record_details">
                                <image class="message_img" :src="getImgPath('glu.png')"/>
                                <div class="details_msg">
                                    <text class="details_title">血糖监测记录</text>
                                    <div class="specific">
                                        <text class="specific_name">空腹：{{item.fbg}}mmol/L</text>
                                        <text v-if="item.pbg !== ''" class="specific_name">餐后：{{item.pbg}}mmol/L</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <text v-else class="tooltipWord">您还没有记录健康数据</text>
            </scroller>
        </div>
    </div>
  </div>
</template>
<script>
import { WxcPopup, Utils, WxcPopover } from 'weex-ui'
import { createLink, storage_getItem } from '../../shared/utils'
import api from '../../shared/request'
const modal = weex.requireModule("modal");
export default {
  components: {
    WxcPopover
  },
  data () {
    return {
      mbrId: '',
      baseURL: '',
      timeData: [],
      tooltipFlag: false
    }
  },
  created () {
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 723 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
    }
    this.timeLineData()
  },
  methods: {
    timeLineData: async function () {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      let userId = '13978100708-mbr'
    //   let userId = '13965100566-mbr'
      console.log(this.mbrId, this.baseURL)
      let params = {}
      api.get(`${this.baseURL}health/healthCheck/timeline/${userId}`, params, data => {
        console.log(data)
        if (data.data.length == 0) {
            this.tooltipFlag = false
        } else {
            this.tooltipFlag = true
            data.data.map(item => {
            let newDate = new Date(item.checkTime);
            let Month = newDate.getMonth() + 1
            let Data = newDate.getDate()
            let Hours = newDate.getHours()
            let Minute = newDate.getMinutes()
            let Seconds = newDate.getSeconds()
            Month = Month < 10 ? '0' + Month : Month // 月
            Data = Data < 10 ? '0' + Data : Data // 日
            Hours = Hours < 10 ? '0' + Hours : Hours // 小时
            Minute = Minute < 10 ? '0' + Minute : Minute // 分钟
            Seconds = Seconds < 10 ? '0' + Seconds : Seconds // 秒
            item.checkTime = newDate.getFullYear() + '-' + Month + '-' + Data + ' ' + Hours + ':' + Minute + ':' + Seconds
            if (item.type == 1) {
                item.bmi = ((item.weight / (item.height * item.height)) *10000).toFixed(2)
            }
            if (item.type == 3 && item.pbg == null) {
                item.pbg = ''
            }
            })
            this.timeData = data.data
        }
      })
    },
    jump (path) {
      if (!path) return;
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    },
    minibarLeftButtonClick () {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    minibarRightButtonClick () {
       
    }
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
    .head{
        height: 270px;
    }
    .backg{
        width: 750px;
        height: 270px;
    }
    .portrait_img{
        width: 128px;
        height: 128px;
        background-color: rgb(255, 255, 255);
        border-radius: 999px;
        box-shadow: 5px 5px 5px #cccccc;
        top: 130px;
        left: 50%;
        margin-left: -64px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .head_portrait{
        width: 116px;
        height: 116px;
    }
    .backImg{
        height: 100px;
        flex-direction: row;
        align-items: center;
    }
    .block{
        width: 100px;
        height: 100px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .icon_back{
        width: 40px;
        height: 40px;
    }
    .message{
        background-color: rgb(255, 255, 255);
        flex-direction: column;
        align-items: center;
    }
    .msg_name{
        margin-top: 14px;
        font-size: 34px;
        color:rgb(51, 51, 51);
    }
    .msg_age{
        margin-top: 30px;
        font-size: 26px;
        color:rgb(102, 102, 102);
    }
    .item_box{
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        background-color: rgb(255, 255, 255);
        padding-top: 50px;
        padding-bottom: 20px;
    }
    .item{
        flex-direction: column;
        align-items: center;
    }
    .personal_details{
        width: 94px;
        height: 94px;
    }
    .item_word{
        font-size: 26px;
        color:rgb(51, 51, 51);
        margin-top: 10px;
    }
    .data_record{
        margin-top: 10px;
        background-color: rgb(255, 255, 255);
    }
    .record_title{
       margin-left: 30px;
       margin-bottom: 30px;
       border-bottom-width: 1px;
       border-bottom-color: rgb(221, 221, 221); 
       margin-top: 20px;
       padding-bottom: 20px;
       flex-direction: row;
       align-items: center;
    }
    .health_img{
        width: 40px;
        height: 38px;
    }
    .title_word{
        font-size: 30px;
        color:rgb(51, 51, 51);
        margin-left: 30px;
    }
    .record_box{
        margin-left: 100px;
        border-left-width: 1px;
        border-left-color: rgb(170, 170, 170);
    }
    .data_frame{
        width: 310px;
        height: 50px;
        flex-direction: row;
        align-items: center;
        border-width: 1px;
        border-color:rgb(221, 221, 221);
        border-radius: 99px;
        margin-top: 30px;
        margin-left: -30px;
        background-color: rgb(255, 255, 255);
    }
    .data::before {
        content: "●";
        color: #04b4ef;
        margin-right: 20px;
        margin-left: 20px;
    }
    .data{
        font-size: 24px;
        color: rgb(2, 179, 237);
    }
    .record_message, .record_message1{
        height: 100px;
        border-radius: 25px;
        background-color: rgb(245, 245, 245);;
        border-width: 1px;
        border-color: rgb(221, 221, 221);
        margin-left: 35px;
        margin-top: 15px;
        margin-bottom: 20px;
        flex-direction: row;
        align-items: center;
    }
    .record_message{
        width: 520px;
    }
    .record_message1{
        width: 610px;
    }
    .triangle_border_left{
        width:0;
        height:0;
        border-width:20px 20px 20px 0;
        border-style:solid;
        border-color:transparent #cccccc transparent transparent;/*透明 灰 透明 透明 */
        position: relative;
        // top: 15px;
        // left: -20px;
    }
    .border_span{
        display: block;
        width:0;
        height:0;
        border-width:20px 20px 20px 0;
        border-style:solid;
        border-color:transparent #f5f5f5 transparent transparent;/*透明 灰 透明 透明 */
        position: absolute;
        top: -20px;
        left: 1px;
    }
    .record_details{
        flex-direction: row;
        align-items: center;
    }
    .message_img{
        width: 65px;
        height: 65px;
        margin-left: 15px;
        margin-right: 15px;
    }
    .details_msg{
        flex-direction: column;
    }
    .details_title{
        font-size: 26px;
        color: rgb(51, 51, 51);
    }
    .specific{
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
    }
    .specific_name{
        font-size: 24px;
        color: rgb(102, 102, 102);
        margin-right: 20px;
    }
    .tooltipWord{
        text-align: center;
        font-size: 28px;
        color: #ADADAD;
        margin-top: 200px;
    }
</style>


