import React, { Component } from 'react';
import styled from "styled-components";
import data from "../../sql/data.json";
import events from "../utils/events.js";
import ReactDOM from 'react-dom';

const UlWrapper = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  li:last-child {
    border-radius: 0 0 5px 5px;
  }
`

const Li = styled.li`
  padding: 10px 0;
  border: 1px solid palevioletred;
  border-top: none;
  transition: opacity .5s;
  .checked {
    background: palevioletred;
  }
  div {
    position:relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  input[type=text] {
    display: none;
    width: 100%;
    text-indent: 1em;
    box-sizing: border-box;
    outline: none;
  }
  & div.active {
    opacity: .5;
  }
  & div.active::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 100%;
    border-top: 1px solid #aaa;
  }
`

const Input = styled.input.attrs({type:"checkbox"})`                       
  width: 0;
  height: 0;
  &::after{
    content: "";
    display: inline-block;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    border: 1px solid palevioletred;
    border-radius: 100%;
  }
  &:checked::after {
    background: palevioletred;
  }
`

const P = styled.p`
  margin: 0;
  flex-grow: 1;
  padding-left: 1em;
  color: #888;
  font-size: 16px;
  word-break: break-all;
  transition: color .5s;
  &:hover {
    color: #000;
  }
` 

const Close = styled.button`
  color: #aaa;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
`

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {text:props.text};
    this.inner = null;
  }
  toggleText = (target) =>{
    const { id } = this.props;
    for (let i = 0;i < data.length;i++) {
      // 此时this.state.checked还没有发生变化，只在生命周期willUpdate中才能第一次监听到变化
      if(id === data[i].id) {
        data[i].text = target.value;   
        break;   
      }
    }
    this.setState({text:target.value});
  }

  // componentWillReceiveProps(props) {
  //   this.setState({text:props.text});
  // }
  componentWillReceiveProps (props){
    // 要想时刻保持state的最新状态，必须在接收新的props时，也更新一下state
    // 因为单纯更新的话，不会卸载组件，constructor不会执行
    this.setState({text:props.text});
  }
  componentDidMount (){
    this.edit = (target) =>{
      const { text } = this.state;
      this.inner = text;

      target.style.display = "block";
      target.focus();
      target.value = text;
      target.onblur = () =>{
        this.toggleText(target);
        target.style.display = "none";
        target.onblur = null;
      }
      target.onkeyup = (ev) =>{
        if(ev.keyCode === 27) {
          this.setState({text:this.inner});
          target.style.display = "none";
          target.onblur = null;
        }else if(ev.keyCode === 13) {
          target.blur();
        }
        else {
          this.setState({text:target.value});
        }
      }
    }

    // events注册时，如果是单独的事件，事件名一定不要重复；
    // 因为在events.emit触发事件时，是按照同名的事件绑定顺序，按次序全部触发的；
    // 这里如果不绑定唯一的id值，将触发所有的edit事件，那么每次的执行都会把所有节点的监听执行，并且以最后一次执行为准
    const { id } = this.props;
    events.addListener("edit" + id,this.edit);
  }
  componentWillUnmount() {
    const { id } = this.props;
    events.removeListener("edit" + id,this.edit);
  }
  render() {
    return (
      <P>{this.state.text}</P>
    )
  }
}

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {checked:props.checked};
  }
  close = () =>{
    const { id,del } = this.props;
    del(id);
  }
  toggleChecked = (ev) =>{
    const { id } = this.props;
    for (let i = 0;i < data.length;i++) {
      // 此时this.state.checked还没有发生变化，只在生命周期willUpdate中才能第一次监听到变化
      if(id === data[i].id) {
        data[i].checked = +ev.target.checked;   
        break;   
      }
    }
    this.setState({checked:+ev.target.checked});
  }

  componentWillReceiveProps(props) {
    // 更新props不会进constructor，所以必须在这更新state
    this.setState({checked:props.checked});
  }
  componentDidMount (){
    const { id } = this.props;
    this.item = ReactDOM.findDOMNode(this.item);
    
    this.item.ondblclick = (ev) =>{
      events.emit("edit" + id,this.changeText);
    }
  }
  componentWillUnmount (){
    this.item.ondblclick = null;
  }
  render(){
    const { checked } = this.state,
          { text,id } = this.props;
    this.changeText = null;
    this.item = null;
   return (
    <Li>
      <div className = {checked ? "active" : null}>
        <Input className = {checked ? "checked" : null} onChange={this.toggleChecked} checked={checked ? 1 : 0}/>
        <Edit ref={tar => this.item = tar} text={text}  id={id}/>
        <Close onClick={this.close}>X</Close>
      </div>
      <P as="input" type="text" ref={tar => this.changeText = tar} />
    </Li>
   )
  }
}

class Ul extends Component {
  constructor(props) {
    super(props);
    this.state = {data:data};
  }
  del = (id) => {
    for(let i = 0;i < data.length;i++) {
      if(id === data[i].id) {
        data.splice(i,1)
        break;
      }
    }
    events.emit("show",window.location.hash);
  }
  Loop(props){
    const { data,del } = props;
    
    const result = data.map((val,i)=>{
      return (
        <List key = {i} {...val} id = {val.id} del = {del}/>
      );
    });

    return result;
  }
  componentDidMount() {
    const funcs = {
      checked(data) {
        return data.filter(val => val.checked);
      },
      unchecked(data) {
        return data.filter(val => !val.checked);
      },
      all(data) {
        return data;
      }
    }

    this.show = (hash) =>{
      hash = /#(.+)/.test(hash) && RegExp.$1;
      if(!hash) throw new Error("Invalid Router");
      
      this.setState({data:funcs[hash](data)});
    }
    events.addListener("show",this.show);

    this.add = (li) =>{
      data.push(li);
      events.emit("show",window.location.hash);
    }
    events.addListener("add",this.add);

    events.emit("show",window.location.hash);
  }
  componentWillUnmount() {
    events.removeListener("show",this.show);
    events.removeListener("add",this.add);
  }
  render(){
    return (
      <div>
        <UlWrapper>
          <this.Loop data = {this.state.data} del = {this.del} />
        </UlWrapper>
      </div>
    )
  }
}

export default Ul;

