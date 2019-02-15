const path = require('path')
const webpack = require('webpack')
const config = require('./configs/config')
const vueLoaderConfig = require('./configs/vue-loader.conf');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const weexLoaderOptions = {
  loaders: {
    scss: ['sass-loader'],
    sass: [{
      loader: 'sass-loader',
      options: { indentedSyntax: true }
    }],
    less: ['less-loader'],
    stylus: ['stylus-loader'],
    styl: ['stylus-loader']
  }
}
const vueLoaderOptions = {
  optimizeSSR: false,
  postcss: [
    // to convert weex exclusive styles.
    require('postcss-plugin-weex')(),
    require('autoprefixer')({
      browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
    }),
    require('postcss-plugin-px2rem')({
      // base on 750px standard.
      rootValue: 75,
      // to leave 1px alone.
      minPixelValue: 1.01
    })
  ],
  compilerModules: [
    {
      postTransformNode: el => {
        // to convert vnode for weex components.
        require('weex-vue-precompiler')()(el)
      }
    }
  ]
}

function createConfig(option = {}) {
  const { isWeex, minify } = option
  const suffix = `.${isWeex ? 'weex' : 'web'}${minify ? '.min' : ''}.js`
  const webpackConfig = {
    entry: option.entry,
    output: {
      path: path.resolve(__dirname, option.outputPath || 'dist'),
      filename: (option.outputName || 'bundle') + suffix
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules(?!\/.*(weex).*)/
      }, {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: isWeex ? 'weex-loader' : 'vue-loader',
          options: isWeex ? weexLoaderOptions : vueLoaderOptions
        }]
      },
      {
        test: /\.scss$/,
        loader: "css!sass",//这样写样式和脚本会混在一个文件，也就是不分离样式，webpack有插件可以实现分离样式
        exclude: /node_modules/
      }]
    },
    node: config.nodeConfiguration,
    plugins: [
      new FileManagerPlugin({
        onEnd: {
          copy: [
            { source: `dist/${option.outputName}.weex.min.js`, destination: '/Users/mac/Downloads/dl_mbr_android/trunk/dl_mbr/app/src/main/assets/' },
            { source: `dist/${option.outputName}.weex.min.js`, destination: '/Users/mac/Downloads/dl_mbr_ios/trunk/dl_mbr/Weex/bundlejs/' }
          ]
        }
      })
    ]
  }
  const webConfig = {
    entry: option.entry,
    output: {
      path: path.resolve(__dirname, option.outputPath || 'dist'),
      filename: (option.outputName || 'bundle') + suffix
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules(?!\/.*(weex).*)/
      }, {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: 'vue-loader',
          options: Object.assign(vueLoaderConfig({ useVue: true, usePostCSS: false }), {
            /**
             * important! should use postTransformNode to add $processStyle for
             * inline style prefixing.
             */
            optimizeSSR: false,
            postcss: [
              // to convert weex exclusive styles.
              require('postcss-plugin-weex')(),
              require('autoprefixer')({
                browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
              }),
              require('postcss-plugin-px2rem')({
                // base on 750px standard.
                rootValue: 75,
                // to leave 1px alone.
                minPixelValue: 1.01
              })
            ],
            compilerModules: [
              {
                postTransformNode: el => {
                  // to convert vnode for weex components.
                  require('weex-vue-precompiler')()(el)
                }
              }
            ]

          })
        }]
      }, {
        test: /\.scss$/,
        loader: "css!sass",//这样写样式和脚本会混在一个文件，也就是不分离样式，webpack有插件可以实现分离样式
        exclude: /node_modules/
      }]
    },
    plugins: []
  }
  const weexConfig = {
    entry: option.entry,
    output: {
      path: path.resolve(__dirname, option.outputPath || 'dist'),
      filename: (option.outputName || 'bundle') + suffix
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader'
          }]
        },
        {
          test: /\.vue(\?[^?]+)?$/,
          use: [{
            loader: 'weex-loader',
            options: vueLoaderConfig({ useVue: false })
          }]
        },
        {
          test: /\.(otf|eot|svg|ttf|woff|woff2)/,
          use: "url-loader?limit=50000&name=[path][name].[ext]"
        },
        {
          test: /\.css/,
          use: ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]?[hash]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]?[hash]'
          }
        }, {
          test: /\.scss$/,
          loader: "css!sass",//这样写样式和脚本会混在一个文件，也就是不分离样式，webpack有插件可以实现分离样式
          exclude: /node_modules/
        }
      ]
    },
    node: config.nodeConfiguration,
    plugins: [
    ]
  }

  // if (minify && isWeex) {
  //   weexConfig.plugins.push(new UglifyJSPlugin())
  //   weexConfig.plugins.push(new webpack.BannerPlugin({
  //     banner: '// { "framework": "Vue" }\n"use weex:vue";\n',
  //     raw: true
  //   }))
  //   weexConfig.plugins.push(new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify('release')
  //   }))
  //   return weexConfig
  // }
  // if (!minify && isWeex) {
  //   weexConfig.plugins.push(new webpack.BannerPlugin({
  //     banner: '// { "framework": "Vue" }\n"use weex:vue";\n',
  //     raw: true
  //   }))
  //   weexConfig.plugins.push(new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify('debug')
  //   }))
  //   return weexConfig
  // }
  // if (minify && !isWeex) {
  //   webConfig.plugins.push(new UglifyJSPlugin())
  //   webConfig.plugins.push(new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify('release')
  //   }))
  //   return webConfig
  // }
  // if (!minify && !isWeex) {
  //   webConfig.plugins.push(new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify('debug')
  //   }))
  //   return webConfig
  // }

  if (minify && isWeex) {
    webpackConfig.plugins.push(new UglifyJSPlugin())
    webpackConfig.plugins.push(new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" }\n"use weex:vue";\n',
      raw: true
    }))
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('release')
    }))
    return webpackConfig
  }
  if (!minify && isWeex) {
    webpackConfig.plugins.push(new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" }\n"use weex:vue";\n',
      raw: true
    }))
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('debug')
    }))
    return webpackConfig
  }
  if (minify && !isWeex) {
    webpackConfig.plugins.push(new UglifyJSPlugin())
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('release')
    }))
    return webpackConfig
  }
  if (!minify && !isWeex) {
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('debug')
    }))
    return webpackConfig
  }

}

function generateWebpackConfigs(options) {
  const buildOptions = []
  for (const name in options) {
    const option = typeof options[name] === 'string'
      ? ({ entry: options[name] })
      : options[name]
    option.outputName = name
    buildOptions.push(Object.assign({}, option, { isWeex: true, minify: false }))
    buildOptions.push(Object.assign({}, option, { isWeex: false, minify: false }))
    buildOptions.push(Object.assign({}, option, { isWeex: true, minify: true }))
    buildOptions.push(Object.assign({}, option, { isWeex: false, minify: true }))
  }
  return buildOptions.map(createConfig)
}

module.exports = generateWebpackConfigs({
  app: path.resolve('src/entries', 'app.js'),
  guide: path.resolve('src/entries', 'guide.js'), // 引导页

  register: path.resolve('src/entries/children/register', 'register.js'), // 注册
  agreement: path.resolve('src/entries/children/register', 'agreement.js'), // 服务协议
  perfectInformation: path.resolve('src/entries/children/register', 'perfectInformation.js'), // 完善信息
  
  home: path.resolve('src/entries/tab', 'home.js'),
  onhealth: path.resolve('src/entries/tab', 'onhealth.js'),
  archives: path.resolve('src/entries/children', 'archives.js'), // 我的健康档案

  healthReport: path.resolve('src/entries/children', 'healthReport.js'), // 健康报告
  historicalReport: path.resolve('src/entries/children/presentation', 'historicalReport.js'), // 历史健康报告
  generationReport: path.resolve('src/entries/children/presentation', 'generationReport.js'), // 历史健康报告详情

  motion: path.resolve('src/entries/children', 'motion.js'), // 今日运动详情页
  exerciseprescription: path.resolve('src/entries/children/children', 'exerciseprescription.js'), // 运动处方页
  measured: path.resolve('src/entries/children', 'measured.js'), // 今日必测详情页
  todaydiet: path.resolve('src/entries/children', 'todaydiet.js'), // 今日饮食详情页
  read: path.resolve('src/entries/children', 'read.js'), // 今日必读详情页
  food: path.resolve('src/entries/children', 'food.js'),

  message: path.resolve('src/entries/children/archives', 'message.js'), // 个人信息
  examination: path.resolve('src/entries/children/archives', 'examination.js'), // 体检指标
  indicatorMonitoring: path.resolve('src/entries/children/archives', 'indicatorMonitoring.js'), // 指标监测

  weight: path.resolve('src/entries/children/children', 'weight.js'), // 体重检测
  bodyfat: path.resolve('src/entries/children/bodyfat', 'bodyfat.js'), // 体脂秤测量
  bodyfatneedbinding: path.resolve('src/entries/children/bodyfat', 'bodyfatneedbinding.js'), // 体重提示搜索
  bodyfatsearch: path.resolve('src/entries/children/bodyfat', 'bodyfatsearch.js'), // 体重搜索
  pressure: path.resolve('src/entries/children/children', 'pressure.js'), // 血压监测
  sugar: path.resolve('src/entries/children/children', 'sugar.js'), // 血糖监测

  article_list: path.resolve('src/entries/children/onhealth', 'article_list.js'),
  article: path.resolve('src/entries/children/onhealth', 'article.js'),
  historyLog: path.resolve('src/entries/children/diet', 'historyLog.js'),
  recorded: path.resolve('src/entries/children/diet', 'recorded.js'),
  supplement: path.resolve('src/entries/children/diet', 'supplement.js'),
  dietquestions: path.resolve('src/entries/children/diet', 'dietquestions.js'), // 饮食提问
  heatquery: path.resolve('src/entries/children/diet', 'heatquery.js'), // 热量查询
  proposal: path.resolve('src/entries/children/diet', 'proposal.js'), // 三餐建议
  historyRead: path.resolve('src/entries/children/read', 'historyRead.js'),
  readDetails: path.resolve('src/entries/children/read', 'readDetails.js'),

  // 咨询
  teamIntroduce: path.resolve('src/entries/children/team', 'teamIntroduce.js'), // 团队介绍
})
