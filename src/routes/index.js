import React from 'react';
import {Route, Switch} from 'react-router-dom';
import PeerplaysLogin from '../components/PeerplaysLogin';
import CreateNFT from '../components/CreateNFT';
import NFTList from '../components/NFTList';
import Register from '../components/Register';
import {RouteConstants as Routes} from '../constants';
import CreateMarketplaceListing from '../components/CreateMarketplaceListing';
import NFTMarketplace from '../components/NFTMarketplace';
import Bid from '../components/Bid';

// https://github.com/supasate/connected-react-router/blob/master/examples/immutable/src/routes/index.js

const routes = (
  <>
    <Switch>
      <Route exact path={ Routes.ROOT } component={ NFTMarketplace }/>
      <Route path={ Routes.LOGIN } component={ PeerplaysLogin }/>
      <Route path={ Routes.REGISTER } component={ Register }/>
      <Route path={ Routes.CREATE_NFT } component={ CreateNFT }/>
      <Route path={ Routes.CREATE_MARKETPLACE_LISTING } component={ CreateMarketplaceListing }/>
      <Route path={ Routes.NFTLIST } component={ NFTList }/>
      <Route path={ Routes.BID } component={ Bid }/>
    </Switch>
  </>
);

export default routes;
