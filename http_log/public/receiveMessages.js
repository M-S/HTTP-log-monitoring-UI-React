import {observer} from "mobx-react";
import {observable} from "mobx";
import React from 'react';
import { render } from 'react-dom';
//var React = require('react');
//var ReactDOM = require('react-dom');

@observer
class Message extends React.Component {
    //@observable messages = []
    @observable singleMessage =[]
    constructor(props) {
     super(props)

     this.state = {
       //messages: []
       singleMessage: []
     }
   }
    componentDidMount() {

      // this is an "echo" websocket service
    	this.connection = new WebSocket('ws://localhost:8000/');
      // listen to onmessage event
      this.connection.onmessage = evt => {
          this.state.singleMessage.pop();
          console.log(evt.data);
          //console.log(this.state.messages);
          // add the new message to state
        	this.setState({
          	//messages : this.state.messages.concat(JSON.parse(evt.data))
            singleMessage :this.state.singleMessage.concat(JSON.parse(evt.data))
          })
    }
  }

    componentWillUnmount() {
       this.connection.close()
    }

    render() {
      return (
        <div>
        <div>
            Message
          </div>
          // slice(-5) gives us the five most recent messages
          <ul>{ this.state.singleMessage.map( (msg, idx) =>
            <li key={'msg-' + idx }>{msg.url}</li>
           )}</ul>;

        </div>
      );
    }

}

export default Message;





/**var React = require('react');
var ReactDOM = require('react-dom');

export default class Message extends React.Component {
  constructor(props) {
   super(props)

   this.state = {
     messages: []
   }
 }
  componentDidMount() {

    // this is an "echo" websocket service
  	this.connection = new WebSocket('ws://localhost:8000/');
    // listen to onmessage event
    this.connection.onmessage = evt => {

        console.log(evt.data);
        console.log(this.state.messages);
        // add the new message to state
      	this.setState({
        	messages : this.state.messages.concat(JSON.parse(evt.data))
        })
  }
}

  componentWillUnmount() {
     this.connection.close()
  }


  render() {
    return (

      <div>
      <div>
          Message
        </div>
        // slice(-5) gives us the five most recent messages
        <ul>{ this.state.messages.map( (msg, idx) =>
          <li key={'msg-' + idx }>{msg.url}</li>
         )}</ul>;

      </div>
    );
  }
}
**/
