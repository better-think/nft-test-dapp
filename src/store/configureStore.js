import {applyMiddleware, createStore} from 'redux';
import {createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';
import Immutable, {fromJS} from 'immutable';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createRootReducer from '../reducers';

// Session history
export const history = createBrowserHistory();

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return fromJS(JSON.parse(serializedState));
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const stateJson = state.toJS();
    delete stateJson.peerplays.connected;
    const serializedState = JSON.stringify(stateJson);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};

export default () => {
  // For typescript, this may need tweaking...
  let initialState = loadState() || Immutable.Map();

  // Define var for filtering actions when debugging redux to reduce clutter and increase performance.
  let actionsWhitelist = [];

  // Configure enhancer for redux dev tools extensions (if available)
  const composeEnhancers = composeWithDevTools({
    features: {
      dispatch: true
    },
    // Option for immutable
    serialize: {immutable: Immutable},
    actionsWhitelist: actionsWhitelist
  });

  // Construct enhancer
  const enhancer = composeEnhancers(
    applyMiddleware(thunk, routerMiddleware(history))
  );
  const store = createStore(
    createRootReducer(history),
    initialState,
    enhancer
  );

  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};