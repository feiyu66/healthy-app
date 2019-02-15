<template>
    <div class="box">
            <list class="scroller" :style="listStyle">
                <refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
                    <!-- <div class="indicator-text">
                        <image class="down" :src="getImgPath('down.png')"/> 
                        <text style="font-size: 30px;color: #999999;">正在刷新...</text>
                    </div> -->
                    <loading-indicator class="indicator"></loading-indicator>
                </refresh>
                <cell>
                    <div class="logoImg">
                        <div class="motion" @click="goSport()">
                            <image class="sports" :src="getImgPath('sports.png')"/> 
                            <text class="motionWord" >论科学运动</text>
                        </div>
                        <div class="diet" @click="goDiet()">
                            <image class="sports" :src="getImgPath('diet.png')"/> 
                            <text class="motionWord" >论健康饮食</text>
                        </div>
                    </div>
                </cell>
                <cell>
                    <text class="tip">最新健康资讯</text>
                </cell>
                <cell class="item" v-for="(item, index) in datas" :key='index' @click="jump('article', item.id)">
                    <div class="information">
                        <div class="logo">
                            <image class="fold_img" :src="item.imageUrl + '?x-oss-process=style/dl-m-style'"/>
                        </div>
                        <div class="details">
                            <text class="details-title">{{item.title}}</text>
                            <div class="data_sum">
                                <text class="date">{{item.publishTime ? item.publishTime.split(' ')[0] :""}}</text>
                                <div class="browse">
                                    <image class="icon_eye" :src="getImgPath('icon_eye.png')"/>
                                    <text class="sum">浏览：{{item.views}}人</text>
                                </div>
                            </div>
                        </div>
                    </div>
                </cell>
                <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                    <!-- <loading-indicator class="indicator"></loading-indicator> -->
                    <div class="indicator-text">
                        <image v-if="downFlag" class="down" :src="getImgPath('upward.png')"/> 
                        <text style="color: #999999;">{{loadingWord}}</text>
                    </div>
                </loading>
            </list>
                <wxc-loading :show="isLoading"
              ></wxc-loading>
        <div class="header">
            <div class="statusbar" v-if="androidFakeStatusbar"></div>
            <text style="display: -webkit-flex;" class="header-text">论健</text>
        </div>
    </div>
</template>
<script>
import { Utils, WxcLoading } from "weex-ui";
import { createLink, printLog } from "../../shared/utils";
import api from "../../shared/request";
const storage = weex.requireModule("storage");
let modal = weex.requireModule("modal");
export default {
  name: "Onhealth",
  components: {
    WxcLoading
  },
  data() {
    return {
      loadinging: false,
      refreshing: false,
      loadingWord: "加载更多...",
      downFlag: true,
      datas: [],
      pageNum: 1,
      baseURL: "",
      mbrId: "",
      isLoading: false
    };
  },
  created() {
    printLog("PageHeight")
    printLog(Utils.env.getPageHeight())
    if (WXEnvironment.platform === 'android') {
      this.androidFakeStatusbar = true;
      this.listStyle = { height: Utils.env.getPageHeight() - 200 + "px" };
      this.listStyle['margin-top'] = "130px"
    }else {
      this.androidFakeStatusbar = false;
      this.listStyle = { height: Utils.env.getPageHeight() - 200 + "px" };
      this.listStyle['margin-top'] = "94px"
    }
    this.mbrId = weex.config.mbrId ? weex.config.mbrId : "13690000001-mbr";
    this.birth = weex.config.birth ? weex.config.birth : "1988-07-08";
    this.oldApiBase = weex.config.oldApiBase ? weex.config.oldApiBase : "http://47.93.97.118:8088/dl_biz/rest/";
    this.newApiBase = weex.config.newApiBase ? weex.config.newApiBase : "http://test.dlcaring.com/";
    storage.setItem("mbrId", this.mbrId);
    storage.setItem("birth", this.birth);
    storage.setItem("oldApiBase", this.oldApiBase);
    storage.setItem("newApiBase", this.newApiBase);

    printLog(this.mbrId);
    printLog(this.newApiBase);
    printLog(this.birth);
    let params = {
      userId: this.mbrId,
      pageNum: this.pageNum
    };


    this.isLoading = true;
    let start = new Date().getTime();
    api.get(`${this.newApiBase}health/articles/1?`, params, data => {
      let end = new Date().getTime();
      printLog(end - start);
      this.isLoading = false;
      printLog(data);
      //this.refreshing = false;
      if (data.code == 200) {
        this.datas = data.data.datas;
      }
    });
  },
  methods: {
    onloading(event) {
      console.log("loading");
      this.loadinging = true;
      setTimeout(() => {
        this.pageNum += 1;
        let params = {
          userId: this.mbrId,
          pageNum: this.pageNum
        };
        api.get(`${this.newApiBase}health/articles/1?`, params, data => {
          printLog(data);
          if (data.code == 200) {
            data.data.datas.map(item => {
              this.datas.push(item);
            });
            this.downFlag = true;
          } else {
            this.downFlag = false;
            this.loadingWord = "已加载完毕 ~";
          }
        });
        this.loadinging = false;
      }, 2000);
    },
    onrefresh(event) {
      console.log("refresh");
      this.refreshing = true;
      this.pageNum = 1;
      setTimeout(() => {
        let params = {
          userId: this.mbrId,
          pageNum: this.pageNum
        };
        api.get(`${this.newApiBase}health/articles/1?`, params, data => {
          console.log(data);
          if (data.code == 200) {
            this.datas = [];
            this.datas = data.data.datas;
          }
        });
        this.refreshing = false;
      }, 2000);
    },
    onpullingdown(event) {
      console.log("刚开始下拉....");
    },
    jump(path, articleId) {
      if (!path) return;
      storage.setItem("sectionId", "1");
      storage.setItem("articleId", articleId);
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    },
    goSport() {
      storage.setItem("sectionId", "2");
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink("article_list"),
        animated: "true"
      });
    },
    goDiet() {
      storage.setItem("sectionId", "3");
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink("article_list"),
        animated: "true"
      });
    }
  }
};
</script>
<style scoped>
.statusbar {
  width: 750px;
  height: 36px;
}
.header {
  position: absolute;
  top: 0px;
  width: 750px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
}
.header-text {
  line-height: 94px;
  font-size: 38px;
}
.scroller {
  width: 750px;
  flex: 1;
}
.refresh {
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.loading {
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.indicator {
  width: 50px;
  height: 50px;
  margin-top: 15px;
  margin-bottom:15px;
  color: #000;  /*android 默认红色 ios 默认白色*/
}
.indicator-text {
  height: 50px;
  margin-top: 15px;
  margin-bottom:15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.down {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.logoImg {
  width: 675px;
  margin-left: 38px;
  margin-right: 38px;
  flex-direction: column;
}
.sports {
  width: 674px;
  height: 200px;
}
.motion {
  width: 674px;
  height: 200px;
  margin-top: 20px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
}
.motionWord {
  position: absolute;
  color: #fff;
  top: 80px;
  left: 237px;
  width: 200px;
  height: 100px;
  font-size: 38px;
}
.diet {
  width: 674px;
  height: 200px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
}
.tip {
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 30px;
  background-color: rgb(238, 238, 238);
  padding-left: 50px;
  color: rgb(51, 51, 51);
}
.information {
  width: 675px;
  margin-left: 38px;
  margin-right: 38px;
  flex-direction: row;
}
.item {
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-color: rgb(221, 221, 221);
}
.item:last-child {
  border: none;
}
/*.logo {
  flex: 1.2;
}*/
.fold_img {
  width: 200px;
  height: 170px;
}
.details {
  /*flex: 3;*/
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 30px;
  height: 170px;
}
.details-title {
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.data_sum {
  flex-direction: row;
  align-items: center;
}
.date,
.sum {
  font-size: 24px;
  color: rgb(102, 102, 102);
}
.browse {
  margin-left: 30px;
  flex-direction: row;
  align-items: center;
}
.icon_eye {
  width: 30px;
  height: 22px;
  margin-right: 10px;
}
</style>

