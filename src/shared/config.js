/**
 * Created by Tw93 on 2016/11/4.
 */

export default {

  // 正常模式的tab title配置
  tabTitles: [
    {
      title: '首页',
      icon: 'http://p8lzo644o.bkt.clouddn.com/btn_home_normal.png',
      activeIcon: 'http://p8lzo644o.bkt.clouddn.com/btn_home_select.png'
    },
    {
      title: '论健',
      icon: 'http://p8lzo644o.bkt.clouddn.com/btn_theory_normal.png',
      activeIcon: 'http://p8lzo644o.bkt.clouddn.com/btn_theory_select.png'
    },
    {
      title: '咨询',
      icon: 'http://p8lzo644o.bkt.clouddn.com/btn_consult_normal.png',
      activeIcon: 'http://p8lzo644o.bkt.clouddn.com/btn_consult_select.png'
    },
    {
      title: '我的',
      icon: 'http://p8lzo644o.bkt.clouddn.com/btn_mine_normal.png',
      activeIcon: 'http://p8lzo644o.bkt.clouddn.com/btn_mine_select.png'
    }
  ],
  tabStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#02b3ed',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: false,
    iconWidth: 46,
    iconHeight: 36,
    width: 160,
    height: 100,
    fontSize: 28,
    textPaddingLeft: 30,
    textPaddingRight: 30
  },

  // 使用 iconFont 模式的tab title配置
  tabIconFontTitles: [
    {
      title: '首页',
      codePoint: '\ue623'
    },
    {
      title: '特别推荐',
      codePoint: '\ue608'
    },
    {
      title: '消息中心',
      codePoint: '\ue752',
      badge: 5
    },
    {
      title: '我的主页',
      codePoint: '\ue601',
      dot: true
    }
  ],
  tabIconFontStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#3D3D3D',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    width: 160,
    height: 120,
    fontSize: 24,
    textPaddingLeft: 10,
    textPaddingRight: 10,
    iconFontSize: 50,
    iconFontMarginBottom: 8,
    iconFontColor: '#333333',
    activeIconFontColor: 'red',
    iconFontUrl: '//at.alicdn.com/t/font_501019_mauqv15evc1pp66r.ttf'
  }
}
