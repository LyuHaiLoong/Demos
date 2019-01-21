import React, { Component } from 'react';
import styled from "styled-components";
import data from "../../sql/data.json";
import events from "../utils/events.js";

const Wrapper = styled.div`
  height: 30px;
  * {
    height: 100%;
    outline: none;
  }
  a {
    display: inline-block;
    height: 100%;
    line-height: 100%;
    text-decoration: none;
    vertical-align: top;
    box-sizing: border-box;
  }
  a,button {
    width: 70px;
    padding: 5px 10px;
    cursor: pointer;
    transition: .2s;
  }
  .checked {
    color: #fff;
    background: palevioletred;
  }
`
const Button = styled.button`
  color: palevioletred;
  background : #fff;  
  border: 1px solid palevioletred;
  border-left: ${props => (!props.first && !props.last) && "none"};
  border-radius: ${props => props.first ? "5px" : 0} ${props => props.last ? "5px" : 0} 0 0;
  &:hover{
    opacity: .8;
  }
`
const Input = styled.input.attrs({type:"text"})`
  width: calc(100% - 70 * 3px);
  border-width: 1px 0 1px 0;
  border-style: solid;
  border-color: #aaa;
  padding-left: 1em;
  vertical-align: top;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: palevioletred;
  }
`

class Control extends Component {
  constructor(props){
    super(props);
    this.checked = null;
  }
  toggleActive = (ev) =>{
    if(!this.checked) {
      this.checked = ev.target;
      this.checked.classList.add("checked");
    }else {
      if(this.checked !== ev.target) {
        this.checked.classList.remove("checked");
        ev.target.classList.add("checked");
        this.checked = ev.target;
      }else {
        this.checked.classList.toggle("checked");
        this.checked && (this.checked = null);
        this.toggleHash(ev,ev.target.href);
      }
    }
  }
  toggleHash(ev,href) {
    const hash = /(#.+)/.test(href) && RegExp.$1;
    if(!hash) throw new Error("Invalid hash");

    if(window.location.hash !== hash) return;
    ev.preventDefault();
    window.location.hash = "all";
  }
  add = (ev) =>{
    if(!/click|keyup/.test(ev.type)) return;
    if(ev.type === "keyup" && ev.keyCode !== 13) return;
    
    const { typeIn } = this.refs;
    const checked = (!this.checked || this.checked.innerHTML !== "已完成") ? 0 : 1;
    const text = typeIn.value;
    events.emit("add",{id:data.length,checked:checked,text:text});
    typeIn.value = "";
    typeIn.focus();
  }
  componentDidMount() {
    // a标签的hash在点击事件toggleActive之后，所以获取不到最新的hash值，必须通过hashchange获取最新值
    // 这种行为理解为，阻止默认行为必须在默认行为之前，所以事件在a标签行为之前
    if(!window.location.hash) window.location.hash = "all";

    window.onhashchange = ()=>{
      events.emit("show",window.location.hash);
    }
    
    const { checked,unchecked } = this.refs;
    if(window.location.hash === "#checked") {
      this.checked = checked;
      checked.classList.add("checked");
    }else if(window.location.hash === "#unchecked") {
      this.checked = unchecked;
      unchecked.classList.add("checked");
    }
  }
  componentWillUnmount() {
    window.onhashchange = null;
  }
  render(){
    return (
      <Wrapper>
        <Button ref="unchecked" as="a" href="#unchecked" first onClick = {this.toggleActive}>未完成</Button>
        <Button ref="checked"  as="a" href="#checked" onClick = {this.toggleActive}>已完成</Button>
        <Input ref = "typeIn" onKeyUp = {this.add} />
        <Button last className="checked" onClick = {this.add}>添加</Button>
      </Wrapper>
    )
  }
}

export default Control;