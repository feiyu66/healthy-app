<template>
  <div class="teamIntroduce">
    <wxc-minibar title='团队介绍'
        background-color="#ffffff"
        text-color="#000000"
        @wxcMinibarLeftButtonClicked="minibarLeftButtonClick">
        <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
        </div>    
    </wxc-minibar>
    <scroller class="scroller" :style="scrollStyle">
        <div class="items">
            <div class="items_left">
                <image class="logoImg" :src="getImgPath('dialog.png')"/>
            </div>
            <div class="items_right">
                <div class="message">
                    <text class="name">邓紫棋</text>
                    <text class="position">健管师</text>
                </div>
                <text class="company">中国</text>
                <text class="speciality">擅长：</text>
            </div>
        </div>
    </scroller>
  </div>
</template>
<script>
import { WxcMinibar, Utils } from 'weex-ui';
import { createLink, storage_getItem, printLog } from '../../../shared/utils'
const storage = weex.requireModule('storage')
export default {
    components: { WxcMinibar },
    data () {
        return {

        }
    },
    created () {
        if (WXEnvironment.platform == "Web") {
            this.scrollStyle = {
                width: "750px",
                height: Utils.env.getPageHeight() - 90 + "px"
            };
        } else {
            this.scrollStyle = {
                width: "750px",
                height: Utils.env.getPageHeight() + "px"
            };
        }
    },
    methods: {
        minibarLeftButtonClick () {},
    }
}
</script>
<style>
    .wxc-minibar {
        border-bottom-width: 1px;
        border-bottom-color: #cccccc;
    }
</style>
<style lang="less" scoped>
    .icon_back {
        width: 40px;
        height: 40px;
    }
    .scroller{
        background-color: rgb(238, 238, 238);
    }
    .items{
        background-color: rgb(255, 255, 255);
        flex-direction: row;
        align-items: center;
    }
    .items_left{
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .logoImg{
        width: 90px;
        height: 90px;
    }
    .items_right{
        flex: 3;
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
    }
    .message{
        flex-direction: row;
        align-items: center;
        margin-top: 30px;
    }
    .name{
        font-size: 32px;
        color:rgb(51, 51, 51);
    }
    .position{
        margin-left: 15px;
        width: 68px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 18px;
        color:rgb(255, 255, 255);
        background-color: rgb(255, 210, 29);
        border-radius: 5px;
    }
    .company{
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: 28px;
        color: rgb(102, 102, 102);
    }
    .speciality{
        padding-bottom: 30px;
        font-size: 26px;
        color:rgb(153, 153, 153);
    }
</style>
