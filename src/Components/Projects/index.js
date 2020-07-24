import React from 'react';

import './index.css';


const Projects = props => {
  const { projectsData } = props;

  console.log()

  return (
    <section id="Projects" className="section">
      <div className="section-content">
        <h1 className="section-title">Projects</h1>
      </div>

      {/* Featured projects */}
      {
        projectsData
          .filter(project => project.isFeatured)
          .map((project, key) => {
            const { title, by, event, img, date, description} = project;

            console.log(img)

            return (
              <div key={key}
                className="featured-project-container horizontally-center flex-container-horizontally-center" 
              >
                <img alt={title + "-img"}
                  src={require("../../assets/images/projects/" + img)} 
                />
                {title}
              </div>
            );
          })
      }
    </section>
  )
};

export default Projects;