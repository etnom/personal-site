import React, { Component } from 'react';

import '../../styles/background-img.css';
import '../../styles/flex-containers.css';
import './index.css';

import Home from '../Home/index';
import About from '../About/index';
import TransitionImg from '../TransitionImg/index';
import Projects from '../Projects/index';
import Architecture from '../Architecture/index';
import Footer from '../Footer/index';
import Tutorials from '../Tutorials/index';


export default class App extends Component {
  constructor (props) {
    super(props);

    this.data = require('assets/data/data.js').data;
  }

  render() {
    return (
      <div className="App">
        <Home data={this.data.homeData}/>
        <About data={this.data.about}/> 
        <Projects data={this.data.projectData} filterCategories={this.data.filterCategories}/>
        <Architecture data={this.data.architectureData}/>
        <Tutorials data={this.data.tutorialsData}/>
        <Footer/>
      </div>
    );
  }
}

