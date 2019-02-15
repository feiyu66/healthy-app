<template>
    <div class="box">
        <wxc-minibar title="日志详情"
            background-color="#ffffff"
            text-color="#000000"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;"></wxc-minibar>
        <div class="main">
            <scroller class="scroller" :style="scrollStyle">
            <div class="main-data">
                <text class="data">{{date}}</text>
            </div>
            <div style="width: 674px; marginLeft: 38px;">
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
import { WxcMinibar, Utils } from "weex-ui";
import { printLog, storage_getItem } from "../../../shared/utils";
import api from "../../../shared/request";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
export default {
  components: { WxcMinibar },
  data() {
    return {
      questions: [],
      arr: [],
      btnFlag: false,
      date: "",
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
        height: Utils.env.getPageHeight() - 112 + "px"
      };
    }
    this.getquestions();
  },
  destroyed: function () {
    const reset = new BroadcastChannel("reset-historylog-nav");
    reset.postMessage('reset!')
  },
  methods: {
    getquestions: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.date = await storage_getItem("date");
      console.log(this.mbrId, this.baseURL);

      let params = {
        date: this.date,
        userId: this.mbrId
      };
      api.get(`${this.baseURL}health/diet/one?`, params, data => {
        console.log(data);
        if (data.code == "200") {
          this.questions = data.data.questions;
          this.questions.map(item => {
            item.dietAnswers.map(list => {
              list.flag = false;
            });
          });
        }
      });
    },
    checkBox(questionId, answersId) {
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
          } else {
            modal.toast({
              message: data.msg
            });
          }
        })
      }
    },
    minibarLeftButtonClick() {},
    minibarRightButtonClick() {
      modal.toast({ message: "click rightButton!", duration: 1 });
    }
  }
};
</script>
<style>
.wxc-minibar {
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
}
</style>
<style lang="less" scoped>
.main {
  flex: 1;
}
.main-data {
  background-color: #eeeeee;
  height: 80px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.data {
  color: rgb(51, 51, 51);
  margin-right: 30px;
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
  border-radius: 5px;
}
.btn-on {
  background-color: #02b3ed;
  color: rgb(255, 255, 255);
}
</style>


