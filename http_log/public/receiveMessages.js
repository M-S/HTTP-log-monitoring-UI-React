import {observer} from "mobx-react";
import {observable} from "mobx";
import React from 'react';
import { render } from 'react-dom';
import { Grid, Row, Col, Panel, ListGroup,ListGroupItem, Table } from 'react-bootstrap';
import {moment} from 'moment';

@observer
class Message extends React.Component {

    @observable messages = []
    @observable singleMessage =[]
    @observable mainPageCount = 0
    @observable newsPageCount = 0
    @observable aboutPageCount = 0
    @observable blogPageCount = 0
    @observable blogTechPageCount = 0
    @observable blogCookPageCount = 0
    @observable blogRandomCount = 0

    constructor(props) {
     super(props)

     this.state = {
       messages: [],
       singleMessage: [],
       mainPageCount: 0,
       newsPageCount : 0,
       aboutPageCount: 0,
       blogPageCount: 0,
       blogTechPageCount: 0,
       blogCookPageCount: 0,
       blogRandomCount: 0
     }
   }

    componentDidMount() {
      // this is an "echo" websocket service
    	this.connection = new WebSocket('ws://localhost:8000/');

      // listen to onmessage event
      this.connection.onmessage = evt => {
          switch (this.state.singleMessage.url) {
            case 'https://www.example.com/':
              this.state.mainPageCount++
              break;
            case 'https://www.example.com/news':
              this.state.newsPageCount++
              break;
            case 'https://www.example.com/about':
              this.state.aboutPageCount++
              break;
            case 'https://www.example.com/blog':
              this.state.blogPageCount++
              break;
            case 'https://www.example.com/blog/tech':
              this.state.blogTechPageCount++
              break;
            case 'https://www.example.com/blog/cooking':
              this.state.blogCookPageCount++
              break;
            case 'https://www.example.com/blog/random':
              this.state.blogRandomCount++
              break;

            default:

          }
          this.state.singleMessage.pop(); //console.log(evt.data); console.log(this.state.messages);
          // add the new message to state
        	this.setState({
          	messages : this.state.messages.concat(JSON.parse(evt.data)),
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
        <Grid>
          <Row className="show-grid">
            <Col md={6}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Pages</th>
                    <th>Section 1</th>
                    <th>Section 2</th>
                    <th>Hits</th>
                    <th>Time and date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>'https://www.example.com/'</td>
                    <td></td>
                    <td></td>
                    <td>{this.state.mainPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td></td>
                    <td>'https://www.example.com/news'</td>
                    <td></td>
                    <td>{this.state.newsPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td></td>
                    <td>'https://www.example.com/about'</td>
                    <td></td>
                    <td>{this.state.aboutPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td></td>
                    <td>'https://www.example.com/blog'</td>
                    <td></td>
                    <td>{this.state.blogPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td>'https://www.example.com/blog/tech'</td>
                    <td>{this.state.blogTechPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td>'https://www.example.com/blog/cooking'</td>
                    <td>{this.state.blogCookPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td>'https://www.example.com/news'</td>
                    <td>{this.state.blogRandomCount}</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </Col>

          </Row>
          <Row>
          <Col md={6}>
          <ListGroup>
            {this.state.singleMessage.map( (msg, idx) =>
              <ListGroupItem key={'msg-' + idx }>{msg.url}</ListGroupItem>
            )}
            {this.state.singleMessage.map( (msg, idx) =>
              <ListGroupItem key={'msg-' + idx }>{msg.ip}</ListGroupItem>
            )}
            {this.state.singleMessage.map( (msg, idx) =>
              <ListGroupItem key={'msg-' + idx }>{msg.dateTime}</ListGroupItem>
            )}
          </ListGroup>
          </Col>
          </Row>
        </Grid>



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
