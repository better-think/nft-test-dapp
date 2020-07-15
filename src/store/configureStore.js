import {applyMiddleware, createStore} from 'redux';
import {createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';
import Immutable from 'immutable';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createRootReducer from '../reducers';

// Session history
export const history = createBrowserHistory();

export default () => {
  // For typescript, this may need tweaking...
  let initialState = Immutable.Map();

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

  return store;
};