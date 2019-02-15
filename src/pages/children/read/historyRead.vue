<template>
    <div class="box">
        <wxc-minibar title="历史必读"
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
            <cell class="content" @click="jump('readDetails', item.id)" v-for="(item, index) in datas" :key='index'>
                <div class="top" style="position: relative;">
                    <div class="left">
                        <image class="imagesUrl" :src="item.imageUrl + '?x-oss-process=style/dl-m-style'"/>
                    </div>
                    <div class="right">
                        <div style="width: 750px;" class="right-title">
                            <text class="title">{{item.title}}</text>
                        </div>
                        <div class="details">
                            <text class="data">{{item.publishTime}}</text>
                            <div class="browse">
                                <image class="icon_eye" :src="getImgPath('icon_eye.png')"/>
                                <text class="sum">浏览：{{item.views}}人</text>
                            </div>
                        </div>
                    </div>
                    <image v-if="item.isAnswered == 0" style="position: absolute;" class="gray" :src="getImgPath('gray.png')"/>
                    <image v-else style="position: absolute;" class="gray" :src="getImgPath('blue.png')"/>
                </div>
                <div class="foo">
                    <div v-if="item.isAnswered == 1">
                        <image v-if="item.answer == 1" class="imgs" :src="getImgPath('right.png')"/> 
                        <image v-else class="imgs" :src="getImgPath('wrong.png')"/>
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
import { WxcMinibar, Utils } from "weex-ui";
import { createLink, storage_getItem, printLog } from "../../../shared/utils";
import api from "../../../shared/request";
const storage = weex.requireModule("storage");
export default {
  components: { WxcMinibar },
  data() {
    return {
      datas: [],
      loadinging: false,
      refreshing: false,
      loadingWord: "加载更多...",
      downFlag: true,
      pageNum: 1,
    };
  },
  created() {
    if (WXEnvironment.platform == "Web") {
      this.listStyle = {
        height: Utils.env.getPageHeight() - 140 + "px"
      };
    } else {
      this.listStyle = {
        height: Utils.env.getPageHeight() + "px"
      };
    }
    this.gethistory();

    const refresh = new BroadcastChannel("refresh-historyread-status");
    refresh.onmessage = event => {
      printLog(event.data); // Assemble!
      this.gethistory();
    };
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
        api.get(`${this.baseURL}health/articles/4?`, params, data => {
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
        api.get(`${this.baseURL}health/articles/4?`, params, data => {
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
    gethistory: async function() {
      this.mbrId = await storage_getItem("mbrId");
      this.baseURL = await storage_getItem("newApiBase");
      let params = {
        userId: this.mbrId,
        pageNum: 1
      };
      api.get(`${this.baseURL}health/articles/4?`, params, data => {
        console.log(data);
        if (data.code == 200) {
          this.datas = data.data.datas;
          this.datas.map(item => {
            if (item.publishTime == null) {
              item.publishTime = "";
            } else {
              item.publishTime = item.publishTime.split(" ")[0];
            }
          });
        }
      });
    },
    minibarLeftButtonClick() {},
    minibarRightButtonClick() {
      modal.toast({ message: "click rightButton!", duration: 1 });
    },
    jump(path, readId) {
      if (!path) return;
      storage.setItem("readId", readId);
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
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
  background-color: rgb(238, 238, 238);
}
.refresh {
  width: 674px;
  margin-right: 38px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.loading {
  width: 674px;
  margin-right: 38px;
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
.content {
  background-color: #ffffff;
  padding-left: 38px;
  margin-bottom: 10px;
  flex-direction: column;
}
.top {
  flex-direction: row;
  height: 220px;
  
}
.gray {
  width: 94px;
  height: 94px;
  top: 0;
  right: 0;
}
.left {
  flex: 1.3;
  margin-top: 40px;
}
.imagesUrl {
  width: 200px;
  height: 170px;
}
.right {
  flex: 3;
  margin-top: 40px;
  margin-left: 20px;
  margin-right: 30px;
  flex-direction: column;
  justify-content: space-between;
}
.title {
  font-size: 30px;
  color: rgb(51, 51, 51);
  margin-top: 10px;
}
.details {
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}
.data,
.sum {
  font-size: 24px;
  color: rgb(102, 102, 102);
}
.browse {
  flex-direction: row;
  align-items: center;
  margin-left: 30px;
}
.icon_eye {
  width: 30px;
  height: 22px;
  margin-right: 10px;
}
.foo {
  flex-direction: row;
  justify-content: flex-end;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #eeeeee;
}
.imgs {
  width: 130px;
  height: 54px;
  margin-right: -2px;
}
</style>