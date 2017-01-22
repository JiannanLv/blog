import {combineReducers,createStore,applyMiddleware} from "redux"
import thunkMiddleware from 'redux-thunk'



/*切换菜单栏*/
const switchNews = (state = [], action) => {
  switch (action.type) {
    case 'containers':
      return action.data
    default:
      return state
  }
}

/*登录注册框显示隐藏*/
const mobBoxData = (state = {isShow:false,data:{}}, action) => {
  switch (action.type) {
    case 'loginShow':
      return Object.assign({},state,{isShow:action.isShow})
    case 'loginSubmit':
      return Object.assign({},state,{data:action.data})
    case 'regShow':
      return Object.assign({},state,{isShow:action.isShow})
    case 'regSubmit':
      return Object.assign({},state,{data:action.data})
    case 'mobBoxClose':
      return Object.assign({},state,{isShow:false})
    default:
      return state
  }
}
const isLogin = (state={isLogin:false},action)=>{
  switch(action.type){
    case "loginIn":
      return Object.assign({},state,{isLogin:true,info:action.data.info})
    case "loginOut":
      return Object.assign({},state,{isLogin:false})
    default :
      return state
  }
}
const tips=(state={messgage:""},action)=>{
  switch(action.type){
    case "showTips":
      return Object.assign({},state,{messgage:action.messgage})
    case "hideTips":
      return Object.assign({},state,{messgage:action.messgage})
    default :
      return state
  }
}
const stores = combineReducers({//合成reducers
  nav:isLogin,
  container:switchNews,
  mobBoxData:mobBoxData,
  tips:tips
//data:addState,
//ModalBoxIsNone:ModalBoxIsNone,
//ModalBoxData:ModalBoxData
})
export default stores