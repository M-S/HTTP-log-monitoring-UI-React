import {observer} from "mobx-react";
import {observable} from "mobx";
import React from 'react';
import { render } from 'react-dom';
import { Grid, Row, Col, Panel, ListGroup,ListGroupItem, Table, Accordion, Button,Popover, Alert, Modal} from 'react-bootstrap';
import {moment} from 'moment';
import styles from './components/styles.css'
import FaPlusSquareO from 'react-icons/lib/fa/plus-square-o'
import FaFlag from 'react-icons/lib/fa/flag'
import FaHourglassO from 'react-icons/lib/fa/hourglass-o'
import FaList from 'react-icons/lib/fa/list'
import FaDashboard from 'react-icons/lib/fa/dashboard'
import FaBullseye from 'react-icons/lib/fa/bullseye'
import FaLineChart from 'react-icons/lib/fa/line-chart'
import FaBell from 'react-icons/lib/fa/bell'
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

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
       currentHitAlert:"",
       HighestHitCount:0,
       HighestHitPage:"",
       timeElapsed:0,
       timeElapsedSec:0,
       timeElapsedMin:0,
       timeElapsedHour:0,
       timeElapsedDays:0,
       chart:[{time:0,hits:0}],
       mShow:false
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
      var prevTime=0
      var timeElapse=0
      var chartData=[{time:0,hits:0}]

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
                prevTime = startTimeSeconds
                console.log("start time: " + startTime.toString())
                startHitCount = HitCount
                console.log("start Hit Count: " + startHitCount)
              }
              //to find the difference between current Time and start time in seconds
              var currentTime= newArray[i].dateTime
              var date = new Date(currentTime)
              var currentTimeSeconds = date.getTime()/1000
              var timeDiff= Math.round(currentTimeSeconds-startTimeSeconds)
              timeElapse = Math.round(currentTimeSeconds-prevTime)
              var seconds = Math.round(timeElapse%60)//get seconds
              timeElapse = Math.floor(timeElapse/60)//remove seconds from date
              var minutes = Math.round(timeElapse%60)//get minutes
              timeElapse= Math.floor(timeElapse/60)//remove minutes from the date
              var hours = Math.round(timeElapse%24)//get hours
              timeElapse = Math.floor(timeElapse/24)//remove hours from the date
              var days = timeElapse//rest of the timeElapse is number of days




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
                var HitMessage = ""+ HitCount+" hits ,triggered at time : "+ dateHit.toLocaleString()
                console.log(HitMessage)
                this.setState({
                  HitsAlert:this.state.HitsAlert.concat(HitMessage),
                  currentHitAlert:HitMessage,
                  mShow:true
                })
              }
            }
            //Chart data to be displayed
            if(Math.abs(timeDiff)%60==0 && Math.abs(timeDiff)!==0){
              if(chartData.length>1){
                chartData.shift()
              }
              var d= new Date()
              var timeNow = d.toLocaleTimeString()
              chartData.push({time:timeNow,
                hits:this.state.totalHits})
              this.setState({
                chart:this.state.chart.concat(chartData)
              })
              var chartArray = this.state.chart
              if(chartArray.length>10){
                chartArray.shift()
                this.setState({
                  chart:chartArray
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
                  HitPage="www.example.com/"
                  break;
                case newsArray.length:
                  HitPage="www.example.com/news"
                  break;
                case aboutArray.length:
                  HitPage="www.example.com/about"
                  break;
                case blogArray.length:
                  HitPage="www.example.com/blog"
                  break;
                case blogTechArray.length:
                  HitPage="www.example.com/blog/tech"
                  break;
                case blogCookArray.length:
                  HitPage="www.example.com/blog/cooking"
                  break;
                case blogRandomArray.length:
                  HitPage="www.example.com/blog/random"
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
                HighestHitCount:HighestHit,
                timeElapsedSec:seconds,
                timeElapsedMin:minutes,
                timeElapsedHour:hours,
                timeElapsedDays:days
                })
          }

        }

    componentWillUnmount() {
       this.connection.close()
    }
    //render UI
    render() {
      let mClose = () => this.setState({ mShow: false })
      return (
        <div>
          <Grid>
            <Row>
            <h2 className={styles.white} ><FaLineChart/> Stats</h2>
            <Col md={2}>
            <Panel className={styles.panelBox}>
                  <h2 className={styles.panelTitle} ><FaPlusSquareO/>    Total Hits</h2>
                  <h1 className={styles.panelStats} >{this.state.totalHits}</h1>
              </Panel>
              </Col>
              <Col md={6}>
              <Panel className={styles.panelBox}>
                        <h2 className={styles.panelTitle}><FaFlag/>  Top Hit Page</h2>
                        <h3 className={styles.topHitLink} >{this.state.HighestHitPage} [{this.state.HighestHitCount}]</h3>
              </Panel>
              </Col>
              <Col md={4}>
              <Panel className={styles.panelBox}>
                  <h2 className={styles.panelTitle}><FaHourglassO/> Time elapsed</h2>
                  <h2 className={styles.panelStats} >{this.state.timeElapsedDays} days, {this.state.timeElapsedHour}:{this.state.timeElapsedMin}:{this.state.timeElapsedSec}</h2>
              </Panel>
              </Col>
            </Row>
            <Row>
            <h2 className={styles.white} ><FaLineChart/> Live chart <span><h4> (calculated every 1 minute)</h4></span></h2>
              <Col md={12} >
              <Panel className={styles.chart} >

                <ResponsiveContainer height={300} width="100%" >
                  <LineChart data={this.state.chart}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                   <XAxis dataKey="time"/>
                   <YAxis/>
                   <CartesianGrid strokeDasharray="3 3"/>
                   <Tooltip/>
                   <Legend />
                   <Line type="monotone" dataKey="hits" stroke="#8884d8" activeDot={{r: 8}}/>
                  </LineChart>
                </ResponsiveContainer>
                </Panel>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col md={7}>
              <h2 className={styles.white}><FaBullseye/> Hits Per Page</h2>

                  <Table responsive className={styles.tableInside}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Pages</th>
                        <th>Hits</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr className={styles.tableInside}>
                        <td>1</td>
                        <td>'https://www.example.com/'</td>
                        <td>{this.state.mainPageCount}</td>
                      </tr>
                      <tr className={styles.tableInside}>
                        <td>2</td>
                        <td>'https://www.example.com/news'</td>
                        <td>{this.state.newsPageCount}</td>
                      </tr>
                      <tr className={styles.tableInside}>
                        <td>3</td>
                        <td>'https://www.example.com/about'</td>
                        <td>{this.state.aboutPageCount}</td>
                      </tr>
                      <tr className={styles.tableInside}>
                        <td>4</td>
                        <td>'https://www.example.com/blog'</td>
                        <td>{this.state.blogPageCount}</td>
                      </tr>
                      <tr className={styles.tableInside}>
                        <td>5</td>
                        <td>'https://www.example.com/blog/tech'</td>
                        <td>{this.state.blogTechPageCount}</td>
                      </tr>
                      <tr className={styles.tableInside}>
                        <td>6</td>
                        <td>'https://www.example.com/blog/cooking'</td>
                        <td>{this.state.blogCookPageCount}</td>
                      </tr>
                      <tr className={styles.tableInside}>
                        <td>7</td>
                        <td>'https://www.example.com/news'</td>
                        <td>{this.state.blogRandomCount}</td>
                      </tr>
                      <tr className={styles.tableInside}>
                        <td></td>
                        <td>TOTAL HITS</td>
                        <td>{this.state.totalHits}</td>
                      </tr>
                    </tbody>
                  </Table>

                </Col>
                <Col md={5}>
                  <h2 className={styles.white}><FaDashboard/> HTTP traffic</h2>
                  <Accordion className={styles.accordionClick}>
                    <Panel header="Click to see Live status"eventKey="1" className={styles.liveStatusPanel}>
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
                      </Panel>
                      <div className={styles.button} >
                        <FaBell/>
                        <span className={styles.button__badge}>{this.state.HitsAlert.length}</span>
                      </div>
                      <Panel header="Traffic Alert Messages" eventKey="2" className={styles.alertPanel}>
                      <Alert bsStyle="success">
                      <ListGroup>
                        {this.state.HitsAlert.map((alert) =>
                        <ListGroupItem key={alert.toString()}><h5>HIGH TRAFFIC ALERT:</h5><p>{alert}</p></ListGroupItem> )}
                      </ListGroup>
                      </Alert>
                      </Panel>
                    </Accordion>
                </Col>
            </Row>
          </Grid>
          <Modal show={this.state.mShow} onHide={mClose} bsSize="small" aria-labelledby="contained-modal-title-sm">
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-sm"><strong>HIGH TRAFFIC ALERT:</strong></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{this.state.currentHitAlert}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={mClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
}

export default Message;
