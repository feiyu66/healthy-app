<template>
    <div class="uesterday">
        <div v-if="recordFlag" class="recorded">
            <scroller :style="scrollStyle">
                <div class="main-title">
                    <div class="explain">
                        <image class="icon_record" :src="getImgPath('icon_record.png')"/>
                        <text class="word">已记录</text>
                    </div>
                    <text class="data">记录时间：{{recordingTime}}</text>
                </div>
                <div style="backgroundColor: rgb(255, 255, 255)">
                    <div style="width: 712px; marginLeft: 38px;">
                        <div class="diet" v-for="(item, index) in questions" :key='index'>
                            <text class="title">{{item.questionNum}}.{{item.questionName}}</text>
                            <div class="radio">
                                <div v-for="(list, index) in item.dietAnswers" :key='index' class="radio-box">
                                    <div class='yes'>
                                        <image v-if="item.chose == list.id" class="gray_box" :src="getImgPath('select_gray.png')"/>   
                                        <image v-else class="selectImg" :src="getImgPath('gray_box.png')"/> 
                                    </div>
                                    <text class="text-on">{{list.value}}</text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroller>
        </div>
        <div class="todayDiet" style="position: relative;">
            <scroller class="scroller" :style="scrollStyle">
                <div class="main" style="width: 674px; marginLeft: 38px; marginBottom: 98px;">
                    <div class="diet" v-for="(item, index) in questions" :key='index'>
                        <text class="title">{{item.questionNum}}.{{item.questionName}}</text>
                        <div class="radio">
                            <div @click="checkBox(item.questionNum, list.id)" v-for="(list, index) in item.dietAnswers" :key='index' class="radio-box">
                                <div class='yes'>
                                    <image v-if="!list.flag" class="gray_box" :src="getImgPath('gray_box.png')"/>   
                                    <image v-else class="selectImg" :src="getImgPath('select.png')"/> 
                                </div>
                                <text class="text-on">{{list.value}}</text>
                            </div>
                        </div>
                    </div>
                </div>
            </scroller>
        <div style="position: absolute;bottom: 0;width: 750px;height:100px;" class="submission">
          <text class="btn" :class="[btnFlag == true ? 'btn-on' : '']" @click="submission">提交</text>
        </div>
        </div>
    </div>
</template>
<script>
import { Utils } from "weex-ui";
import api from "../../shared/request";
import { storage_getItem, printLog } from "../../shared/utils";
const modal = weex.requireModule("modal");
const messaging = weex.requireModule("MessagingModule");
const storage = weex.requireModule("storage");
export default {
  data() {
    return {
      recordingTime: '',
      questions: [],
      arr: [],
      startData: "",
      baseURL: "",
      mbrId: "",
      recordFlag: false,
      btnFlag: false,
      disableFlag: false
    };
  },
  created() {
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 200 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 100 + "px"
      };
    }
    this.getquestions()
  },
  methods: {
    checkBox(questionId, answersId) {
      if(this.disableFlag){
        this.btnFlag = false;
      } else {
        this.questions[questionId - 1].dietAnswers.map(item => {
          if (item.id == answersId) {
            item.flag = true;
          } else {
            item.flag = false;
          }
          return;
        });
        this.$forceUpdate();
        this.arr = [];
        this.questions.map(item => {
          item.dietAnswers.map(list => {
            if (list.flag) {
              this.arr.push(list.id);
            }
          });
        });
        if (this.arr.length == this.questions.length) {
          this.btnFlag = true;
          this.arr = this.arr.join(",");
        } else {
          this.btnFlag = false;
        }
      }
    },
    submission() {
      if (this.btnFlag) {
        var params = {
          answers: this.arr,
          userId: this.mbrId,
          date: 1 //昨天
        };
        api.jsonpost(
          `${this.baseURL}health/diet/upload`,
          JSON.stringify(params),
          data => {
            if (data.code == 200) {
              this.btnFlag = false
              modal.toast({
                message: data.msg
              });
              this.getquestions()
              // this.$on('bridge', '123name')
              this.$emit('submitAdd', true)
            } else {
              modal.toast({
                message: data.msg
              });
            }
          }
        );
      }
    },
    getquestions: async function() {
      this.recordingTime = ''
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.startData = new Date(new Date().setDate(new Date().getDate() - 1) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      let newDate = new Date(this.startData)
      let Hours = newDate.getHours()
      let Minute = newDate.getMinutes()
      Hours = Hours < 10 ? '0' + Hours : Hours // 小时
      Minute = Minute < 10 ? '0' + Minute : Minute // 分钟
      // this.recordingTime = this.startData + '   ' + Hours + ':' + Minute
      let params = {
        date: this.startData,
        userId: this.mbrId
      };
      api.get(`${this.baseURL}health/diet/one?`, params, data => {
        console.log(data);
        if (data.code == 200) {
          data.data.questions.map(item => {
            this.questions = data.data.questions;
            if (item.chose == null) {
              this.recordFlag = false;
              this.disableFlag = false
              item.dietAnswers.map(list => {
                list.flag = false;
              });
            } else {
              this.recordingTime = data.data.createTime.split(':')[0] + ':' + data.data.createTime.split(':')[1]
              this.recordFlag = true;
              this.disableFlag = true
              for(let i in item.dietAnswers){
                if (item.chose == i) {
                  item.dietAnswers[i].flag = true
                } else {
                  item.dietAnswers[i].flag = false
                }
              }
            }
          });
          this.$forceUpdate();
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.uesterday {
  border-top-color: #eeeeee;
  border-top-width: 1px;
}
.todayDiet {
  background-color: rgb(255, 255, 255);
}
.main-title {
  height: 120px;
  background-color: #ffffff;
  flex-direction: column;
  justify-content: space-around;
  border-top-width: 1px;
  border-top-color: #eeeeee;
  margin-bottom: 10px;
}
.explain {
  flex-direction: row;
  align-items: center;
  margin-left: 40px;
}
.icon_record {
  width: 44px;
  height: 50px;
}
.word {
  font-size: 30px;
  color: rgb(2, 179, 237);
  margin-left: 12px;
}
.data {
  font-size: 24px;
  color: rgb(51, 51, 51);
  margin-left: 40px;
}
/*.subject {
  background-color: #ffffff;
}*/
.diet {
  border-bottom-width: 1px;
  border-bottom-color: rgb(238, 238, 238);
  flex-direction: column;
}
.diet:last-child {
  border: none;
}
.title {
  margin-top: 30px;
  margin-left: 20px;
  margin-bottom: 22px;
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.radio {
  flex-direction: row;
  margin-left: 20px;
  margin-bottom: 30px;
}
.radio-box {
  flex-direction: row;
  align-items: center;
  margin-right: 120px;
}
.yes {
  margin-right: 20px;
}
.gray_box,
.selectImg {
  width: 35px;
  height: 35px;
}
.text-on {
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.submission {
  height: 98px;
}
.btn {
  height: 98px;
  background-color: #cccccc;
  text-align: center;
  line-height: 98px;
  font-size: 38px;
}
.btn-on {
  background-color: #02b3ed;
  color: rgb(255, 255, 255);
}
</style>

