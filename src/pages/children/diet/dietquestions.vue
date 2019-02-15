<template>
    <div class="box">
        <wxc-minibar title="饮食提问"
            background-color="#ffffff"
            text-color="#000000"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            >
            <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
          </div>
            </wxc-minibar>
        <div class="main">
            <div class="content" style="width: 86%; marginLeft: 7%;">
                <div class="question_img">
                    <image class="img_quiz" :src="getImgPath('img_quiz.png')"/>
                </div>
                <text class="question_word">如您不了解某种食物的营养成分，不知道是否适合自己食用，您可以拍照上传，咨询您的医生。</text>
                <div class="consultation" @click="openMask"><text class="consultation_word">立即咨询</text></div>
                <div class="bottom">
                    <image class="hint_info" :src="getImgPath('hint_info.png')"/>
                    <text class="bott_word">历史提问记录可在</text><text class="bott_color">咨询</text><text class="bott_word">版块-您与医生的沟通记录中查看</text>
                </div>
            </div>
        </div>
        <wxc-mask height="auto"
            width="520"
            border-radius="10"
            duration="200"
            mask-bg-color="#FFFFFF"
            :has-animation="hasAnimation"
            :has-overlay="true"
            :show-close="false"
            :show="show">
            <div class="mask_box">
                <div class="mask_close" @click="wxcMaskSetHidden">
                    <image class="icon_cancel" :src="getImgPath('icon_cancel.png')"/>
                </div>
                <div class="mask_content">
                    <div class="mask_title">
                        <text class="mask_word">请选择您要咨询的医生</text>
                    </div>
                    <div class="mask_message" v-for="(item, index) in consultationData" :key='index' style="height: auto;">
                        <image class="dialog" :src="getImgPath('dialog.png')"/>
                        <div class="msg">
                            <text class="name">{{item.drName}}</text>
                            <text class="position">{{item.drProfession}}</text>
                            <image class="icon_back2" :src="getImgPath('icon_back2.png')"/>
                        </div>
                    </div>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>
<script>
    import { WxcMinibar, WxcMask  } from "weex-ui"
    import { createLink, storage_getItem} from "../../../shared/utils";
    import api from '../../../shared/request'
    const modal = weex.requireModule("modal");
    export default {
        components: {
            WxcMinibar,
            WxcMask
        },
        data () {
            return {
                show: false,
                hasAnimation: true,
                mbrId: '',
                baseURL: '',
                consultationData: []
            }
        },
        methods: {
            openMask (e) {
                this.show = true;
                this.hasAnimation = true;
                this.openMaskData()
            },
            openMaskData: async function() {
                this.mbrId = await storage_getItem("mbrId");
                this.baseURL = await storage_getItem("oldApiBase");
                // this.date = await storage_getItem("date");
                console.log(this.mbrId, this.baseURL);
                let params = {
                    mbrId: this.mbrId
                }
                api.get(`${this.baseURL}iapptsmservice/getmbrgroupdetaillistbymbr?`, params, data => {
                    console.log(data)
                    this.consultationData = data.mbrGroupDetailEntityList
                    this.consultationData.map(item => {
                        if (item.drProfession == '01') {
                            item.drProfession = '医师'
                        } else if (item.drProfession == '02') {
                            item.drProfession = '健管师'
                        } else if (item.drProfession == '03') {
                            item.drProfession = '运动师'
                        } else if (item.drProfession == '04') {
                            item.drProfession = '营养师'
                        } else if (item.drProfession == '05') {
                            item.drProfession = '康复师'
                        } else if (item.drProfession == '06') {
                            item.drProfession = '心理师'
                        }
                    })
                })
            },
            wxcMaskSetHidden () {
                this.show = false;
            },
            minibarLeftButtonClick () {

            },
            minibarRightButtonClick () {
                modal.toast({ 'message': 'click rightButton!', 'duration': 1 });
            },
        }
    }
</script>
<style>
    .wxc-minibar{
        border-bottom-width: 1px;
        border-bottom-color: #cccccc;
    }
</style>
<style lang="less" scoped>
.icon_back{
  width: 40px;
  height: 40px;
}
    .main{
        flex: 1;
    }
    .content{
        flex-direction: column;
        align-items: center;
    }
    .question_img{
        flex-direction: row;
        justify-content: center;
        margin-top: 110px;
        margin-bottom: 40px;
    }
    .img_quiz{
        width: 294px;
        height: 298px;
    }
    .question_word{
        font-size: 30px;
        color: rgb(51, 51, 51);
    }
    .consultation{
        margin-top: 100px;
        margin-bottom: 50px;
        width: 610px;
        height: 80px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: rgb(2, 179, 237);
        border-radius: 10px;
    }
    .consultation_word{
        font-size: 30px;
        color: rgb(255, 255, 255);
    }
    .bottom{
        flex-direction: row;
        align-items: center;
    }
    .hint_info{
        width: 32px;
        height: 32px;
        margin-right: 10px;
    }
    .bott_word{
        font-size: 26px;
        color: rgb(102, 102, 102);
    }
    .bott_color{
        font-size: 26px;
        color: rgb(2, 179, 237);
    }
    // ---------------------
    .mask_close{
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 18px;
        margin-right: 18px;
    }
    .icon_cancel{
        width: 36px;
        height: 36px;
    }
    .mask_content{
        margin-left: 28px;
    }
    .mask_title{
        flex-direction: row;
        justify-content: center;
        margin-top: 15px;
    }
    .mask_word{
        font-size: 34px;
        color: rgb(51, 51, 51);
    }
    .mask_message{
        margin-right: 30px;
        margin-top: 20px;
        margin-bottom: 20px;
        flex-direction: row;
        align-items: center;
    }
    .dialog{
        width: 102px;
        height: 102px;
    }
    .msg{
        height: 102px;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: rgb(221, 221, 221);
    }
    .name{
        margin-left: 30px;
        font-size: 32px;
        color: rgb(2, 179, 237);
    }
    .position{
        margin-left: 50px;
        font-size: 28px;
        color: rgb(102, 102, 102);
    }
    .icon_back2{
        width: 22px;
        height: 34px;
        margin-left: 20px;
    }
</style>


