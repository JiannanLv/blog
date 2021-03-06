
import React,{Component} from "react"
import { render } from 'react-dom'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions/index'

export class Reg extends Component{
  constructor(props) {
    super(props)
    this.userName
    this.password
    this.repassword
  }
  submitReg(){
    let _alert=this.props.actions._alert
    if(this.userName.value.length<2){
      _alert("用户名长度为2-10位数")
      return
    }
    if((/\s/ig).test(this.userName.value)){
      _alert("用户名不能有空格")
      return
    }
    if(this.password.value.length<6){
      _alert("密码长度为6-16位数")
      return
    }
    if((/\s/ig).test(this.password.value)){
      _alert("密码不能有空格")
      return
    }
    if(this.password.value!==this.repassword.value){
      _alert("两次输入的密码不一致")
      return
    }
    let data="userName="+this.userName.value+"&password="+this.password.value;
    console.log(data);
    this.props.actions.loginSubmit("regSubmit",data)
  }
  render(){
    return (
    				<div className="innerMobBox reg" onClick={(e)=>{e.stopPropagation()}}>
                <i className="close" onClick={()=>{this.props.actions.mobBoxData("mobBoxClose")}}>X</i>
                <div className="regtitle">欢迎注册</div>
                <div className="item">
                  <div className="name">用户名：</div>
                  <div className="inputDiv">
                    <input type="text" name="userName" ref={el=>{this.userName=el}} maxLength="10" placeholder="长度为2-10"/>
                  </div>
                </div>
                <div className="item">
                  <div className="name">密码：</div>
                  <div className="inputDiv">
                    <input type="password" name="password" ref={el=>{this.password=el}} maxLength="16"  placeholder="长度为6-16"/>
                  </div>
                </div>
                <div className="item">
                  <div className="name">确认密码：</div>
                  <div className="inputDiv">
                    <input type="password" name="password" maxLength="16" ref={el=>{this.repassword=el}}  placeholder="长度为6-16"/>
                  </div>
                </div>
                <div className="regbtn" onClick={()=>{this.submitReg()}}>注册</div>
          </div>
       );
  }
}

const mapStateToProps=(state)=>{
    return {reg:state.reg}
}
const mapDispatchToProps=(dispatch)=>{
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}
export default connect(
    mapStateToProps,//只要 Redux store 发生改变，mapStateToProps 函数就会被调用。该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并,如果你省略了这个参数，你的组件将不会监听 Redux store。如果指定了该回调函数中的第二个参数 ownProps，则该参数的值为传递到组件的 props，而且只要组件接收到新的 props，mapStateToProps 也会被调用
    mapDispatchToProps//如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，而且这个对象会与 Redux store 绑定在一起，其中所定义的方法名将作为属性名，合并到组件的 props 中。如果传递的是一个函数，该函数将接收一个 dispatch 函数，然后由你来决定如何返回一个对象，这个对象通过 dispatch 函数与 action creator 以某种方式绑定在一起（提示：你也许会用到 Redux 的辅助函数 bindActionCreators()）。如果你省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注入到你的组件 props 中。如果指定了该回调函数中第二个参数 ownProps，该参数的值为传递到组件的 props，而且只要组件接收到新 props，mapDispatchToProps 也会被调用。
)(Reg)

