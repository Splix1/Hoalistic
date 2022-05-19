export const SET_USER = 'SET_USER';

export default function user(state = {}, action) {
  switch (action.type) {
    case SET_USER: {
      return action.user;
    }
    default:
      return state;
  }
}
