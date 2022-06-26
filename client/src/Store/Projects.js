export const SET_PROJECTS = 'SET_PROJECTS';

export const setProjects = (projects) => {
  return {
    type: SET_PROJECTS,
    projects,
  };
};

export default function projects(state = [], action) {
  switch (action.type) {
    case SET_PROJECTS: {
      return action.projects;
    }
    default:
      return state;
  }
}
