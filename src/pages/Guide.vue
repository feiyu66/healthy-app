<template>
  <div class="box">
    <wxc-ep-slider ref="wxc-ep-slider" 
                   :slider-id="sliderId"
                   :card-length='cardLength'
                   :card-s="cardSize"
                   :container-s="containerSize"
                   :select-index="selectIndex"
                   @wxcEpSliderCurrentIndexSelected="wxcEpSliderCurrentIndexSelected">
      <div v-for="(item, index) in imageUrl"
           :key="index"
           :slot="`card${index}_${sliderId}`" class="slider">
        <image :style="imgStyle" :src="getImgPath(item.imgUrl)"/>
        <div class="jumpBtn" :style="btnStyle">
            <text class="word" @click="jump(index)">{{item.word}}</text>
        </div>
      </div>
    </wxc-ep-slider>
  </div>
</template>
<script>
  import { WxcEpSlider, Utils } from 'weex-ui';
  import { createLink, printLog, storage_getItem } from '../shared/utils'
  const messaging = weex.requireModule("MessagingModule");
  export default {
    components: { WxcEpSlider },
    data: () => ({
      imageUrl: [
          {
            imgUrl: 'guide_one.png',
            word: '下一页'
          },
          {
            imgUrl: 'guide_three.png',
            word: '下一页'
          },
          {
            imgUrl: 'guide_two.png',
            word: '下一页'
          },
          {
            imgUrl: 'guide_four.png',
            word: '立即体验'
          }],
      sliderId: 1,
      selectIndex: 0,
      cardLength: 4,
      cardSize: {
        width: 750,
        height: 1334,
        spacing: 0,
        scale: 1
      },
      containerSize:{
        position: 'relative',
        width: 750,
        height: 1334
      },
      imgStyle: {
        width: "750px",
        height: "1334px"
      },
      btnStyle: {
        position: 'absolute',
        bottom: '100px'
      }
    }),
    created () {
        this.cardLength = this.imageUrl.length
        printLog(Utils.env.getScreenHeight());
        printLog(weex.config.env.deviceHeight)
        this.imgStyle = { width: "750px", height: Utils.env.getScreenHeight()  + "px" };
        this.cardSize.height = Utils.env.getScreenHeight()
        if (Utils.env.getScreenHeight() < 1260) {
          this.imgStyle["margin-top"] = "-170px"
          this.btnStyle.bottom = 160 + "px"
        }else {
          this.btnStyle.bottom = 66 + "px"
        }
    },
    methods: {
      jump (index) {
        if(index == '0') {
          this.$refs['wxc-ep-slider'].manualSetPage(1);
        } else if (index == '1') {
          this.$refs['wxc-ep-slider'].manualSetPage(2);
        } else if (index == '2') {
            this.$refs['wxc-ep-slider'].manualSetPage(3);
        } else if (index == '3') {
          messaging.wxguideJump()
        }
        // if(!path) return;
        // const navigator = weex.requireModule('navigator')
        // navigator.push({
        //   url: createLink(path),
        //   animated: "true"
        // })
      },
      wxcEpSliderCurrentIndexSelected (e) {
        const index = e.currentIndex;
      }
    }
  }
</script>
<style scoped>
  .slider {
    width: 750px;
    height: 1334px;
    align-items: center;
    justify-content: center;
  }
  .jumpBtn{
      margin-left: 220px;
      flex-direction: row;
      justify-content: center;
      align-items: center;
  }
  .word{
      width: 300px;
      height: 60px;
      border-radius: 999px;
      border-width: 2px;
      border-color: #ffffff;
      text-align: center;
      line-height: 60px;
      color: #ffffff;
      font-size: 28px;
  }
</style>