import ActionTypes from '../actions/ActionTypes';
import {fromJS} from 'immutable';

let initialState = fromJS({
  selected: [],
  bid: {}
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.NFT_SELECTED_FOR_MARKETPLACE: {
      return state.merge({
        selected: action.payload.selected
      });
    }

    case ActionTypes.NFT_SELECTED_FOR_BIDDING: {
      return state.merge({
        bid: action.payload.bid
      });
    }

    default:
      return state;
  }
};
