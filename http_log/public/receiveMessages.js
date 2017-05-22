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
    @observable totalHits = 0
    @observable totalHitsInterval = 0
    @observable mainPageCount = 0
    @observable newsPageCount = 0
    @observable aboutPageCount = 0
    @observable blogPageCount = 0
    @observable blogTechPageCount = 0
    @observable blogCookPageCount = 0
    @observable blogRandomCount = 0
    @observable HitsAlert=""


    constructor(props) {
     super(props)

     this.state = {
       messages: [],
       singleMessage: [],
       main:[],
       totalHits:0,
       mainPageCount: 0,
       newsPageCount : 0,
       aboutPageCount: 0,
       blogPageCount: 0,
       blogTechPageCount: 0,
       blogCookPageCount: 0,
       blogRandomCount: 0,
       HitsAlert:""
     }
   }

    componentDidMount() {
      var newArray =[]
      var mainArray=[]
      var newsArray=[]
      var aboutArray=[]
      var blogArray=[]
      var blogTechArray =[]
      var blogCookArray=[]
      var blogRandomArray=[]
      var HitMessage=""
      var HitTime=[{timer:0, count:0}]
      var HitCount=0
    	this.connection = new WebSocket('ws://localhost:8000/');
      this.connection.onmessage = evt => {
        newArray = this.state.singleMessage
        HitCount = this.state.totalHits
        //To filter the traffic into respective arrays one by one
          for(var i= 0, l = newArray.length; i< l; i++){
            if(HitCount%10 == 0 && newArray.length>0){
              var timeHit = newArray[i].dateTime
              HitTime.push({timer: timeHit, count:HitCount})
              console.log("Current Hit time is : "+ HitTime.timer+ "Current Hit count : "+ HitTime.count)
            }

            if(newArray[i].url === "https://www.example.com/" ){
		            mainArray.push(newArray[i]);
              }else if (newArray[i].url === "https://www.example.com/news") {
                newsArray.push(newArray[i]);
              }else if (newArray[i].url === "https://www.example.com/about") {
                aboutArray.push(newArray[i]);
              }else if (newArray[i].url === "https://www.example.com/blog") {
                blogArray.push(newArray[i]);
              }else if (newArray[i].url === "https://www.example.com/blog/tech") {
                blogTechArray.push(newArray[i]);
              }else if (newArray[i].url === "https://www.example.com/blog/cooking") {
                blogCookArray.push(newArray[i]);
              }else if (newArray[i].url === "https://www.example.com/blog/random") {
                blogRandomArray.push(newArray[i]);
              }
              }


            this.state.singleMessage.pop();

            //To check for the number of hits on pages every 2 minutes
            /**function checkHit(){
              setTimeout(checkHit, 2*60*1000)
              if(HitTime.length>1){
                var index =HitTime.length+1
                  HitMesage="High traffic generated an alert -hits: "+ HitTime[index].count+", triggered at"+ HitTime[index].timer
              }
              }

            checkHit();**/
        	this.setState({
          	messages : this.state.messages.concat(JSON.parse(evt.data)),
            singleMessage :this.state.singleMessage.concat(JSON.parse(evt.data)),
            totalHits: this.state.totalHits+1,
            mainPageCount: mainArray.length,
            newsPageCount:newsArray.length,
            aboutPageCount:aboutArray.length,
            blogPageCount:blogArray.length,
            blogTechPageCount:blogTechArray.length,
            blogCookPageCount:blogCookArray.length,
            blogRandomCount:blogRandomArray.length,
            HitsAlert:HitMessage
            })
          }
        }

    componentWillUnmount() {
       this.connection.close()
    }

    render() {
      return (
        <div>

        <Grid>
          <Row className="show-grid">
          <Col md={8}>
            <div>
                Traffic list
            </div>
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
                    <td>{}</td>
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
                    <td>3</td>
                    <td></td>
                    <td>'https://www.example.com/about'</td>
                    <td></td>
                    <td>{this.state.aboutPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td></td>
                    <td>'https://www.example.com/blog'</td>
                    <td></td>
                    <td>{this.state.blogPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td></td>
                    <td></td>
                    <td>'https://www.example.com/blog/tech'</td>
                    <td>{this.state.blogTechPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td></td>
                    <td></td>
                    <td>'https://www.example.com/blog/cooking'</td>
                    <td>{this.state.blogCookPageCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td></td>
                    <td></td>
                    <td>'https://www.example.com/news'</td>
                    <td>{this.state.blogRandomCount}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{this.state.totalHits}</td>
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
          <Row>
          <Col md={6}>
          <ListGroup>

              <ListGroupItem>{this.state.HitAlert}</ListGroupItem>

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
