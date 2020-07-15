import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router/immutable';
import {hot} from 'react-hot-loader/root';

import routes from './routes';
import configureStore, {history} from './store/configureStore';
import {PeerplaysService} from './services';

const store = configureStore();
PeerplaysService.init(store);

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <ConnectedRouter history={ history }>
          <div>
            <div className='body'>
              <div className='body-content' >
                {routes}
              </div>
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default hot(App);
