import 'isomorphic-fetch';
import Promise from 'es6-promise'
import {hashHistory } from 'react-router';
export const requestAPI="http://localhost:8900/";


export const SwitchTab=(type,data)=>{
    return {
          type:"containers",
          data
    }  
}


export const mobBoxData=(type,data)=>{
    switch(type){
      case "loginShow":
        return {
            type:"loginShow",
            isShow:type
        }
      case "regShow":
        return {
            type:"regShow",
            isShow:type
        }
      case "mobBoxClose":
        return {
            type:"mobBoxClose",
            isShow:false
        }
      case "loginSubmit":
        return {
            type:"loginSubmit",
            data
        }
      case "regSubmit":
        return {
            type:"regSubmit",
            data
        }
    }
}
/*登录切换上面欢迎条
@type 登录or退出登录
*/
export const loginTop=(type,data)=>{
  switch(type){
    case "loginIn":
      return {
        type:"loginIn",
        data
      }
    case "loginOut":
      return {
        type:"loginOut"
      }
  }
}
const tipsBox=(messgage,type)=>{
   switch(type){
    case "showTips":
      return{
        type:"showTips",
        messgage
      }
    case "hideTips":
      return {
        type:"hideTips",
        messgage:""
      }
    default:
      return{
        type:"showTips",
        messgage
      }
  }
}
const submitCallback=(dispatch,params,type,data)=>{
    fetch(requestAPI+params, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function(res) {
      console.log(res);
      return res.json();
    }).then(function(data){
      console.log(data)
      return dispatch(mobBoxData(type,data))
    }).then(function(req){
      let data=req.data
      if(data.code===1000){
        /*登录成功*/
         dispatch(mobBoxData("mobBoxClose"))
         if(type=="loginSubmit"){
            return dispatch(loginTop("loginIn",data))
         }
         if(type=="regSubmit"){
            return _alertStore(dispatch,data.messgage)
         }
      }else{
          return _alertStore(dispatch,data.messgage)
      }
    })
    .catch(function(e) {
      console.error(e)
      /*if(type=="loginSubmit"){
        console.log("登录错误");
      }else{
        console.log("注册错误");
      }*/
    });
}
const loginOutSubmit=(dispatch)=>{
    fetch(requestAPI+"loginOut", {
      credentials: 'include'
    }).then(function(res){
      return res.json()
    }).then(function(data){
      console.log(data)
      dispatch(loginTop("loginOut"))
     return _alertStore(dispatch,"退出成功",function(){
        hashHistory.push('/')
      })
    }).catch(function(e){
      console.error(e)
    })
}
/*登录注册
@type 注册or登录or退出登录
@data 注册数据or登录数据
*/
export const loginSubmit=(type,data)=>{
  return (dispatch,getState)=>{
    switch(type){
      case "loginSubmit":return submitCallback(dispatch,"login",type,data)
      case "regSubmit":return submitCallback(dispatch,"reg",type,data)
      case "loginOut":return loginOutSubmit(dispatch)
      default:return
    }
    
  }
}
/*component里面执行的提示弹出框
@messgage 提示文字
*/
export const _alert=(messgage)=>{
  return(dispatch,getState)=>{
     dispatch(tipsBox(messgage,"showTips"))
     setTimeout(function(){
      dispatch(tipsBox(messgage,"hideTips"))
    }, 1000)
  }
}
/*Store里面执行的提示弹出框
@dispatch 默认
@messgage 提示文字
@fn 提示框消失的回调
*/
export const _alertStore=(dispatch,messgage,fn)=>{
     dispatch(tipsBox(messgage,"showTips"))
     setTimeout(function(){
      dispatch(tipsBox(messgage,"hideTips"))
      fn&&fn()
    }, 1000)
}
/*获取用户登录信息*/
export const getUserInfo=()=>{
  return (dispatch)=>{
      fetch(requestAPI+"getUserInfo",{
        credentials: 'include'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if(data.code===1000){//已登录
              return dispatch(loginTop("loginIn",data))
            }
            if(data.code===1001){
              return dispatch(loginTop("loginOut",data))
            }
        })
        .catch(function(e) {
            console.error(e);
        });
  }
}
/*文章请求
@type 列表or文章详情
@params 如果有代表文章页码切换
*/
export const ajaxData=(type,params)=>{
    return (dispatch,getState)=>{
      var name="";
      switch(type){
        case "index":if(params){name="newsList?page="+params}else{name="newsList"};break;
        case "details":name="a/"+params.name+"/"+params.date+"/"+params.title;break;
        default:return{};
      }
      console.log(name);
      fetch(requestAPI+name,{
        credentials: 'include'
        })
        .then(function(response) {
        	console.log(response);
            return response.json();
        })
        .then(function(data) {
        	console.log(data);
            return dispatch(SwitchTab(type,data));
        })
        .catch(function(e) {
            console.error(e);
        });
    }
}
/*发布作品请求
@data 发布作品的数据
*/
export const publishSubmit=(data)=>{
  return (dispatch,getState)=>{
    fetch(requestAPI + "publish",{
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    })
      .then(function(response) {
          return response.json();
      })
      .then(function(data) {
          console.log(data);
          if(data.code===1000){
            _alertStore(dispatch,"发布成功",function(){
            	hashHistory.push('/');
            });
          }else{
            _alertStore(dispatch,data.messgage)
          }
      })
      .catch(function(e) {
          console.log("请求失败");
      });
	}
}
/*留言
@data 留言提交的数据
@params 提交的URL路由
*/
export const commentsSubmit=(data,params)=>{
  return(dispatch)=>{
      fetch(requestAPI+"a/"+params.name+"/"+params.date+"/"+params.title,
        { method:"POST",
          headers:{"Content-Type": "application/x-www-form-urlencoded"},
          credentials: 'include',
          body:data
        })
      .then(function(response){
       return response.json()
      })
      .then(function(data){
        console.log(data)
        if(data.code===1000){
         return _alertStore(dispatch,"留言成功",function(){
            hashHistory.goBack()
          })
        }else{
          return _alertStore(dispatch,"留言失败",function(){
            hashHistory.goBack()
          })
        }
      })
      .catch(function(e) {
          console.error(e);
      });
  }
}