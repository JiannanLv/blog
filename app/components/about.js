
import React,{Component} from "react"
import { render } from 'react-dom'

class AboutComponent extends Component{
	render(){
		return (
			<div className="AboutWrap">
				<p className="abouttitle">网站架构</p>
				<div className="aboutbody">
					<p>前端 : 采用react、redux和react-router,react-router提供路由。</p>
					<p>后台 : 采用node、express和mongodb。</p>
					<p>交互 : 前端和后台的数据交互采用的是fetch的交互方式,而不是ajax方式。</p>
					<p>构建 : 构建工具是基于webpack打包。</p>
					<p>模块 : 模块化方面基于ES6模块化开发,和react的组件化配合,复用率大大提高。同时配合webpack打包,实现按需加载。</p>
				</div>
			</div>
    	);
	}
}
export default AboutComponent