<template>
    <div class='echarts'></div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line"; /** */
import "echarts/lib/chart/lines"; /** */
import "echarts/lib/chart/bar"; /** */
import "echarts/lib/chart/pie"; /** */
import "echarts/lib/chart/gauge"; /** */
import "echarts/lib/chart/map"; /** */
import "echarts/lib/chart/radar"; /**雷达图坐标系组件，只适用于雷达图。 */
import "echarts/lib/chart/scatter"; /** */
import "echarts/lib/chart/effectScatter"; /** */
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/chart/custom'/** */
import "echarts/lib/component/tooltip"; /**提示框*/
import "echarts/lib/component/polar"; /** */
import "echarts/lib/component/geo"; /** 地理坐标系组件。*/
import "echarts/lib/component/legend"; /**图例组件。 */
import "echarts/lib/component/title"; /**标题组件，包含主标题和副标题。*/
import 'echarts/lib/component/markLine';
import "echarts/lib/component/visualMap"; /** */
import 'echarts/lib/component/calendar'
export default {
  name: "bmchart",
  props: {
    options: {
      type: String,
      default() {
        return "{}";
      }
    }
  },
  data() {
    return {
      myChart: ""
    };
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(this.$el);
    // var formatOptions = JSON.parse(JSON.parse(this.options), function(k, v) {
    //     if (v.indexOf && v.indexOf("function") > -1) {
    //       return eval("(function(){return " + v + " })()");
    //     }

    //     return v;
    //   });

    // // 绘制图表
    // this.myChart.setOption(formatOptions);
  },
  methods: {
    setOption(options, notMerge = false) {
      var formatOptions = JSON.parse(JSON.parse(options), function(k, v) {
        if (v.indexOf && v.indexOf("function") > -1) {
          return eval("(function(){return " + v + " })()");
        }

        return v;
      });

      this.myChart.setOption(formatOptions, notMerge);
    }
  }
};
</script>

