<template>
    <div class="box">
        <text @click="jump('archives')">我的健康档案</text>
        <text @click="jump('healthReport')">健康报告</text>
    </div>
</template>
<script>
import { createLink } from '../../shared/utils'
var modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
export default {
  name: 'Mine',
  data () {
      return {
          
      }
  },
  created() {},
  methods: {
    jump(path) {
      if (!path) return;
      const navigator = weex.requireModule("navigator");
      navigator.push({
        url: createLink(path),
        animated: "true"
      });
    }
  }
}
</script>
<style scoped>

</style>

