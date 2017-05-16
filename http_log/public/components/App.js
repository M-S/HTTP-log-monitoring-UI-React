import React from 'react'
import ReactDOM from 'react-dom'
import Message from '../receiveMessages'

 export default class App extends React.Component {

  render(){
    return(
      <div>
        <h1>Message Received from server</h1>
        <Message />
      </div>
    );

  }
}
