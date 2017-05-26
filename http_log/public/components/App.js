import React from 'react'
import ReactDOM from 'react-dom'
import Message from '../receiveMessages'
import styles from './styles.css'
import {PageHeader,Jumbotron,Grid} from 'react-bootstrap'
import FaDesktop from 'react-icons/lib/fa/desktop'


 export default class App extends React.Component {

  render(){
    return(
      <div>
        <PageHeader className={styles.pageHeader}><FaDesktop/>  DASHBOARD <small className={styles.pageHeaderSmall} >> HTTP traffic log</small></PageHeader>
        <Message />
      </div>
    );

  }
}
