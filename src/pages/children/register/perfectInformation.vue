<template>
    <div class="perfect">
        <wxc-minibar title="完善基本信息"
                background-color="#ffffff"
                text-color="#000000"
                right-text="跳过"
                @wxcMinibarRightButtonClicked="jump('home')"
                style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;">
            <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
                <!-- <image class="icon_back" :src="getImgPath('icon_back.png')"/> -->
            </div>    
        </wxc-minibar>
        <scroller class="scroller" :style="scrollStyle">
            <div class="message">
                <text>姓名</text>
                <div class="msg_word" @click="openMaskName">
                    <text>{{name}}</text>
                    <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/>
                </div>
            </div>
            <div class="message">
                <text>性别</text>
                <div @click="openMaskSex" class="msg_word">
                    <text>{{sex}}</text>
                    <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/>
                </div>
            </div>
            <div class="message">
                <text>年龄</text>
                <div class="msg_word">
                    <text>{{age}}</text>
                    <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/>
                </div>
            </div>
            <div class="message">
                <text>身高</text>
                <div class="msg_word">
                    <text>{{height}}</text>
                    <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/>
                </div>
            </div>
            <div class="message">
                <text>体重</text>
                <div class="msg_word">
                    <text>{{weight}}</text>
                    <image class="arrow_right_blue" :src="getImgPath('arrow_right_blue.png')"/>
                </div>
            </div>
        </scroller>
        <!-- 姓名 -->
        <wxc-mask height="400"
              width="500"
              border-radius="10"
              duration="200"
              mask-bg-color="#FFFFFF"
              :has-animation="hasAnimation"
              :has-overlay="true"
              :show-close="false"
              :show="nameShow">
            <div class="name_content">
                <div class="close_name" @click="closeName">
                    <image class="icon_cancel" :src="getImgPath('icon_cancel.png')"/>                    
                </div>
                <div class="name_main">
                    <text class="name_c_title">您的名字</text>
                    <input @input="onInputName" class="name_main_wrod" type="text">
                    <text class="preservation_name">保存</text>
                </div>
            </div>
        </wxc-mask>
        <!-- 性别 -->
        <wxc-popup popup-color="rgb(255, 255, 255)"
            :show="isSexShow"
            pos="bottom"
            height="400">
            <div class="sex-content">
                <text>男</text>
                <text>女</text>
                <text>取消</text>
            </div>
        </wxc-popup>
    </div>
</template>
<script>
import { WxcMinibar, WxcMask, WxcPopup, Utils } from "weex-ui";
import { createLink, storage_getItem, printLog } from "../../../shared/utils";
const modal = weex.requireModule("modal");
export default {
    components: {
        WxcMinibar,
        WxcMask,
        WxcPopup
    },
    data () {
        return {
            name: '方便为您建立健康档案', // 姓名
            sex: '请选择', // 性别
            age: '请选择', // 年龄
            height: '请选择', // 身高
            weight: '请选择', // 体重
            nameShow: false,
            hasAnimation: true,
            isSexShow: false,
        }
    },
    created () {
        if (WXEnvironment.platform == "Web") {
            this.scrollStyle = {
                width: "750px",
                height: Utils.env.getPageHeight() - 90 + "px"
            } 
        } else {
            this.scrollStyle = {
                width: "750px",
                height: Utils.env.getPageHeight() + "px"
            }
        }
    },
    methods: {
        openMaskName (e) { // 姓名
            this.nameShow = true;
            this.hasAnimation = true;
        },
        closeName () {
            this.nameShow = false
        },
        onInputName (e) {
            this.name = e.value
        },
        openMaskSex () { // 性别
            this.isSexShow = true
        },
        jump (path) {
            if (!path) return;
            const navigator = weex.requireModule("navigator");
            navigator.push({
                url: createLink(path),
                animated: "true"
            });
        },
        // minibarLeftButtonClick() {
        //     // let navigator = weex.requireModule("navigator");
        //     // navigator.pop({
        //     //   animated: "true"
        //     // });
        // },
    }
}
</script>
<style lang="less" scoped>
    .icon_back {
        width: 40px;
        height: 40px;
    }
    .message{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
    }
    .msg_word{
        flex-direction: row;
        align-items: center;
    }
    .arrow_right_blue{
        width: 20px;
        height: 24px;
    }
    // ---- 姓名 ----
    .close_name{
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
    }
    .icon_cancel{
        width: 36px;
        height: 36px;
    }
    .name_main{
        flex-direction: column;
        align-items: center;
    }
    .name_main_wrod{
        margin-top: 20px;
        margin-bottom: 20px;
        width: 350px;
        height: 60px;
        border-radius: 10px;
        border-width: 1px;
        border-color: rgb(238, 238, 238);
        font-size: 32px;
    }
    .preservation_name{
        width: 150px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        background-color: rgb(2, 179, 237);
        color:rgb(255, 255, 255);
        font-size: 28px;
        border-radius: 10px;
    }
</style>
