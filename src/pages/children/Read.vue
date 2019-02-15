<template>
    <div class="box">
        <wxc-minibar title="详情"
            background-color="#ffffff"
            text-color="#000000"
            right-text="历史必读"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;">
          <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
          </div>    
        </wxc-minibar>
        <div class="main">
            <div class="main" v-if="toolFlag">
                <web class="article" :src="url" @pagestart="onPageStart" @pagefinish="onPageFinish" @error="onError">
                </web>
                <div class="footer" @click="openMask">
                    <div v-if="seeFlag" class="seeBox">
                        <text class="foo">我已看完，开始答题</text>
                        <image class="icon_answer" :src="getImgPath('icon_answer.png')"/>
                    </div>
                    <div v-else class="seeBox">
                        <text class="foo">查看答案详情</text>
                    </div>
                </div>
            </div>
            <div v-else class="reserror">
                <text class="middle">{{tooltip}}</text>
            </div>
        </div>
        <wxc-mask :height="maskHeight"
            width="520"
            border-radius="20"
            duration="200"
            mask-bg-color="#FFFFFF"
            :has-animation="hasAnimation"
            :has-overlay="true"
            :overlay-can-close="false"
            :show-close="false"
            :show="show"
            @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <div class="demo-img">
                    <image class="icon_cancel" @click="wxcMaskSetHidden" :src="getImgPath('icon_cancel.png')"/>
                </div>
                <div class="Answer"><text class="Answer-title">请回答</text></div>
                <div class="question" style="width: 674px; marginLeft: 38px">
                    <text class="question-title" >{{questionTitle}}</text>
                    <div class="questionAnswer" ref='question' v-for="(item, index) in answer" :key='index'>
                        <div class="radio" @click="radioAnswer(index)">
                            <image v-if="num == index" class="uncheck" :src="getImgPath('checked.png')"/>
                            <image v-else class="uncheck" :src="getImgPath('uncheck.png')"/>
                        </div>
                        <div class="option">
                            <text class="options">{{item.option}}、</text>
                            <text class="answers">{{item.answer}}</text>
                        </div>
                        <div class="Result">
                            <image v-if="item.flag" class="icon_right" :src="getImgPath('icon_right.png')"/> 
                            <image v-if="item.active" class="icon_wrong" :src="getImgPath('icon_wrong.png')"/>
                        </div>
                    </div> 
                </div>
                <div class="mask">
                    <text class="know" v-if="knowFlag" @click="knowData">确定</text>
                    <text class="know" v-else @click="wxcMaskSetHidden">知道了</text>
                </div>
            </div>
        </wxc-mask>
        <wxc-mask height="350"
            width="480"
            border-radius="20"
            duration="200"
            mask-bg-color="#FFFFFF"
            :has-animation="corrAnimation"
            :has-overlay="true"
            :overlay-can-close="true"
            :show-close="false"
            :show="correctFlag"
            @wxcMaskSetHidden="CloseHidden">
            <div class="correctAnswer">
                <div class="demo-img">
                    <image class="icon_cancel" @click="CloseHidden" :src="getImgPath('icon_cancel.png')"/>
                </div>
                <div class="correctImg">
                    <image class="icon_correct" :src="getImgPath('icon_correct.png')"/>
                    <text class="correctWord">回答正确</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>
<script>
import { WxcMask, WxcMinibar, Utils } from "weex-ui";
import { createLink, storage_getItem, printLog } from "../../shared/utils";
import api from "../../shared/request";
export default {
  components: {
    WxcMask,
    WxcMinibar
  },
  data() {
    return {
      tooltip: "",
      toolFlag: false,
      show: false,
      hasAnimation: true,
      correctFlag: false, // 回答正确弹框提示
      corrAnimation: true,
      articleId: null, // 文章Id
      title: "", // 文章标题
      publishTime: "", // 发布时间
      origin: "", // 出处
      imageUrl: "", // 图片路径
      content: "", // 文章内容
      questionTitle: "", // 问题题目
      rightKey: null, // 问题答案
      answer: [],
      num: null,
      answerNum: null,
      seeFlag: true, // 是否答题
      knowFlag: false, // 是否进行答题
      baseURL: "",
      mbrId: "",
      maskHeight: 380
    };
  },
  created() {
    if (WXEnvironment.platform == "Web") {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() - 140 + "px"
      };
    } else {
      this.scrollStyle = {
        width: "750px",
        height: Utils.env.getPageHeight() + "px"
      };
    }

    this.getread();
    this.answer = [];
  },
  methods: {
    getread: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");

      console.log(this.mbrId, this.baseURL);
      this.url = `${this.baseURL}app-web/index.html#/previewarticle?tr=1&uid=${this.mbrId}`

      let params = {
        userId: this.mbrId
      };
      let start = new Date().getTime();
      api.get(`${this.baseURL}health/article/today?`, params, data => {
        let end = new Date().getTime();
        printLog(end - start);
        console.log(data);
        if (data.code == "200") {
          this.toolFlag = true;
          this.articleId = data.data.id;
          this.title = data.data.title;
          this.publishTime = data.data.publishTime.split(" ")[0];
          this.origin = data.data.origin;
          this.imageUrl = data.data.imageUrl;
          this.content = data.data.content;
          this.questionTitle = data.data.question.title;
          let n = Math.ceil(this.questionTitle.length / 15)
          this.maskHeight += 36 * n;
          this.rightKey = data.data.question.rightKey;
          let questionAnswer = data.data.question;
          let obj = {};
          obj.answer = questionAnswer.answerA;
          n = Math.ceil(obj.answer.length / 10)
          printLog(n)
          this.maskHeight += 32 * n;
          obj.option = "A";
          obj.active = false;
          obj.flag = false;
          this.answer.push(obj);
          let obj2 = {};
          obj2.answer = questionAnswer.answerB;
          n = Math.ceil(obj2.answer.length / 10)
          printLog(n)
          this.maskHeight += 32 * n;
          obj2.option = "B";
          obj2.active = false;
          obj2.flag = false;
          this.answer.push(obj2);
          let obj3 = {};
          obj3.answer = questionAnswer.answerC;
          n = Math.ceil(obj3.answer.length / 10)
          printLog(n)
          this.maskHeight += 32 * n;
          obj3.option = "C";
          obj3.active = false;
          obj3.flag = false;
          this.answer.push(obj3);
          let obj4 = {};
          obj4.answer = questionAnswer.answerD;
          n = Math.ceil(obj4.answer.length / 10)
          printLog(n)
          this.maskHeight += 32 * n;
          obj4.option = "D";
          obj4.active = false;
          obj4.flag = false;
          this.answer.push(obj4);
          if (data.data.isAnswered == 1) {
            // 已答题
            this.seeFlag = false;
            this.knowFlag = false;
            console.log(this.answer);
            if (data.data.answer == 1) {
              // 正确
              this.num = this.rightKey - 1;
              this.answer[this.rightKey - 1].flag = true;
            } else {
              this.num = data.data.chose - 1;
              this.answer[this.num].active = true;
              this.answer[this.rightKey - 1].flag = true;
            }
          } else {
            // 无答题
            this.seeFlag = true;
            this.knowFlag = true;
          }
        } else {
          this.toolFlag = false;
          this.tooltip = data.msg;
        }

        const dom = weex.requireModule("dom");
        dom.getComponentRect(this.$refs.question, option => {
          // got the component layout information
          printLog(option);
        });
      });
    },
    radioAnswer(index) {
      if (this.knowFlag) {
        this.num = index;
        this.answerNum = index + 1;
      }
    },
    knowData() {
      let params = {
        userId: this.mbrId,
        articleId: this.articleId,
        answer: this.answerNum
      };
      api.get(`${this.baseURL}health/article/today/answer?`, params, data => {
        console.log(data);
        if (data.code == 200) {
          this.seeFlag = false;
          this.knowFlag = false; //变更按钮为知道了
          this.answer[this.rightKey - 1].flag = true; //正确答案后显示对勾
          if (data.msg == "回答错误！") {
            this.answer[this.num].active = true;
          } else {
            this.answer[this.num].active = false;
            this.correctFlag = true;
            this.hasAnimation = true;
          }

          const refresh = new BroadcastChannel("refresh-home-evaluation");
          refresh.postMessage("refresh!");
        }
      });
    },
    CloseHidden() {
      this.correctFlag = false;
    },
    openMask(e) {
      this.show = true;
      this.hasAnimation = true;
    },
    wxcMaskSetHidden() {
      this.show = false;
    },
    jump(path) {
      if (!path) return;
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    },
    toBack() {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    minibarLeftButtonClick() {
      // let navigator = weex.requireModule("navigator");
      // navigator.pop({
      //   animated: "true"
      // });
    },
    minibarRightButtonClick() {
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink("historyRead"),
        animated: "true"
      });
    },
    onPageStart (event) {
      // page start load
      printLog("onPageStart")
      this.startload = new Date().getTime();
    },
    onPageFinish (event) {
      // page finish load
      let end = new Date().getTime();
      printLog("onPageFinish")
      printLog(end-this.startload)
    },
    onError (event) {
      // page load error
      printLog("onError")
      printLog(event)
    },
  }
};
</script>
<style scoped lang="scss">
@import "../../../style/styles.scss";
.icon_back {
  width: 40px;
  height: 40px;
}
.header {
  height: 100px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
}
.text {
  flex: 2;
  height: 100px;
  justify-content: center;
  align-items: center;
}
.text-one {
  flex: 2;
  justify-content: flex-start;
  align-items: center;
  margin-left: 20px;
}
.text-password {
  flex: 5;
  font-size: 40px;
}
.title {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  color: #02b3ed;
  font-size: 40px;
}
.main {
  position: relative;
  flex: 1; 
  width: 750px;
}
.data-origin {
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
}
.data,
.origin {
  color: #999999;
  font-size: 26px;
}
.origin {
  margin-left: 30px;
}
.article {
  width:750px;
  flex: 1;
}
.article-con {
  font-size: 28px;
  color: #666666;
}
.seeBox {
  flex-direction: row;
  justify-content: center;
}
.reserror {
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.middle {
  color: #999999;
  font-size: 32px;
}
.footer {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 750px;
  height: 100px;
  background-color: #02b3ed;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.foo {
  color: rgb(255, 255, 255);
  font-size: 32px;
}
.icon_answer {
  width: 44px;
  height: 48px;
  margin-left: 30px;
}
.middle {
  color: #999999;
}
// 弹层
.demo-img {
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
  margin-right: 20px;
}
.icon_cancel {
  width: 36px;
  height: 36px;
}
.Answer {
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
.Answer-title {
  flex-direction: row;
  font-size: 34px;
  color: rgb(51, 51, 51);
}
.question {
  margin-bottom: 20px;
}
.question-title {
  width: 440px;
  margin-bottom: 20px;
  font-size: 30px;
  color: rgb(102, 102, 102);
}
.questionAnswer {
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
}
.uncheck {
  width: 30px;
  height: 30px;
  margin-right: 20px;
}
.option {
  flex-direction: row;
}
.options {
  font-size: 28px;
  color: rgb(102, 102, 102);
}
.answers {
  max-width: 310px;
  font-size: 28px;
  color: rgb(102, 102, 102);
}
.icon_right,
.icon_wrong {
  width: 30px;
  height: 30px;
  margin-left: 30px;
}
.mask {
  width: 520px;
  height: 85px;
  align-items: center;
  justify-content: center;
  border-top-color: rgb(238, 238, 238);
  border-top-width: 1px;
}
.know {
  font-size: 30px;
  color: rgb(2, 179, 237);
}
.correctImg {
  flex-direction: column;
  align-items: center;
}
.icon_correct {
  width: 163px;
  height: 163px;
}
.correctWord {
  margin-top: 40px;
  font-size: 40px;
  color: rgb(2, 179, 237);
}
</style>

