import React from 'react'
import ReactDOM from 'react-dom'
import Message from '../receiveMessages'

 export default class App extends React.Component {

  render(){
    return(
      <div>
        <h1>HTTP Traffic UI</h1>
        <Message />
      </div>
    );

  }
}
