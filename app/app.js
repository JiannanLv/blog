import React from 'react';
import { render } from 'react-dom';
import thunkMiddleware from 'redux-thunk' 
import {Provider,connect} from 'react-redux'
import {combineReducers, createStore, applyMiddleware} from "redux"
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory,hashHistory } from 'react-router'

import stores from './reducers/index'
import Index from './components/index'
import Publish from './components/publish'
import Details from './components/details'
import About from './components/about'
import Footer from './components/footer'

import MobBox from './containers/mobbox'
import Nav from './containers/nav'
import TipsBox from './containers/tipsBox'


import './css/app.css'

let store=createStore(
  stores,
  applyMiddleware(thunkMiddleware)
)

class App extends React.Component {
	constructor(props) {
    super(props)
 }
  render() {
    return (
        <div className="page">
        	<Nav />
        	<div className="navBox">
          	<ul className="nav content">
                <li><IndexLink to="/" activeClassName="active">首页</IndexLink></li>
                <li><Link to="/publish" activeClassName="active">发布文章</Link></li>
                <li><Link to="/about" activeClassName="active">网站架构</Link></li>
                <li><Link to="/ReactForm" activeClassName="active">建议栏</Link></li>
          	</ul>
        	</div>
        	<div className="container content">
        		{this.props.children}
        	</div>
        	<MobBox />
        	<TipsBox/>
        	<Footer/>
        </div>
        );
  }
}


render((
	<Provider store={store}>
		<Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Index}/>
				<Route path="/publish" component={Publish}/>
				<Route path="/:name/:date/:title" component={Details}/>
				<Route path="/about" component={About}/>
			</Route>
		</Router>
  </Provider>
), document.getElementById('app'));