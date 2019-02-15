<template>
    <div class="box">
        <wxc-minibar title="三餐建议"
            background-color="#ffffff"
            text-color="#000000"
            @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            >
            <div style="width: 120px; height: 100px; flex-direction: row; align-items: center;" slot="left">
            <image class="icon_back" :src="getImgPath('icon_back.png')"/>
          </div></wxc-minibar>
        <div class="main">
            <scroller :style="scrollStyle">
                <div class="food_box" v-for="item in breData">
                    <div class="food_title">
                        <image class="breakfast" :src="getImgPath('breakfast.png')"/>
                        <text class="title_word">早餐（总计{{item.energy}}kcal）</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">奶类</text>
                            <div class="change_data" @click="openBottomPopup(5, item.mils, 'BRE')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.mils" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">谷薯类</text>
                            <div class="change_data" @click="openBottomPopup(1, item.gras, 'BRE')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.gras" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">肉蛋类</text>
                            <div class="change_data" @click="openBottomPopup(3, item.meas, 'BRE')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.meas" :key='idx'>{{list.name}}</text>
                    </div>
                </div>
                <div class="food_box" v-for="item in lunData">
                    <div class="food_title">
                        <image class="breakfast" :src="getImgPath('lunch.png')"/>
                        <text class="title_word">午餐（总计{{item.energy}}kcal）</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">蔬菜类</text>
                            <div class="change_data" @click="openBottomPopup(2, item.vges, 'LUN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.vges" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">大豆类</text>
                            <div class="change_data" @click="openBottomPopup(4, item.beas, 'LUN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.beas" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">油脂类</text>
                            <div class="change_data" @click="openBottomPopup(7, item.oils, 'LUN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.oils" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">谷薯类</text>
                            <div class="change_data" @click="openBottomPopup(1, item.gras, 'LUN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.gras" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">肉蛋类</text>
                            <div class="change_data" @click="openBottomPopup(3, item.meas, 'LUN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.meas" :key='idx'>{{list.name}}</text>
                    </div>
                </div>
                <div class="food_box" v-for="item in dinData">
                    <div class="food_title">
                        <image class="breakfast" :src="getImgPath('dinner.png')"/>
                        <text class="title_word">晚餐（总计{{item.energy}}kcal）</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">蔬菜类</text>
                            <div class="change_data" @click="openBottomPopup(2, item.vges, 'DIN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.vges" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">谷薯类</text>
                            <div class="change_data" @click="openBottomPopup(1, item.gras, 'DIN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.gras" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">肉蛋类</text>
                            <div class="change_data" @click="openBottomPopup(3, item.meas, 'DIN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.meas" :key='idx'>{{list.name}}</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">油脂类</text>
                            <div class="change_data" @click="openBottomPopup(7, item.oils, 'DIN')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in item.oils" :key='idx'>{{list.name}}</text>
                    </div>
                </div>
                <div class="food_box">
                    <div class="food_title">
                        <image class="breakfast" :src="getImgPath('fruits.png')"/>
                        <text class="title_word">水果（总计{{PLU_ENERGY}}kcal）</text>
                    </div>
                    <div style="width: 95%; marginLeft: 5%;" class="food_content">
                        <div class="food_type">
                            <text class="name">水果类</text>
                            <div class="change_data" @click="openBottomPopup(6, fruitsData, 'PLU')">
                                <image class="change_img" :src="getImgPath('change.png')"/>
                                <text class="change_word">换一换</text>
                            </div>
                        </div>
                        <text class="food_name" v-for="(list, idx) in fruitsData" :key='idx'>{{list.name}}</text>
                    </div>
                </div>
            </scroller>
        </div>
        <wxc-popup popup-color="rgb(255, 255, 255)"
            :show="isBottomShow"
            @wxcPopupOverlayClicked="popupOverlayBottomClick"
            pos="bottom"
            height="710">
            <div class="demo-content" style="height: 710px; position: relative;">
                <div style="width: 92%; marginLeft: 4%;" class="demo_title"><text class="demo_name">{{replaceName}}</text></div>
                <div class="subtitle"><text class="subtitle_word">(推荐共摄入{{number}}份，可搭配食用)</text></div>
                <div class="share_box">
                    <text class="share_word">已选</text>
                    <text class="share">{{theSum}}</text>
                    <text class="share_word">份，还可选择</text>
                    <text class="share">{{share_num}}</text>
                    <text class="share_word">份</text>
                </div>
                <scroller :style="scrollStyle1">
                    <div class="classification_box">
                        <div class="classification" v-for="(item, index) in foodtoolData" :key='index'>
                            <text class="classification_type">{{item.name}}（{{item.perUnitG}}g/份、{{item.kcal}}kcal）</text>
                            <div class="symbol_box">
                                <div class="symbol_a" @click="symbolReduce(index)"><text class="symbol_word">-</text></div>
                                <text class="symbol_num">{{item.value}}</text>
                                <div class="symbol_b" @click="symbolAdd(index)"><text class="symbol_word">+</text> </div>
                            </div>
                        </div>
                    </div>
                </scroller>
                <div :class="[theSum == number ? 'replace_box' : 'replace_on']" @click="replaceData" style="width: 750px; position: absolute;bottom: 0;left: 0;"><text class="replace_word">替换</text></div>
            </div>
        </wxc-popup>
    </div>
</template>
<script>
    import { WxcMinibar, WxcPopup, Utils } from "weex-ui"
    import { createLink, printLog, storage_getItem} from "../../../shared/utils";
    import api from '../../../shared/request'
    const modal = weex.requireModule("modal");
    export default {
        components: {
            WxcMinibar,
            WxcPopup
        },
        data () {
            return {
                drId: '', // 医师id
                isBottomShow: false,
                baseURL: "",
                mbrId: "15081209790-mbr",
                totalEnergy: '', // 总能量
                PLU_ENERGY: '', // 水果总能量
                breData: [], // 早餐
                lunData: [], // 午餐
                dinData: [], // 晚餐
                fruitsData: [], // 水果
                FOOD_DATA: [],
                foodtoolData: [],
                number: 0, // 总份数
                symbol_num: 0, // 选择份数
                share_num: 0,
                theSum: 0,
                replaceTotal: [], // 替换数据
                replaceName: '', // 替换名称
                breFood: [], // 早
                lunFood: [], // 午
                dinFood: [], // 晚
                fluFood: [], // 水果
                timeSlot: '',
                name: '',
                prescriptionVo: [], // 替换修改数据
                type: null,
            }
        },
        created () {
            this.foodQuantity()
            if (WXEnvironment.platform == "Web") {
                this.scrollStyle = {
                    width: "750px",
                    height: Utils.env.getPageHeight() - 100 + "px"
                }
                this.scrollStyle1 = {
                    width: "750px",
                    height: '400px'
                } 
            } else {
                this.scrollStyle = {
                    width: "750px",
                    height: Utils.env.getPageHeight() + "px"
                }
                this.scrollStyle1 = {
                    width: "750px",
                    height: '400px'
                }
            }
        },
        methods: {
            foodQuantity: async function() {
                this.breFood = [] // 早
                this.lunFood = [] // 午
                this.dinFood = [] // 晚
                this.fluFood = [] // 水果
                // this.mbrId = await storage_getItem("mbrId");
                this.baseURL = await storage_getItem("newApiBase");
                console.log(this.mbrId, this.baseURL);
                // let mbrId = '15081209790-mbr'
                let ps = {
                    patientId: this.mbrId
                }
                api.get(`${this.baseURL}health/patient/teamInfo?`, ps, data => {
                    console.log(data, 'drId')
                    if (data.code == 200) {
                        this.drId = data.data.drId
                        let params = {
                            drId: this.drId
                        }
                        api.get(`${this.baseURL}health/food/prescription/0/${this.mbrId}?`, params, data => {
                            this.prescriptionVo	= data.data
                            console.log(data)
                            if (data.code == 200) {
                                for (let i in data.data) {
                                    if (i == 'totalEnergy') { // 总能量
                                        this.totalEnergy = data.data[i]
                                    } else if (i == 'fruitEnergy') { // 水果能量
                                        this.PLU_ENERGY = data.data[i]
                                    } else if (i == 'bre') { // 早餐
                                        this.breData.push(data.data[i])
                                    } else if (i == 'lun') { // 午餐
                                        this.lunData.push(data.data[i])
                                    } else if (i == 'din') { // 晚餐
                                        this.dinData.push(data.data[i])
                                    } else if (i == 'fruits') { // 水果
                                        this.fruitsData = data.data[i]
                                    }
                                }
                            }
                        })
                    }
                })
            },
            openBottomPopup (type, data, solt) {
                this.replaceName = ''
                this.type = type
                this.FOOD_DATA = data
                this.isBottomShow = true;
                this.timeSlot = solt
                this.foodtoolData = []
                this.number = 0
                let params = {
                    types: type
                }
                if (type == 1) {
                    this.replaceName = '谷薯类'
                } else if (type == 2) {
                    this.replaceName = '蔬菜类'
                } else if (type == 3) {
                    this.replaceName = '肉蛋类'
                } else if (type == 4) {
                    this.replaceName = '大豆类'
                } else if (type == 5) {
                    this.replaceName = '奶类'
                } else if (type == 6) {
                    this.replaceName = '水果类'
                } else if (type == 7) {
                    this.replaceName = '油脂类'
                }
                api.get(`${this.baseURL}health/food/tool?`, params, data => {
                    console.log(data)
                    this.foodtoolData = data.data
                    this.foodtoolData.map(item => {
                        this.FOOD_DATA.map(list => {
                            if (list.name.indexOf(item.name) !== -1) {
                                item.value = list.piece
                                this.number += list.piece
                            } else {
                                item.value = 0
                            }
                        })
                    })
                    this.theSum = this.number
                    this.share_num = this.number - this.theSum
                })
            },
            symbolReduce (index) { // 减份数
                let idx = this.foodtoolData[index]
                let reduceNum = 0
                if (idx.value <= 0) {
                    reduceNum = 0
                } else {
                    reduceNum = Number(idx.value) - 0.5
                }
                this.foodtoolData.map(item => {
                    if (item.name == idx.name) {
                        item.value = reduceNum
                    }
                })
                this.theSum = 0
                this.foodtoolData.map(item => {
                    this.theSum += Number(item.value)
                })
                this.share_num = this.number - this.theSum
                // this.foodQuantity()
                this.$forceUpdate()
            },
            symbolAdd (index) { // 添加份数
                let idx = this.foodtoolData[index]
                this.foodtoolData.map(item => {
                    if (this.theSum < this.number && item.name == idx.name) {
                        item.value = Number(idx.value) + 0.5
                    }
                })
                this.theSum = 0
                this.foodtoolData.map(item => {
                    this.theSum += Number(item.value)
                })
                this.share_num = this.number - this.theSum
                // this.foodQuantity()
                this.$forceUpdate()
            },
            prescriptionVoData (name, type) {
                for(let i in this.prescriptionVo) {
                    if(i == name) {
                        for (let j in this.prescriptionVo[i]) {
                            if (j == type) {
                                this.prescriptionVo[i][j] = this.replaceTotal
                            }
                        }
                    }
                }
            },
            replaceData () {
                this.replaceTotal = []
                if (this.number == this.theSum) {
                    this.foodtoolData.map(item => {
                        if (item.value != 0) {
                            let obj = {
                                name: item.name + item.perUnitG + 'g/ ' + item.kcal + 'kcal',
                                piece: item.value
                            }
                            this.replaceTotal.push(obj)
                            if (this.timeSlot == 'BRE' && this.type == 5) {// 早餐牛奶
                                this.prescriptionVoData('bre', 'mils')
                            } else if (this.timeSlot == 'BRE' && this.type == 1) {// 早餐谷署
                                this.prescriptionVoData('BRE', 'gras')
                            } else if (this.timeSlot == '早餐' && this.type == 3) {// 早餐肉蛋
                                this.prescriptionVoData('bre', 'meas')
                            } else if (this.timeSlot == 'LUN' && this.type == 2) {// 午餐蔬菜
                                this.prescriptionVoData('lun', 'vegs')                       
                            } else if (this.timeSlot == 'LUN' && this.type == 4) {// 午餐豆类
                                this.prescriptionVoData('lun', 'beas')                        
                            } else if (this.timeSlot == 'LUN' && this.type == 7) {// 午餐油脂
                                this.prescriptionVoData('lun', 'oils')                       
                            } else if (this.timeSlot == 'LUN' && this.type == 1) {// 午餐谷署
                                this.prescriptionVoData('lun', 'gras')                       
                            } else if (this.timeSlot == 'LUN' && this.type == 3) {// 午餐肉蛋
                                this.prescriptionVoData('lun', 'meas')
                            } else if (this.timeSlot == '晚餐' && this.type == 2) {// 晚餐蔬菜
                                this.prescriptionVoData('din', 'vges')                       
                            } else if (this.timeSlot == '晚餐' && this.type == 1) {// 晚餐谷署
                                this.prescriptionVoData('din', 'gras')                      
                            } else if (this.timeSlot == '晚餐' && this.type == 3) {// 晚餐肉蛋
                                this.prescriptionVoData('din', 'meas')                       
                            } else if (this.timeSlot == '晚餐' && this.type == 7) {// 晚餐油脂
                                this.prescriptionVoData('din', 'oils')                       
                            } else if (this.timeSlot == '水果' && this.type == 6) {// 水果
                                for (let i in this.prescriptionVo) {
                                    if (i == 'fruits') {
                                        this.prescriptionVo[i] = this.FOOD_DATA
                                    }
                                }
                            }
                        }
                    })
                    console.log(this.prescriptionVo)
                    let params = {
                        doctorId: "13693371465-dr",
                        userId: this.mbrId,
                        vo: this.prescriptionVo
                    }
                    api.jsonpost(`${this.baseURL}health/food/uploadThreeMeals`, 
                        JSON.stringify(params),
                        data => {
                        console.log(data)
                        if (data.code == 200) {
                            modal.toast({ message: data.msg, duration: 1 });
                            setTimeout(() => {
                                this.isBottomShow = false;
                            }, 1000)
                        }
                    })
                }
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick () {
                this.isBottomShow = false;
            },
            minibarLeftButtonClick () {},
            minibarRightButtonClick () {
                modal.toast({ 'message': 'click rightButton!', 'duration': 1 });
            },
        }
    }
</script>
<style>
    .wxc-minibar{
        border-bottom-width: 1px;
        border-bottom-color: rgb(221, 221, 221);
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
.food_title{
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
    flex-direction: row;
    align-items: center;
}
.breakfast{
    margin-left: 30px;
    width: 56px;
    height: 50px;
}
.title_word{
    margin-left: 20px;
    font-size: 30px;
    color: rgb(51, 51, 51);
}
.food_content{
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
    padding-bottom: 20px;
}
.food_type{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
}
.name{
    font-size: 26px;
    color: rgb(102, 102, 102);
    margin-left: 30px;
}
.change_data{
    flex-direction: row;
    align-items: center;
    margin-right: 50px;
}
.change_img{
    width: 30px;
    height: 24px;
}
.change_word{
    margin-left: 10px;
    font-size: 24px;
    color: rgb(2, 179, 237);
}
.food_name{
    margin-top: 16px;
    font-size: 24px;
    color:rgb(153, 153, 153);
    margin-left: 30px;
    margin-top: 8px;
}
// ----------------------
.demo_title{
    margin-top: 30px;
    padding-bottom: 20px;
    border-bottom-width: 1px;
    border-bottom-color: rgb(221, 221, 221);
    flex-direction: row;
    justify-content: center;
}
.demo_name{
    font-size: 34px;
    color: rgb(2, 179, 237);
}
.subtitle{
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 38px;
}
.subtitle_word{
    font-size: 30px;
    color: rgb(102, 102, 102);
}
.share_box{
    flex-direction: row;
    align-items: center;
    margin-left: 30px;
}
.share_word{
    font-size: 28px;
    color: rgb(102, 102, 102);
}
.share{
    border-width: 1px;
    border-color: rgb(2, 179, 237);
    border-radius: 5px;
    padding: 2px 20px;
    font-size: 24px;
    color:rgb(2, 179, 237);
    margin-left: 10px;
    margin-right: 10px;
}
.classification_box{
    padding-bottom: 30px;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
}
.classification{
    margin-top: 20px;
    margin-left: 30px;
    margin-right: 30px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.classification_type{
    font-size: 28px;
    color:rgb(2, 179, 237);
}
.symbol_box{
    flex-direction: row;
    align-items: center;
}
.symbol_a, .symbol_b{
    width: 60px;
    height: 50px;
    background-color: #EEEEEE;
}
.symbol_a{
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
}
.symbol_b{
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
}
.symbol_word{
    font-size: 44px;
    color: #CCCCCC;
    text-align: center;
    line-height: 50px;
}
.symbol_num{
    width: 50px;
    height: 50px;
    font-size: 26px;
    color:rgb(2, 179, 237);
    text-align: center;
    line-height: 50px;
    background-color: #F8F8F8;
}
.replace_box, .replace_on{
    height: 90px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.replace_box{
    background-color: rgb(2, 179, 237);
}
.replace_on{
    background-color: rgb(153, 153, 153);
}
.replace_word{
    font-size: 36px;
    color: rgb(255, 255, 255);
}
</style>


