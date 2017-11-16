import React, { Component } from 'react';
import './index.css';

export default class Portfolio extends Component {
	render () {
		let data = this.props.data
		let projectItems = data[1].data.map(this.renderProjectItems);
		return (
			<div
				className="Portfolio section"
				style={{backgroundColor: this.props.data[0].backgroundColor}}
				>
				<h3 className="title">{data[0].title}</h3>
				<div id="projects-container" className="flex-container-center">
					{projectItems}
				</div>
			</div>

		)
	}

	renderProjectItems(item){
		let codeText = (item.code ? "Code" : "");
		let linkText = (item.Link ? "Check It Out" : "");

		return (
			<div
				className="project flex-item project-overlay bg-img"
				style={{backgroundImage: 'url(' + require(`assets/${item.img}`) + ')'}}
				>
				<h3 className="project-title">{item.title}</h3>
				<p className="project-description">{item.description}</p>
				<div className="links-container flex-container-left">
					<a
						className="project-link"
						href={item.code}>{codeText}</a>
					<a
						className="project-link"
						href={item.link}>{linkText}</a>
				</div>
			</div>
		)
	}


}
