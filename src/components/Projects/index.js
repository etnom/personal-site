import React, { Component } from 'react';

import './index.css';
import ContentBox from '../ContentBox/index'

export default class Projects extends Component {
	render () {
		let projectItems = this.props.data.map(this.renderProjectItems);

		return (
			<div
				className="section"
				id="Projects"
				style={{backgroundColor: this.props.data[0].backgroundColor}}>
				<h3 className="title center-text">Projects</h3>
				<div id="projects-container" className="flex-container-center">
					{projectItems}
				</div>
			</div>

		)
	}

	renderProjectItems(item){
		let codeText = (item.code ? "Code" : "");
		let linkText = (item.link ? "Check It Out" : "");
		
		item.img = "projects/" + item.img

		return (
			<ContentBox 
				project={item} 
				className="project-box"
				textContainerClassName="project-text-container"
				imgClassName="project-box-img"/>
		)
	}


}
