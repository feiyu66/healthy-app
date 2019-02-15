<template>
  <div class="box">
    <div class="medical_history" v-for="(item, index) in historyData" :key='index'>
      <text class="time">{{item.createTime}}</text>
      <div class="history_title" style="width: 95%; marginLeft: 5%;">
        <image class="illness" :src="getImgPath('illness.png')"/>
        <text class="word">疾病史：</text>
        <text v-if="diseaseFlag" class="diseaseData">{{item.disease}}</text>
        <text v-else class="noWord">无</text>
      </div>
      <div class="history_title" style="width: 95%; marginLeft: 5%;">
        <image class="illness" :src="getImgPath('surgery.png')"/>            
        <text class="word">手术史：</text>
        <text v-if="surgeryFlag" class="diseaseData">{{item.surgery}}</text>
        <text v-else class="noWord">无</text>
      </div>
    </div>
    <div class="tooltip" style="width: 90%; marginLeft: 5%;">
      <image class="reminder" :src="getImgPath('reminder.png')"/>
      <text class="too_word">如果完善更新，可点击app底部导航--咨询，联系您的医护团队为您更新。</text>
    </div>
  </div>
</template>
<script>
import api from '../../shared/request'
import { storage_getItem, printLog } from "../../shared/utils";
const modal = weex.requireModule("modal");
const messaging = weex.requireModule("MessagingModule");
export default {
  data () {
    return {
      baseURL: "",
      mbrId: "",
      historyData: [],
      diseaseFlag: false, // 疾病史
      surgeryFlag: false, // 手术史
    }
  },
  created () {
    this.medicalHistoryData()
  },
  methods: {
    medicalHistoryData: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      let userId = '13965100566-mbr'
      console.log(this.mbrId, this.baseURL)
      let params = {
        // userId: '13978100708-mbr'
      };
      api.get(`${this.baseURL}health/healthCheck/medicalHistory/${userId}`, params, data => {
        console.log(data)
        for (let i in data.data) {
          if (i == 'medicalHistory') {
            data.data[i].map(item => {
              let newDate = new Date(item.createTime);
              let Month = newDate.getMonth() + 1
              let Data = newDate.getDate()
              Month = Month < 10 ? '0' + Month : Month // 月
              Data = Data <10 ? '0' + Data : Data // 日
              item.createTime = newDate.getFullYear() + '年' + Month + '月' + Data + '日'
              item.disease = (item.disease.split(',').slice(0, -1)).join('、')
              item.surgery = (item.surgery.split(',').slice(0, -1)).join('、')
              this.diseaseFlag = item.disease == '' ? false : true
              this.surgeryFlag = item.surgery == '' ? false : true
            })
            this.historyData = data.data[i]
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .box{
    background-color: rgb(255, 255, 255);
    flex: 1;
    margin-top: 10px;
  }
  .time{
    padding-left: 30px;
    font-size: 32px;
    color: rgb(51, 51, 51);
    border-bottom-width: 1px;
    border-bottom-color: rgb(221, 221, 221);
    margin-top: 30px;
    padding-bottom: 30px;
  }
  .medical_history{
    border-bottom-width: 1px;
    border-bottom-color: rgb(221, 221, 221);
  }
  .history_title{
    border-bottom-width: 1px;
    border-bottom-color: rgb(221, 221, 221);
    flex-direction: row;
    margin-top: 20px;
    padding-bottom: 20px;
  }
  .medical_history>.history_title:last-child{
    border: none;
  }
  .illness{
    width: 40px;
    height: 38px;
  }
  .word{
    font-size: 30px;
    color: rgb(68, 68, 68);
    margin-left: 10px;
  }
  .diseaseData, .noWord{
    width: 500px;
    margin-left: 20px;
    font-size: 28px;
    color: rgb(2, 179, 237);
  }
  .tooltip{
    margin-top: 60px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .reminder{
    width: 36px;
    height: 34px;
    margin-right: 10px;
  }
  .too_word{
    width: 620px;
    font-size: 26px;
    color: rgb(102, 102, 102);
  }
</style>

