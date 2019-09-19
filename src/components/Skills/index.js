import React, { Component } from 'react';

import SkillBar from './SkillBar';

import './index.css';

export default class Skills extends Component {
	render () {
		return (
			<section id="Skills" className='section'>
				<h1 className="section-title">Skills</h1>

				<div id="skill-bars-container" className="flex-container-center">
					<div className="skill-bar-container">
						<h2 className="center-text">Electrical Engineering</h2>
						<SkillBar 
							skills={ELECTRICAL_ENGINEERING_SKILLS}
							animationDelay={0}/>
					</div>

					<div className="skill-bar-container">
						<h2 className="center-text">Software Engineering</h2>
						<SkillBar 
							skills={SOFTWARE_ENGINEERING_SKILLS}
							animationDelay={0}/>
					</div>
				</div>
				

			</section>

		)
	}

}
