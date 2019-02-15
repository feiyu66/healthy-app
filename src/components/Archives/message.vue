<template>
  <div class="message">
      <div class="details">
          <text class="attribute">头像</text>
          <image class="dialog_img" :src="getImgPath('dialog.png')"/>
      </div>
      <div class="details">
          <text class="attribute">姓名</text>
          <text class="name">张家口</text>
      </div>
      <div class="details">
          <text class="attribute">性别</text>
          <text class="name">张家口</text>
      </div>
      <div class="details">
          <text class="attribute">出生日期</text>
          <text class="name">1555-04-32</text>
      </div>
      <div class="details">
          <text class="attribute">手机号</text>
          <text class="name">张家口</text>
      </div>
      <div class="details">
          <text class="attribute">身份证号</text>
          <text class="name">张家口</text>
      </div>
      <div class="details">
          <text class="attribute">身高</text>
          <text class="name">张家口</text>
      </div>
      <div class="details">
          <text class="attribute">体重</text>
          <text class="name">血型</text>
      </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less" scoped>
.message{
    background-color: rgb(255, 255, 255);
}
.details{
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
    padding-bottom: 10px;
    margin-top: 10px;
}
.attribute{
    margin-left: 30px;
}
.dialog_img{
    width: 82px;
    height: 82px;
    margin-right: 20px;
}
.name{
    margin-right: 20px;
}
</style>

