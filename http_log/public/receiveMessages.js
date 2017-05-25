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
    @observable HitsAlert=[]


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
       HitsAlert:[],
       HighestHitCount:0,
       HighestHitPage:""
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
      var HitCount=0
      var startHitCount
      var startTimeSeconds=0

      /***Establishes websocket connection ****/
    	this.connection = new WebSocket('ws://localhost:8000/');

      /**To handle data received when connection to websocket is established **/
      this.connection.onmessage = evt => {
        //single data received is stored in newArray
        newArray = this.state.singleMessage
        HitCount = this.state.totalHits

          for(var i= 0, l = newArray.length; i< l; i++){
            //Set start Time of Hits and convert dateTime to seconds
              if(HitCount==1){
                var startTime = new Date()
                startTimeSeconds=startTime.getTime()/1000
                console.log("start time: " + startTime.toString())
                startHitCount = HitCount
                console.log("start Hit Count: " + startHitCount)
              }
              //to find the difference between current Time and start time in seconds
              var currentTime= newArray[i].dateTime
              var date = new Date(currentTime)
              var currentTimeSeconds = date.getTime()/1000
              var timeDiff= Math.round(currentTimeSeconds-startTimeSeconds)
              //console.log("Time diff: "+ timeDiff)


      //Whenever total traffic for the past 2 minutes exceeds a certain number on average,
      //add a message saying `High traffic generated an alert - hits = {value}, triggered at {time}`
            if(Math.abs(timeDiff)>2*60){
              console.log("Time diff >2 minutes ")
              if((HitCount+startHitCount)/2 >150){
                var timeHit = newArray[i].dateTime
                var dateHit = new Date(timeHit)

                startTimeSeconds=currentTimeSeconds
                console.log("new start time:" + startTimeSeconds)
                startHitCount = HitCount
                console.log("new start hit count :" + startHitCount)
                var HitMessage = " - hits "+ HitCount+" ,triggered at time : "+ dateHit.toString()
                console.log(HitMessage)
                this.setState({
                  HitsAlert:this.state.HitsAlert.concat(HitMessage)
                })
              }
            }

            /****To filter the data into respective arrays one by one***/
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
              //Find the page with  most number of hits
              var HitPage=""
              var HighestHit = Math.max(mainArray.length,newsArray.length,aboutArray.length,blogArray.length,blogTechArray.length,blogCookArray.length,blogRandomArray.length)
              //console.log("HighestHit: "+HighestHit)
              switch (HighestHit) {
                case mainArray.length:
                  HitPage="https://www.example.com/"
                  break;
                case newsArray.length:
                  HitPage="https://www.example.com/news"
                  break;
                case aboutArray.length:
                  HitPage="https://www.example.com/about"
                  break;
                case blogArray.length:
                  HitPage="https://www.example.com/blog"
                  break;
                case blogTechArray.length:
                  HitPage="https://www.example.com/blog/tech"
                  break;
                case blogCookArray.length:
                  HitPage="https://www.example.com/blog/cooking"
                  break;
                case blogRandomArray.length:
                  HitPage="https://www.example.com/blog/random"
                  break;
                default:HitPage=""
              }
              //console.log("HitPage: "+HitPage)

              //remove the last array object from singleMessage to save memory
            this.state.singleMessage.pop();
            //set values to the state
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
                HighestHitPage:HitPage,
                HighestHitCount:HighestHit
                })
          }
        }

    componentWillUnmount() {
       this.connection.close()
    }
    //render UI
    render() {
      return (
        <div>

        <Grid>
        <Row>
        <Col md={6}>
        <ListGroup>
          <ListGroupItem>Top most Hit</ListGroupItem>
          <ListGroupItem>{this.state.HighestHitPage}</ListGroupItem>
          <ListGroupItem>{this.state.HighestHitCount}</ListGroupItem>
        </ListGroup>
        </Col>
        </Row>
          <Row className="show-grid">
          <Col md={8}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Pages</th>
                    <th>Hits</th>
                    </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>'https://www.example.com/'</td>
                    <td>{this.state.mainPageCount}</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>'https://www.example.com/news'</td>
                    <td>{this.state.newsPageCount}</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>'https://www.example.com/about'</td>
                    <td>{this.state.aboutPageCount}</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>'https://www.example.com/blog'</td>
                    <td>{this.state.blogPageCount}</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>'https://www.example.com/blog/tech'</td>
                    <td>{this.state.blogTechPageCount}</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>'https://www.example.com/blog/cooking'</td>
                    <td>{this.state.blogCookPageCount}</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>'https://www.example.com/news'</td>
                    <td>{this.state.blogRandomCount}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>TOTAL HITS</td>
                    <td>{this.state.totalHits}</td>
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
            {this.state.HitsAlert.map((alert) =>
            <ListGroupItem key={alert.toString()}><span>HIGH TRAFFIC ALERT</span>{alert}</ListGroupItem> )}

          </ListGroup>
          </Col>
          </Row>
        </Grid>



        </div>
      );
    }
}

export default Message;
