import ActionTypes from '../actions/ActionTypes';
import {fromJS} from 'immutable';

let initialState = fromJS({
  isLoggedIn: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ACCOUNT_SET_IS_LOGGED_IN: {
      return state.merge({
        isLoggedIn: action.payload.isLoggedIn
      });
    }

    case ActionTypes.ACCOUNT_LOGOUT: {
      return state.merge({
        isLoggedIn: action.payload.isLoggedIn,
      });
    }

    default:
      return state;
  }
};
