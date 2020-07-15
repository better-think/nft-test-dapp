import ActionTypes from '../actions/ActionTypes';
import {fromJS} from 'immutable';

let initialState = fromJS({
  connected: false,
  account: null,
  password: null,
  balancePrecision: 0,
  balance: 0,
  transferFee: 0
});

export default (state = initialState, action) => {

  switch (action.type) {
    case ActionTypes.PEERPLAYS_SET_IS_CONNECTED: {
      return state.merge({
        connected: action.payload.connected
      });
    }

    case ActionTypes.PEERPLAYS_SET_ACCOUNT: {
      return state.merge({
        account: action.payload.account
      });
    }

    case ActionTypes.PEERPLAYS_SET_PRECISION: {
      return state.merge({
        balancePrecision: action.payload.balancePrecision
      });
    }

    case ActionTypes.PEERPLAYS_SET_BALANCE: {
      return state.merge({
        balance: action.payload.balance
      });
    }

    case ActionTypes.PEERPLAYS_SET_PASSWORD: {
      return state.merge({
        password: action.payload.password
      });
    }

    case ActionTypes.PEERPLAYS_SET_TRANSFERFEE: {
      return state.merge({
        transferFee: action.payload.transferFee
      });
    }

    default:
      return state;
  }
};
