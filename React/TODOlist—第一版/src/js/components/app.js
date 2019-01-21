import React, { Component } from 'react';
import styled from 'styled-components';
import Control from "./control.js";
import Ul from "./list.js";
// import List from "./list.js";

const Wrapper = styled.div`
  margin: auto;
  width: 40%;
  min-width: 300px;
`

class App extends Component {
  render(){
    return (
      <Wrapper>
        <Control />
        <Ul />
      </Wrapper>
    )
  }
}

export default App;