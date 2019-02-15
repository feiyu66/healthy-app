<template>
    <div class="box">
        <wxc-minibar :title="title"
            background-color="#ffffff"
            text-color="#000000"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;">
          <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
          </div>
        </wxc-minibar>
          <list class="scroller" :style="listStyle">
            <refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
              <!-- <div class="indicator-text">
                <image class="down" :src="getImgPath('down.png')"/> 
                <text style="font-size: 30px;color: #999999;">正在刷新...</text>
              </div> -->
              <loading-indicator class="indicator"></loading-indicator>
            </refresh>
            <cell class="item" @click="jump('article', item.id)" v-for="(item, index) in datas" :key='index'>
                <div class="logo">
                    <image class="fold_img" :src="item.imageUrl + '?x-oss-process=style/dl-m-style'"/>
                </div>
                <div class="details">
                    <text class="details-title">{{item.title}}</text>
                    <div class="browse">
                        <image class="icon_eye" :src="getImgPath('icon_eye.png')"/>
                        <text class="sum">浏览：{{item.views}}人</text>
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
    </div>
</template>
<script>
import { createLink, storage_getItem } from "../../../shared/utils";
import { WxcMinibar, Utils } from "weex-ui";
import api from "../../../shared/request";
const storage = weex.requireModule("storage");
export default {
  components: { WxcMinibar },
  data() {
    return {
      loadinging: false,
      refreshing: false,
      loadingWord: "加载更多...",
      downFlag: true,
      pageNum: 1,
      section: "",
      title: "",
      datas: [],
      baseURL: "",
      mbrId: ""
    };
  },
  created() {
    this.listStyle = { height: Utils.env.getPageHeight() + "px" };
    this.getarticlelist();
    this.answer = [];
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
        api.get(`${this.baseURL}health/articles/${this.section}?`, params, data => {
          console.log(data);
          if (data.code == 200) {
            data.data.datas.map(item => {
              this.datas.push(item);
            })
            
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
        api.get(`${this.baseURL}health/articles/${this.section}?`, params, data => {
          console.log(data);
          this.datas = [];
          if (data.code == 200) {
            this.datas = data.data.datas;
          }
        });
        this.refreshing = false;
      }, 2000);
    },
    onpullingdown(event) {
      console.log("刚开始下拉....");
    },
    getarticlelist: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      this.section = await storage_getItem("sectionId");
      if (this.section == "2") {
        this.title = "论科学运动";
      } else if (this.section == "3") {
        this.title = "论健康饮食";
      } else {
        this.section = "2";
        this.title = "论科学运动";
      }
      let params = {
        userId: this.mbrId,
        pageNum: this.pageNum
      };
      api.get(`${this.baseURL}health/articles/${this.section}?`,
        params,
        data => {
          // const modal = weex.requireModule('modal')
          //                             modal.toast({
          //                         message: data
          //                     })
          console.log(data);
          if (data.code == 200) {
            this.datas = data.data.datas;
          }
        }
      );
    },
    jump(path, articleId) {
      if (!path) return;
      storage.setItem("articleId", articleId);
      storage.setItem("sectionId", this.section);
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
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

    }
  }
};
</script>
<style scoped lang="scss">
@import "../../../../style/styles.scss";
.icon_back{
  width: 40px;
  height: 40px;
}
.scroller {
  flex: 1;
  width: 675px;
  margin-left: 38px;
  margin-right: 38px;
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
.item {
  height: 220px;
  flex-direction: row;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-color: rgb(221, 221, 221);
}
.item:last-child {
  border: none;
}
.fold_img {
  width: 200px;
  height: 170px;
}
.details {
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 30px;
}
.details-title {
  font-size: 30px;
  color: rgb(51, 51, 51);
}
.sum {
  font-size: 24px;
  color: rgb(102, 102, 102);
}
.browse {
  flex-direction: row;
  align-items: center;
}
.icon_eye {
  width: 30px;
  height: 22px;
  margin-right: 10px;
}
</style>

