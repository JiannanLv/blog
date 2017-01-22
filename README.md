1.	确保node和npm的安装，均是最新版本。Node：v6.9.1；npm：3.10.8。
2.	确保MongoDB的安装，MongoDB的安装及配置可以参考网址：http://blog.csdn.net/lvkelly/article/details/54618752
3.	将源码克隆下来，命令：git clone https://github.com/JiannanLv/personnalBlog.git
4.	通过cd，进入blog，之后安装依赖：npm install；由于npm的服务器在国外，安装依赖比较慢，所以建议通过淘宝镜像cnpm安装，cnpm安装的比较快。
cnpm的安装：npm install –g cnpm –registry=https://registry.npm.taobao.org
安装依赖：cnpm install。
5.	依赖安装完成后，程序打包：npm start
6.	程序打包完成后，启动程序：npm build
7.	打开浏览器，输入http://localhost：8900