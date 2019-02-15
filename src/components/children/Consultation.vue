<template>
    <div class="box">
        <wxc-minibar title="咨询"
            background-color="#ffffff"
            text-color="#000000"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;">
          <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
          </div>
        </wxc-minibar>
        <scroller class="scroller" :style="scrollStyle">
            <div class="items">
                <div class="items_left">
                    <image class="dialog" :src="getImgPath('dialog.png')"/>
                </div>
                <div class="items_right" @click="jump('teamIntroduce')">
                    <div class="message">
                        <text class="team_name">我的医生团队</text>
                        <text class="company">中国人民</text>
                    </div>
                    <image class="icon_back2" :src="getImgPath('icon_back2.png')"/>                    
                </div>
            </div>
        </scroller>
    </div>
</template>
<script>
import { WxcMinibar, Utils } from "weex-ui";
import { createLink, storage_getItem } from "../../shared/utils";
export default {
    components: {
        WxcMinibar,
    },
    name: 'Consultation',
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
        jump( path ) {
            if(!path) return;
            const navigator = weex.requireModule('navigator')
            navigator.push({
                url: createLink(path),
                animated: "true"
            })
        },
        minibarLeftButtonClick() {},
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
    }
    .items{
        flex-direction: row;
        align-items: center;
    }
    .items_left{
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .dialog{
        width: 90px;
        height: 90px;
    }
    .items_right{
        flex: 3;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .message{
        margin-top: 40px;
        padding-bottom: 40px;
    }
    .team_name{
        font-size: 32px;
        color:rgb(51, 51, 51);
        margin-bottom: 20px;
    }
    .company{
        font-size: 28px;
        color:rgb(102, 102, 102);
    }
    .icon_back2{
        width: 22px;
        height: 34px;
        margin-right: 30px;
    }
</style>

