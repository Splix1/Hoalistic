export const SET_USER = 'SET_USER';

export const setUser = (user) => {
  return {
    type: SET_USER,
    user,
  };
};

export default function user(state = {}, action) {
  switch (action.type) {
    case SET_USER: {
      return action.user;
    }
    default:
      return state;
  }
}
