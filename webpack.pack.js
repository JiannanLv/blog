var path = require('path');
var webpack = require('webpack'); 
var HtmlWebpackPlugin = require('html-webpack-plugin');   // webpack中生成HTML的插件

module.exports = {
  entry: path.resolve(__dirname, 'app/app.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
     publicPath: '',  // 模板、样式、脚本、图片等资源对应的server上的路径
    filename: 'bundle.js'
  },
  
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    // webapck 会给编译好的代码片段一个id用来区分
    // 而这个插件会让webpack在id分配上优化并保持一致性。
    // 具体是的优化是：webpack就能够比对id的使用频率和分布来得出最短的id分配给使用频率高的模块

    new webpack.optimize.UglifyJsPlugin({
      // 压缩代码
      compressor: {
        warnings: false
      }
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // 很多库的内部，有process.NODE_ENV的判断语句，
    // 改为production。最直观的就是没有所有的debug相关的东西，体积会减少很多
    new HtmlWebpackPlugin({
      title: '个人博客',
      filename:'index.html',
      // 文件名以及文件将要存放的位置

      favicon:'./app/images/favicon.ico',
      // favicon路径

      template:'./app/template.html',
      // html模板的路径

      inject:'body',
      // js插入的位置，true/'head'  false/'body'

      hash:true,
      // 这样每次客户端页面就会根据这个hash来判断页面是否有必要刷新
      // 在项目后续过程中，经常需要做些改动更新什么的，一但有改动，客户端页面就会自动更新！

      minify:{
        // 压缩HTML文件
        removeComments:true,
        // 移除HTML中的注释

        collapseWhitespace:false
        // 删除空白符与换行符
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', 'jsx']
  },
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015','react']
      }
    },
    {
 	  test: /\.css$/,
 	  loader: 'style!css'
	}
    ]
  }
}