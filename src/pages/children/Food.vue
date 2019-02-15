<template>
    <div class="box">
        <wxc-minibar title="今日饮食"
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
            <scroller :style="scrollStyle">    
                <div class="each_item">
                    <div @click="jump('todaydiet')" class="diet_item" style="position: relative;">
                        <image class="diet_records" :src="getImgPath('diet_records.png')"/>
                        <text class="diet_word" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);">饮食记录</text>
                    </div>
                    <div @click="jump('heatquery')" class="diet_item" style="position: relative;">
                        <image class="diet_records" :src="getImgPath('heat.png')"/>
                        <text class="diet_word" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);">热量查询</text>
                    </div>
                    <div @click="jump('proposal')" class="diet_item" style="position: relative; marginBottom: 15px;">
                        <image class="diet_records" :src="getImgPath('three_meals.png')"/>
                        <text class="diet_word" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);">三餐建议</text>
                    </div>
                    <div @click="jump('dietquestions')" class="diet_item" style="position: relative; marginBottom: 15px;">
                        <image class="diet_records" :src="getImgPath('questions.png')"/>
                        <text class="diet_word" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);">饮食提问</text>
                    </div>
                </div>
                <div class="programme">
                    <div class="programme_title">
                        <image class="icon_program" :src="getImgPath('icon_program.png')"/>
                        <text class="program_word">饮食管理方案</text>
                    </div>
                    <div class="quantity">
                        <div style="width: 95%; marginLeft: 5%;">
                            <div class="beCareful_title">
                                <image class="icon_border" :src="getImgPath('icon.png')"/>
                                <text class="beCareful_word">每日总热量控制</text>
                            </div>
                            <div class="quantity-word">
                                <b class="word">根据您的劳动强度和理想体重数值，建议您每天摄入的总热量为：<i class="quantity_of_heat">{{TOTAL_ENERGY}}</i></b>
                            </div>
                            <div class="classification" style="width: 95%; marginRight: 5%;">
                                <div class="item">
                                    <text class="kcal">{{CARBO_ENERGY}}</text>
                                    <text class="name">碳水化合物</text>
                                </div>
                                <div class="item">
                                    <text class="kcal">{{PROT_ENERGY}}</text>
                                    <text class="name">蛋白质</text>
                                </div>
                                <div class="item">
                                    <text class="kcal">{{FAT_ENERGY}}</text>
                                    <text class="name">脂肪</text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="quantity">
                        <div style="width: 95%; marginLeft: 5%;">
                            <div class="beCareful_title">
                                <image class="icon_border" :src="getImgPath('icon.png')"/>
                                <text class="beCareful_word">每日总饮食量控制</text>
                            </div>
                            <div class="Meal_plate_box">
                                <image class="Meal_plate" :src="getImgPath('Meal_plate.png')"/>
                            </div>
                            <div class="table">
                                <div class="targetTable">
                                    <text class="table_td">类别</text>
                                    <text class="table_td">饮食量</text>
                                </div>
                                <div class="targetTbody">
                                    <text class="table_tr">主食</text>
                                    <text class="table_tr">{{MAIN}}</text>
                                </div>
                                <div class="targetTbody">
                                    <text class="table_tr">蛋白质</text>
                                    <text class="table_tr">{{PROTEIN}}</text>
                                </div>
                                <div class="targetTbody">
                                    <text class="table_tr">脂肪</text>
                                    <text class="table_tr">{{FAT}}</text>
                                </div>
                                <div class="targetTbody">
                                    <text class="table_tr">蔬菜</text>
                                    <text class="table_tr">{{VEGET}}</text>
                                </div>
                                <div class="targetTbody">
                                    <text class="table_tr">水果</text>
                                    <text class="table_tr">{{FRUIT}}</text>
                                </div>
                                <div class="targetTbody">
                                    <text class="table_tr">牛奶</text>
                                    <text class="table_tr">{{MILK}}</text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="beCareful">
                        <div style="width: 95%; marginLeft: 5%;" class="beCareful_box">
                            <div class="beCareful_title">
                                <image class="icon_border" :src="getImgPath('icon.png')"/>
                                <text class="beCareful_word">其他注意事项</text>
                            </div>
                            <div>
                                <text class="subtitle">一、禁酒或严格限酒：</text>
                                <text class="describe">建议您禁酒。在“不得不饮酒”时，建议少量，酒精量单日不超过25g。计算方法大致为：</text>
                                <div class="method">
                                    <text class="method_list">葡萄酒＜100～150 ml（相当于2～3两）;</text>
                                    <text class="method_list">啤酒＜250～500 ml（半斤～1斤）;</text>
                                    <text class="method_list">白酒＜25～50 ml（半两～1两）。</text>
                                </div>
                                <text class="describe">饮酒要尽量放慢饮酒速度，避免“干杯”或“一口饮”，饮酒要伴餐，减缓酒精的吸收速度。</text>
                            </div>
                            <div>
                                <text class="subtitle">二、限盐：</text>
                                <text class="describe">因盐摄入过多与高血压发病密切相关，建议每天所吃各种食物的含盐总量不超过6克（大约是啤酒瓶盖一平盖的盐量）。</text>
                            </div>
                            <div>
                                <text class="subtitle">三、对食用油的选择：</text>
                                <text class="describe">(1) 每日烹调油用量＜25g（半两，相当于2.5汤匙）；</text>
                                <text class="describe">(2) 选择脂肪酸数量及构成比合理的油脂，如橄榄油、茶油等；</text>
                                <text class="describe">(3) 控制烹调温度，油温不宜太高，油温越高，烹调时间越长，不饱和脂肪酸氧化越快，营养成分流失越多。</text>
                            </div>
                            <div>
                                <text class="subtitle">四、不食用或少食用的食物：</text>
                                <text class="describe">(1) 高钠食物：咸菜、榨菜、咸鱼、咸肉、腌制食品、烟熏食品、火腿、含钠高的调味料酱料等；从防癌角度出发，您应该尽量不吃或少吃所列食物。腌菜中的有害成分是亚硝酸盐，亚硝酸盐最多的时候出现在开始腌制以后的两三天到十几天之间。我国北方地区腌咸菜、酸菜的时间通常在一个月以上，南方地区腌酸菜、泡菜也要20天以上，这时候拿出来吃，是安全的。真正危险的，正是那种只腌两三天到十几天的腌菜，其中含有大量的亚硝酸盐和二级胺, 在胃内适宜酸度或细菌的作用下, 能合成亚硝胺类化合物, 这类化合物是很强的致癌物质。腌制过程对胡萝卜素、维生素及叶酸的破坏很大。</text>
                                <text class="describe">(2) 高脂肪、高胆固醇食物：动物内脏、肥肉、禽皮、蛋黄、鱼子、油炸食品；过多进食高脂肪、高胆固醇食物，会使血液中甘油三脂、胆固醇含量增高，会造成血管硬化，是高血压，心脏病等病症的发病主因。</text>
                                <text class="describe">(3) 糖类、辛辣刺激的调味品、浓咖啡、浓茶等，吃过多的糖类食品会使机体的脂质和糖代谢异常，大量葡萄糖在肝脏中代谢为脂肪，致使热量过剩，引起肥胖，并易患高血压、糖尿病。因此，少吃奶油糕点等甜食可以减少这些疾病的患病风险。</text>
                            </div>
                            <div>
                                <text class="subtitle">五、每天喝足量的水：</text>
                                <text class="describe">每天要喝够1500毫升水，如果常用水杯是250毫升,每天要饮6杯水。</text>
                                <text class="method_list">饮水应注意四点问题：</text>
                                <div>
                                    <text class="describe">(1) 要主动喝水，不要认为口渴了才需喝水，其实口渴时人体已经缺水。</text>
                                    <text class="describe">(2) 喝水不要暴饮。暴饮会加重心、肺、胃肠的负担，引发消化不良和胃下垂等。</text>
                                    <text class="describe">(3) 也不要饮水过量，过量会增加有关器官负担。</text>
                                    <text class="describe">(4) 早晨人的血液凝固度比晚上大20倍，早晨锻炼者应多喝水，这样能把血液中可能产生的活化因子加以稀释，并经血液的冲刷作用又可把局部的凝血物冲散。同时也能补充运动和夜晚丢失的水分。</text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroller>
        </div>
    </div>
</template>
<script>
    import { WxcMinibar, Utils } from "weex-ui"
    import { createLink, storage_getItem} from "../../shared/utils";
    import api from '../../shared/request'
    const modal = weex.requireModule("modal");
    export default {
        components: {
            WxcMinibar
        },
        data () {
            return {
                baseURL: "",
                mbrId: "",
                TOTAL_ENERGY: '', // 总热量控制
                CARBO_ENERGY: '', // 碳水化合物
                PROT_ENERGY: '', // 蛋白质
                FAT_ENERGY: '', // 脂肪
                MAIN: '', // 饮食量主食
                PROTEIN: '', // 饮食量蛋白质
                FAT: '', // 饮食量脂肪
                VEGET: '', // 饮食量蔬菜
                FRUIT: '', // 饮食量水果
                MILK: '', // 饮食量牛奶
            }
        },
        created () {
            this.foodQuantity()
            if (WXEnvironment.platform == "Web") {
                this.scrollStyle = {
                    width: "750px",
                    height: Utils.env.getPageHeight() - 100 + "px"
                } 
            } else {
                this.scrollStyle = {
                    width: "750px",
                    height: Utils.env.getPageHeight() + "px"
                }
            }
        },
        methods: {
            foodQuantity: async function() {
                this.mbrId = await storage_getItem("mbrId");
                this.baseURL = await storage_getItem("newApiBase");
                // this.date = await storage_getItem("date");
                console.log(this.mbrId, this.baseURL);
                let params = {
                    userId: this.mbrId
                }
                api.get(`${this.baseURL}health/food/dailyControl/${this.mbrId}`, {}, data => {
                    console.log(data)
                    let datas = data.data
                    this.TOTAL_ENERGY = datas.TOTAL_ENERGY
                    this.CARBO_ENERGY = datas.CARBO_ENERGY
                    this.PROT_ENERGY = datas.PROT_ENERGY
                    this.FAT_ENERGY = datas.FAT_ENERGY
                    this.MAIN = datas.MAIN
                    this.PROTEIN = datas.PROTEIN
                    this.FAT = datas.FAT
                    this.VEGET = datas.VEGET
                    this.FRUIT = datas.FRUIT
                    this.MILK = datas.MILK
                })
            },
            jump(path) {
                if (!path) return;
                const navigator = weex.requireModule("navigator");
                navigator.push({
                    url: createLink(path),
                    animated: "true"
                });
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
        background-color: #EEEEEE;
    }
    .each_item{
        flex-direction: row;
        flex-wrap: wrap;
        background-color: rgb(255, 255, 255);
    }
    .diet_item{
        width: 342px;
        height: 146px;
        margin-top: 15px;
    }
    .diet_item:nth-child(odd){
        margin-left: 30px;
    }
    .diet_item:nth-child(even){
        margin-left: 15px;
    }
    .diet_records{
        width: 342px;
        height: 146px;
    }
    .diet_word{
        font-size: 34px;
        color:rgb(255, 255, 255);
    }
    .programme{
        margin-top: 20px;
        background-color: rgb(255, 255, 255);
    }
    .programme_title{
        padding-top: 20px;
        padding-bottom: 20px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .icon_program{
        width: 36px;
        height: 48px;
    }
    .program_word{
        font-size: 34px;
        color: rgb(2, 179, 237);
        margin-left: 20px;
    }
    .quantity-word{
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 20px;
        margin-left: 20px;
    }
    .word{
        font-size: 28px;
        color:rgb(102, 102, 102);
    }
    .quantity_of_heat{
       font-size: 28px;
       color: rgb(2, 179, 237); 
    }
    .classification{
        flex-direction: row;
        justify-content: space-around;
        background-color: #F8F8F8;
        border-radius: 10px;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .item{
        flex: 1;
        flex-direction: column;
        align-items: center;
        margin-top: 40px;
        margin-bottom: 40px;
        border-right-width: 1px;
        border-right-color: rgb(221, 221, 221);
    }
    .item:last-child{
        border: none;
    }
    .kcal{
        font-size: 30px;
        color:rgb(2, 179, 237);
        margin-bottom: 20px;
    }
    .name{
        font-size: 28px;
        color: rgb(102, 102, 102);
    }
    .beCareful, .quantity{
        border-top-width: 1px;
        border-top-color: rgb(221, 221, 221);
    }
    .beCareful_title{
        flex-direction: row;
        align-items: center;
        margin-top: 12px;
        padding-bottom: 12px;
        border-bottom-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
    }
    .icon_border{
        width: 10px;
        height: 44px;
    }
    .beCareful_word{
        font-size: 30px;
        color: rgb(51, 51, 51);
        margin-left: 10px;
    }
    .Meal_plate_box{
        flex-direction: row;
        justify-content: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .Meal_plate{
        width: 254px;
        height: 254px;
    }
    .table{
        width: 644px;
        margin-left: 20px;
        margin-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: rgb(221, 221, 221);
    }
    .targetTable, .targetTbody{
        flex-direction: row;
    }
    .targetTable{
        background-color: rgb(204, 242, 255);
    }
    .table_td, .table_tr{
        height: 60px;
        text-align: center;
        line-height: 60px;
    }
    .table_td{
        font-size: 28px;
        color:rgb(2, 179, 237);
    }
    .table_tr{
        color: rgb(102, 102, 102);
    }
    .table_td:nth-child(1), .table_tr:nth-child(1){
        width: 161px;
        border-top-width: 1px;
        border-top-color: rgb(221, 221, 221);
        border-left-width: 1px;
        border-left-color: rgb(221, 221, 221)
    }
    .table_tr:nth-child(1){
        font-size: 26px
    }
    .table_tr:nth-child(2){
        font-size: 24px;
    }
    .table_td:nth-child(2), .table_tr:nth-child(2){
        width: 483px;
        border-top-width: 1px;
        border-top-color: rgb(221, 221, 221);
        border-right-width: 1px;
        border-right-color: rgb(221, 221, 221);
        border-left-width: 1px;
        border-left-color: rgb(221, 221, 221)
    }
    .subtitle{
        font-size: 28px;
        color: rgb(2, 179, 237);
        margin-top: 20px;
    }
    .describe{
        margin-top: 14px;
        font-size: 26px;
        color:rgb(102, 102, 102);
    }
    .method{
        margin-top: 20px;
    }
    .method_list{
        font-size: 26px;
        color:rgb(2, 179, 237);
    }
</style>


