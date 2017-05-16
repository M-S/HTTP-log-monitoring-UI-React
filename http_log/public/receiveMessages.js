const WebSocket = require('ws');
var React = require('react');
var ReactDOM = require('react-dom');
let receivedMessages = [];

var Message = React.createClass({
  get:function(){
    setTimeout(function(){
    ws.close();
    console.log("ws close");
  }, 2000);

  ws.on('message', (data) => {
    receivedMessages.push(JSON.parse(data))
    console.log(receivedMessages);
  })
},

  render:function(){
    return (

      <div>
      <button onClick={this.get}>Click</button>
        <table>
          <tbody>
            <tr>
              <td>{receivedMessages.url}</td>
              <td>{receivedMessages.ip}</td>
              <td>{receivedMessages.dateTime}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = Message;
