<template>
    <div class="box">
        <wxc-minibar title="热量查询"
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
            <div class="demo">
                <wxc-searchbar ref="wxc-searchbar"
                    placeholder="请输入食物关键字"
                    @wxcSearchbarCancelClicked="wxcSearchbarCancelClicked"
                    @wxcSearchbarCloseClicked="wxcSearchbarCloseClicked"
                    @wxcSearchbarInputOnInput="wxcSearchbarInputOnInput"></wxc-searchbar>
            </div>
            <div v-if="!searchFlag" class="food_dome">
                <div class="food_title">
                    <text class="list" :class="[num == index ? 'on' : '']" @click="addName(index, item.type)" v-for="(item, index) in foodData" :key="index">{{item.name}}</text>
                </div>
                <scroller :style="scrollStyle">
                    <div class="food_item" style="paddingLeft: 5%;">
                        <div class="item" v-for="(item, index) in foodtoolData" :key='index'>
                            <div class="item_left">
                                <image class="food_img" :src="getImgPath('fold.jpg')"/>
                            </div>
                            <div class="item_right">
                                <text class="name">{{item.name}}</text>
                                <text class="weight">{{item.perUnitG}}g/{{item.kcal}}kcal</text>
                            </div>
                        </div>
                    </div>
                </scroller>
            </div> 
            <div v-else class="food_search" style="position: relative;">
                <scroller v-if="keywordData.length != 0" :style="scrollStyleA">
                    <div class="food_item" style="paddingLeft: 5%;">
                        <div class="item" v-for="(item, index) in keywordData" :key='index'>
                            <div class="item_left">
                                <image class="food_img" :src="getImgPath('fold.jpg')"/>
                            </div>
                            <div class="item_right">
                                <text class="name">{{item.name}}</text>
                                <text class="weight">{{item.unitG}}g/{{item.kcal}}kcal</text>
                            </div>
                        </div>
                    </div>
                </scroller>
                <text v-else style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);" class="tooltip_word">没有搜索到您要查找的食物</text>
            </div>
        </div>
    </div>
</template>
<script>
    import { WxcMinibar, WxcSearchbar, Utils } from "weex-ui"
    import { createLink, printLog, storage_getItem} from "../../../shared/utils";
    import api from '../../../shared/request'
    const modal = weex.requireModule("modal");
    export default {
        components: {
            WxcMinibar,
            WxcSearchbar 
        },
        data () {
            return {
                baseURL: "",
                mbrId: "",
                searchFlag: false,
                searchValue: '', // 输入框内容
                foodData: [
                    {
                        name: '主食',
                        type: 1
                    },
                    {
                        name: '蔬果',
                        type: '2,6'
                    },
                    {
                        name: '肉蛋奶',
                        type: '3,5'
                    },
                    {
                        name: '油脂',
                        type: 7
                    },
                    {
                        name: '豆类',
                        type: 4
                    }],
                num: 0,
                type: 1,
                keywordData: [],
                foodtoolData: []
            }
        },
        created () {
            this.foodTool()
            console.log(1)
            printLog(Utils.env.getPageHeight());
            if (WXEnvironment.platform == "Web") {
                this.scrollStyle = {
                    width: "750px",
                    height: Utils.env.getPageHeight() - 285 + "px"
                };
                this.scrollStyleA = {
                    width: "750px",
                    height: Utils.env.getPageHeight() - 185 + "px"
                };
            } else {
                this.scrollStyle = {
                    width: "750px",
                    height: Utils.env.getPageHeight() + "px"
                };
                this.scrollStyleA = {
                    width: "750px",
                    height: Utils.env.getPageHeight() + "px"
                };
            }
        },
        methods: {
            foodTool: async function () {
                this.mbrId = await storage_getItem("mbrId");
                this.baseURL = await storage_getItem("newApiBase");
                console.log(this.mbrId, this.baseURL);
                let params = {
                    types: this.type
                }
                api.get(`${this.baseURL}health/food/tool?`, params, data => {
                    console.log(data)
                    this.foodtoolData = data.data
                })
                // let params = {
                //     keywords: '大'
                // }
                // api.get(`${this.baseURL}health/food/tool?`, params, data => {
                //     console.log(data)
                // })
            },
            addName (index, type) {
                this.num = index
                this.type = type
                let params = {
                    types: this.type
                }
                this.foodtoolData = []
                api.get(`${this.baseURL}health/food/tool?`, params, data => {
                    console.log(data)
                    this.foodtoolData = data.data
                })
            },
            wxcSearchbarInputOnInput (e) {
                console.log(e.value)
                this.searchValue = e.value
                let params = {
                    keywords: e.value
                }
                api.get(`${this.baseURL}health/food/tool/search?`, params, data => {
                    console.log(data)
                    this.keywordData = data.data
                })
                if (this.searchValue) {
                    this.searchFlag = true
                } else {
                    this.searchFlag = false
                }
            },
            wxcSearchbarCloseClicked () {
                if (this.searchValue) {
                    this.searchFlag = true
                } else {
                    this.searchFlag = false
                }
            },
            wxcSearchbarCancelClicked () {
                if (this.searchValue) {
                    this.searchFlag = true
                } else {
                    this.searchFlag = false
                }
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
        background-color: #eeeeee;
    }
    .demo{
        border-bottom-width: 1px;
        border-bottom-color: #cccccc;
    }
    .food_item{
        background-color: rgb(255, 255, 255);
    }
    .food_title{
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
        flex-direction: row;
        justify-content: space-around;
        background-color: rgb(255, 255, 255);
    }
    .list{
        margin-top: 28px;
        padding-bottom: 28px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 32px;
    }
    .on{
        color: rgb(2, 179, 237);
        border-bottom-width: 2px;
        border-bottom-color: rgb(2, 179, 237);
    }
    .item{
        border-bottom-width: 1px;
        border-bottom-color: #eeeeee;
        flex-direction: row;
    }
    .item_left{
        margin-top: 20px;
        padding-bottom: 20px;
    }
    .food_img{
        width: 130px;
        height: 110px;
        border-radius: 10px;
    }
    .item_right{
        margin-left: 30px;
        margin-top: 20px;
        padding-bottom: 20px;
        flex-direction: column;
        justify-content: space-around;
    }
    .name{
        font-size: 28px;
        color: rgb(51, 51, 51);
    }
    .weight{
        font-size: 26px;
        color:rgb(102, 102, 102);
    }
    // ----- 搜索 ------
    .food_search{
        margin-top: 10px;
        flex: 1;
    }
    .tooltip_word{
        font-size: 30px;
        color: rgb(153, 153, 153);
    }
</style>

