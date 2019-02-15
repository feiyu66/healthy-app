<template>
    <div class="register">
        <wxc-minibar title="注册"
            background-color="#ffffff"
            text-color="#000000"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #dddddd;">
            <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
                <image class="icon_back" :src="getImgPath('icon_back.png')"/>
            </div>    
        </wxc-minibar>
        <scroller class="scroller" :style="scrollStyle">
            <div class="demo">
                <input @input="onInputPhone" class="register_phone" type="number" placeholder="请输入手机号">
            </div>
            <div class="demo">
                <input @input="onInputVCode" class="register_vcode" type="number" placeholder="请输入验证码">
                <wxc-button :btn-style="btnStyle" :disabled="disabled" :text='content' :text-style="textStyle" @wxcButtonClicked='wxcButtonClicked'></wxc-button> 
            </div>
            <div class="demo">
                <input @input="onInputCode" class="register_phone" type="number" placeholder="请输入邀请码(如无邀请码可不填写)">
            </div>
            <div class="tooltip" @click="jump('agreement')">
                <text class="word">注册即表示您同意</text>
                <text class="word color_on">《动健康服务条款及协议》</text>
            </div>
            <div class="register_btn" @click="openMask"><text class="btn_word">注册</text></div>
        </scroller>
        <wxc-mask height="500"
            width="550"
            border-radius="10"
            duration="200"
            mask-bg-color="#FFFFFF"
            :has-animation="hasAnimation"
            :has-overlay="true"
            :show-close="false"
            :show="show"
            @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="register_mask">
                <text class="reg_mask_tool">提示</text>
                <text class="success_word">注册成功！</text>
                <div>
                    <text>领取个性化运动处方、营养处方需要您填写专业版健康问卷,大概需要2分钟。</text>
                </div>
                <div class="mask_btn">
                    <text class="mask_btn_word">以后再说</text>
                    <text class="mask_btn_word now_word" @click="jump('perfectInformation')">现在填写</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>
<script>
import { WxcMinibar, WxcButton, WxcMask, Utils } from "weex-ui";
import { createLink, storage_getItem, printLog } from "../../../shared/utils";
const modal = weex.requireModule("modal");
export default {
    components: {
        WxcMinibar,
        WxcButton,
        WxcMask
    },
    data () {
        return {
            inputPhone: '', // 手机号
            inputVCode: '', // 验证码
            num: 5, // 倒计时
            content: "获取验证码",
            width: "200px",
            height: "60px",
            backgroundColor: "#02b3ed",
            borderColor: "#ffffff",
            borderRadius: "10px",
            marginLeft: '10px',
            fontSize: "28px",
            color: "#FFFFFF",
            disabled: false,
            inputCode: '', // 邀请码
            show: false,
            hasAnimation: true
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
    computed : {
        btnStyle() {
            const {
                width,
                height,
                backgroundColor,
                borderColor,
                borderRadius,
                marginLeft
            } = this;
            const customStyle = {};
            if (width) {
                customStyle.width = width;
            }
            if (height) {
                customStyle.height = height;
                customStyle.lineHeight = height;
            }
            if (backgroundColor) {
                customStyle.backgroundColor = backgroundColor;
            }
            if (borderColor) {
                customStyle.borderColor = borderColor;
                customStyle.borderWidth = "1px";
                customStyle.borderStyle = "solid";
            }
            if (borderRadius) {
                customStyle.borderRadius = borderRadius;
            }
            if (marginLeft) {
                customStyle.marginLeft = marginLeft
            }
            return customStyle;
        },
        textStyle() {
            const { fontSize, color } = this;
            const customStyle = {};
            if (fontSize) {
                customStyle.fontSize = fontSize;
            }
            if (color) {
                customStyle.color = color;
            }
            return {
                fontSize,
                color
            };
        }
    },
    methods: {
        onInputPhone (event) { // 手机号
            this.inputPhone = event.value
        },
        onInputVCode (event) { // 验证码
            this.inputVCode = event.value
        },
        wxcButtonClicked (e) { // 获取验证码
            if (this.disabled == true) { return; }
            let reg = /^[1][3-9][0-9]{9}$/;
            if (!reg.test(this.inputPhone) || this.inputPhone.length < 1) {
                modal.toast({
                    message: "请输入正确的手机号"
                });
            } else {
                modal.toast({
                    message: "发送成功"
                });
                this.disabled = true;
                this.timer = setInterval(() => {
                    this.content = "重新发送" + "(" + this.num-- + ")";
                    if (this.num < 0) {
                        clearInterval(this.timer);
                        this.disabled = false;
                        this.num = 5;
                        this.content = "获取验证码";
                    }
                }, 1000);
            }
        },
        onInputCode (event) { // 邀请码
            this.inputCode = event.value
        },
        openMask (e) {
            this.show = true;
            this.hasAnimation = true;
        },
        wxcMaskSetHidden () {
            this.show = false;
        },
        jump (path) {
            if (!path) return;
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
        flex-direction: column;
        align-items: center;
    }
    .demo{
        width: 450px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }
    .register_phone, .register_vcode{
        flex: 1;
        height: 60px;
        border-width: 1px;
        border-color: rgb(102, 102, 102);
        border-radius: 10px;
        font-size: 24px;
        padding-left: 10px;
    }
    .tooltip{
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .word{
        color: rgb(102, 102, 102);
        font-size: 28px;
    }
    .color_on{
        color: rgb(2, 179, 237);
    }
    .register_btn{
        flex: 1;
        height: 65px;
        background-color: rgb(2, 179, 237);
        border-radius: 10px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .btn_word{
        font-size: 32px;
        color:rgb(255, 255, 255);
    }
    // ---- 注册成功 ----
    .reg_mask_tool{
        font-size: 32px;
        color: rgb(51, 51, 51);
        margin-top: 20px;
        margin-left: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
    }
    .success_word{
        flex: 1;
        text-align: center;
        margin-top: 20px;
    }
    .mask_btn{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: 50px;
    }
    .mask_btn_word{
        width: 170px;
        height: 60px;
        font-size: 28px;
        border-radius: 10px;
        background-color: rgb(2, 179, 237);
        color:rgb(255, 255, 255);
        text-align: center;
        line-height: 60px;
    }
    .now_word{
        margin-left: 10px;
    }
</style>

