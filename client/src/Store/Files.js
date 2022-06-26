export const SET_FILES = 'SET_FILES';

export const setFiles = (files) => {
  return {
    type: SET_FILES,
    files,
  };
};

export default function files(state = [], action) {
  switch (action.type) {
    case SET_FILES: {
      return action.files;
    }
    default:
      return state;
  }
}
