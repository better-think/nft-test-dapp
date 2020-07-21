import React from 'react';
import {Route, Switch} from 'react-router-dom';
import PeerplaysLogin from '../components/PeerplaysLogin';
import CreateNFT from '../components/CreateNFT';
import NFTList from '../components/NFTList';
import Register from '../components/Register';
import {RouteConstants as Routes} from '../constants';

// https://github.com/supasate/connected-react-router/blob/master/examples/immutable/src/routes/index.js

const routes = (
  <>
    <Switch>
      <Route exact path={ Routes.ROOT } component={ NFTList }/>
      <Route path={ Routes.LOGIN } component={ PeerplaysLogin }/>
      <Route path={ Routes.REGISTER } component={ Register }/>
      <Route path={ Routes.CREATE_NFT } component={ CreateNFT }/>
    </Switch>
  </>
);

export default routes;
