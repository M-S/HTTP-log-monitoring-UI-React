var React = require('react');
var Messages = require('../receiveMessages');

class App extends React.Component {

  render(){
    return(
      <div>
        <h1>Message Received from server</h1>
        <Message />
      </div>
    );

  }
}

module.exports = App;
