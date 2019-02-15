<template>
    <div class="wrapper-app">
        <div class="header">
            <div class="header-left" @click="toBack">
                    <image class="icon_back" :src="getImgPath('icon_back_white.png')"/>
                    <text class="back">返回</text>
            </div>
            <div class="header-title"><text class="title">体脂秤</text></div>
            <div class="header-right"></div>
        </div>
        <div class="section">
            <div class="main">
                <div class="main-img">
                    <image class="connect_fat" :src="getImgPath('connect_fat.png')"/>
                </div>
            
            <text class="body-fat">您还未绑定体脂秤</text>
              <div class="btn" @click="jump('bodyfatsearch')">
              <text class="btn-text">去绑定</text>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import { createLink } from "../../../shared/utils";
export default {
  data() {
    return {};
  },
  methods: {
    toBack() {
      let navigator = weex.requireModule("navigator");
      navigator.pop({
        animated: "true"
      });
    },
    jump(path) {
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper-app {
  flex-direction: column;
}
.header {
  height: 100px;
  background-color: #02b3ed;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-left {
  flex: 1;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-title {
  flex: 4;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-right {
  flex: 1;
  height: 100px;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.back {
  font-size: 28px;
  color: #ffffff;
}
.icon_back {
  width: 40px;
  height: 40px;
}
.title {
  font-size: 38px;
  color: #ffffff;
}
.content {
  flex: 4;
}
.section {
  flex: 1;
}
.main {
  height: 850px;
  position: relative;
  padding: 0 35px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.main-img {
}
.connect_fat {
  width: 500px;
  height: 500px;
}
.body-fat {
  text-align: center;
  font-size: 36px;
  color: rgb(51, 51, 51);
}
.btn {
  background-color: rgb(2, 179, 237);
  width: 500px;
  height: 100px;
  margin-top: 80px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}
.btn-text {
  font-size: 36px;
  color: #ffffff;
}
</style>


