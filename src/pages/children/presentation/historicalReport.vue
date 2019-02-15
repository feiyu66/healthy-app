<template>
  <div class="box">
    <wxc-minibar title="历史健康报告"
        background-color="#ffffff"
        text-color="#000000"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
        >
        <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
        </div>
    </wxc-minibar>
    <scroller class="scroller" :style="scrollStyle">
      <div class="month_box" v-for="(item, index) in listData" :key='index'>
        <div class="month_title">
          <image v-if="item.moneth == 1" class="report_imgs" :src="getImgPath('report_one.png')"/>          
          <image v-if="item.moneth == 2" class="report_imgs" :src="getImgPath('report_two.png')"/>
          <image v-if="item.moneth == 3" class="report_imgs" :src="getImgPath('report_three.png')"/>          
          <!-- <text class="title_word">{{item.moneth}}</text> -->
        </div>
        <div class="items" v-for="(list, idx) in item.datas" :key='idx' @click="jump('generationReport', list.id, list.weekCount)">
            <text class="presentation_week">健康报告：运动第{{list.weekCount}}周</text>
            <image class="icon_back2" :src="getImgPath('icon_back2.png')"/>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import { WxcMinibar, Utils } from "weex-ui";
import { createLink, printLog, storage_getItem } from '../../../shared/utils'
import api from '../../../shared/request'
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
export default {
  components: {
    WxcMinibar
  },
  data () {
      return {
        mbrId: '',
        baseURL: '',
        drId: '15010520610-dr', // 医生id
        listData: [],
      }
  },
  created () {
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 90 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
    }
    this.reportList()
  },
  methods: {
    reportList: async function () {
        this.mbrId = await storage_getItem("mbrId");
        this.baseURL = await storage_getItem("newApiBase");
        console.log(this.mbrId, this.baseURL)
        let reportId = '001111-mbr'
        let params = {
            drId: this.drId
        }
        this.listData = []
        api.get(`${this.baseURL}health/report/list/${reportId}?`, params, data => {
          console.log(data)
          if (data.code == 200) {
            for (let i in data.data) {
              if (this.listData.indexOf(i) == -1) {
                this.listData.push(i)
              }
            }
            this.listData = this.listData.map(i => {
              let obj = {
                moneth: i,
                datas: []
              }
              for(let i in data.data) {
                if (i == obj.moneth) {
                  obj.datas = data.data[i]
                }
              }
              return obj
            })
            this.listData.map(item => {
              if (item.moneth == 1) {
                item.moneth = '第1个月(1次/周)'
              } else if (item.moneth == 2) {
                item.moneth = '第2~3个月(1次/2周)'
              } else if (item.moneth == 3) {
                item.moneth = '三个月以后(1次/月)'
              }
            })
          }
        })
    },
    jump(path, id, week) {
      if(!path) return;
      const navigator = weex.requireModule('navigator')
      navigator.push({
        url: createLink(path),
        animated: "true"
      })
      storage.setItem('reportId', id)
      storage.setItem('weekCount', week)
      // if (this.listData.length == 1) {
      //   storage.setItem('weekFlag', 1)
      // } else {
      //   storage.setItem('weekFlag', 2)
      // }
    },
    minibarLeftButtonClick () {}
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
    .scroller{
        background-color: rgb(255, 255, 255);
    }
    .month_box{
      margin-top: 20px;
      padding-left: 30px;
      border-bottom-width: 1px;
      border-bottom-color: rgb(225, 225, 225);
    }
    .report_imgs{
      width: 328px;
      height: 70px;
    }
    .items{
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      padding-bottom: 20px;
      border-bottom-width: 1px;
      border-bottom-color: rgb(225, 225, 225);
    }
    .items:last-child{
      border-bottom: none;
    }
    .presentation_week{
      font-size: 28px;
      color:rgb(102, 102, 102);
    }
    .icon_back2{
      width: 22px;
      height: 34px;
      margin-right: 30px;
    }
</style>
