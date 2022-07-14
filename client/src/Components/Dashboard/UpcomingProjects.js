import React from 'react';
import Title from './Title';
import CreateProject from '../Projects/CreateProjects';
const dayjs = require('dayjs');

export default function UpcomingProjects({ projects }) {
  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <div>
      <Title>Upcoming Projects</Title>
      <CreateProject />
      {projects.map((project) => {
        let projectDate = dayjs(project.begin_date);

        return (
          <div key={project.id} className="budget-item">
            <h4>
              {project.name}: ${numberWithCommas(project.cost)} <br />
              Begin:{' '}
              {`${projectDate.$M + 1}/${projectDate.$D}/${projectDate.$y}`}
            </h4>
          </div>
        );
      })}
    </div>
  );
}
