<template>
    <div class="box">
        <wxc-minibar title="详情"
            background-color="#ffffff"
            text-color="#000000"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;">
          <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
          </div> 
        </wxc-minibar>

          <web class="main" :src="url" @pagestart="onPageStart" @pagefinish="onPageFinish" @error="onError">
          </web>
          <div class="mainMask" :style="maskStyle" v-if="isFinished == false" @click="onclick"> 
          </div>

    </div>
</template>
<script>
import { WxcMinibar, Utils } from "weex-ui";
import api from "../../../shared/request";
import { createLink, printLog, storage_getItem } from "../../../shared/utils";
export default {
  components: { WxcMinibar },
  data() {
    return {
      articleId: 0, // 文章id
      sectionId: 0, // 板块id
      baseURL: "",
      mbrId: "",
      url: "",
      isFinished: false //ios在第二次渲染时会把网页代码显示出来，在此bug未修复前用个东西挡一挡
    };
  },
  created() {
    if (WXEnvironment.platform == "Web") {
      this.maskStyle = {
        height: Utils.env.getPageHeight() - 100 + "px"
      };
    } else {
      this.maskStyle = {
        height: Utils.env.getPageHeight() + 50 + "px"
      };
    }
    this.getarticle()
  },
  methods: {
    getarticle: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.sectionId = await storage_getItem("sectionId");
      this.articleId = await storage_getItem("articleId");
      printLog(this.mbrId)
      printLog(this.baseURL)
      printLog(this.sectionId)
      printLog(this.articleId)
      this.sectionId = this.sectionId ? this.sectionId : "2";
      this.articleId = this.articleId ? this.articleId : "111";

      this.url = `${this.baseURL}app-web/index.html#/previewarticle?sid=${this.sectionId}&aid=${this.articleId}&uid=${this.mbrId}`

    //   let params = {
    //   userId: this.mbrId
    // };
    // api.get(`${this.baseURL}health/article/${this.sectionId}/${this.articleId}?`,
    //   params,
    //   data => {
    //     console.log(data);
    //     if (data.code == 200) {
    //       this.msgFlag = true;
    //       this.title = data.data.title;
    //       this.publishTime = data.data.publishTime;
    //       this.origin = data.data.origin;
    //       this.imageUrl = data.data.imageUrl;
    //       this.content = data.data.content;
    //     } else {
    //       this.tooltip = data.tooltip;
    //       this.msgFlag = false;
    //     }
    //   }
    // );
    },
    onPageStart (event) {
      // page start load
      printLog("page start")
    },
    onPageFinish(event) {
      printLog("page finished")
      var isiOSAssets = event.url.indexOf('file:///') >= 0 && event.url.indexOf('dl_mbr.app') > 0
      if (!isiOSAssets)   //这里会回调article.weex.min.js加载完毕，bug未修复前加判断
        this.isFinished = true;
    },
    onError (event) {
      // page load error
      printLog("page load error")
    },
    onclick (event) {
      
    },
    minibarLeftButtonClick() {
      // let navigator = weex.requireModule("navigator");
      // navigator.pop({
      //   animated: "true"
      // });
    },
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
<style scoped lang="scss">
@import "../../../../style/styles.scss";
.icon_back{
  width: 40px;
  height: 40px;
}
.main {
  width: 750px;
  flex: 1;
}
.mainMask {
  width: 750px;
  flex: 1;
  position:absolute;
  bottom:0; 
  background-color:#fff
}
.article {
  flex: 1;
  margin-left: 38px;
  margin-right: 38px;
}
.head {
  margin-top: 30px;
  margin-bottom: 20px;
}
.title {
  font-size: 40px;
  color: #02b3ed;
  text-align: center;
}
.tip {
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
}
.data,
.origin {
  font-size: 26px;
  color: #666666;
}
.origin {
  margin-left: 50px;
}
.imageUrl {
  width: 674px;
  height: 300px;
}
.content {
  margin-top: 30px;
}
.word {
  font-size: 28px;
  color: rgb(51, 51, 51);
}
.reserror {
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.middle {
  color: #999999;
}
</style>


