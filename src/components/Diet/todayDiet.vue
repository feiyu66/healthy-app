<template>
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
</template>
<script>
import { WxcRadio, Utils } from "weex-ui";
import api from "../../shared/request";
import { storage_getItem, printLog } from "../../shared/utils";
const modal = weex.requireModule("modal");
const messaging = weex.requireModule("MessagingModule");
export default {
  components: {
    WxcRadio
  },
  data() {
    return {
      disableFlag: false,
      startData: "",
      num: null,
      questions: [],
      arr: [],
      btnFlag: false,
      btnStyle: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "750px",
        height: "100px"
      },
      baseURL: "",
      mbrId: ""
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
    this.getquestions();
  },
  methods: {
    getquestions: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      console.log(this.mbrId)
      this.startData = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
      let params = {
        date: this.startData,
        userId: this.mbrId
      };
      console.log(params)
      api.get(`${this.baseURL}health/diet/one?`, params, data => {
        if (data.code == "200") {
          this.questions = data.data.questions;
          this.questions.map(item => {
            if(item.chose == null) {
              this.disableFlag = false
              item.dietAnswers.map(list => {
                list.flag = false;
              });
            } else {
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
        }
      });
    },
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
          this.arr = this.arr.join(",")
        } else {
          this.btnFlag = false;
        }
      }
    },
    submission() {
      if (this.btnFlag) {
        var params =  {
            answers: this.arr,
            userId: this.mbrId,
            date: 0   //今天
          }
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
          } else {
            modal.toast({
              message: data.msg
            });
          }

          const refresh = new BroadcastChannel("refresh-home-evaluation");
          refresh.postMessage('refresh!')
        })
       }
    },
    wxcRadioListChecked(e) {
      this.checkedInfo = e;
    }
  }
};
</script>

<style scoped>
.todayDiet {
  background-color: #ffffff;
  border-top-color: #eeeeee;
  border-top-width: 1px;
}
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
  margin-bottom: 22px;
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.radio {
  flex-direction: row;
  margin-bottom: 30px;
}
.radio-box {
  flex-direction: row;
  align-items: center;
  margin-right: 150px;
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

