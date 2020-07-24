import {combineReducers} from 'redux-immutable';
import {connectRouter} from 'connected-react-router';
import PeerplaysReducer from './PeerplaysReducer';
import AccountReducer from './AccountReducer';
import NFTReducer from './NFTReducer';

export default (history) => combineReducers({
  router: connectRouter(history),
  peerplays: PeerplaysReducer,
  account: AccountReducer,
  nft: NFTReducer
});
