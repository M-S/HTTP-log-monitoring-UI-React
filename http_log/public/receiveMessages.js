var React = require('react');
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
      //this.connection.close()
      //setTimeout(function(){
        console.log(evt.data);
        console.log(this.state.messages);
        // add the new message to state
      	this.setState({
        	messages : this.state.messages.concat(JSON.parse(evt.data))
        })
      //}, 20000)
  }
}

  //componentWillUnmount() {
  //    this.connection.close()
  //  }
    // for testing purposes: sending to the echo service which will send it back back

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
