import React from 'react'
import ReactDOM from 'react-dom'
import Message from '../receiveMessages'
import styles from './styles.css'
import {PageHeader,Jumbotron} from 'react-bootstrap'

 export default class App extends React.Component {

  render(){
    return(
      <div>
        <PageHeader className={styles.pageHeader}  >DASHBOARD <small className={styles.pageHeader} >> HTTP traffic log</small></PageHeader>
          <Message />
      </div>
    );

  }
}
