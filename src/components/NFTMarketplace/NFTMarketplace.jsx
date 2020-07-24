import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { fromJS } from 'immutable';
import {Button, Table, TableBody, TableCell, TableRow, TableHead, TableContainer, Paper} from '@material-ui/core';
import { PeerplaysService } from '../../services';
import { NFTActions } from '../../actions';

const NFTMarketplace = () => {
  const [listings, setListings] = useState([]);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.getIn(['account','isLoggedIn']));
  const isBlockchainConnected = useSelector(state => state.getIn(['peerplays','connected']));
  const blockchainPrecision = useSelector(state => state.getIn(['peerplays','balancePrecision']));

  useEffect(() => {
    if(!isLoggedIn)
      dispatch(push('/login'));
    else {
      if(isBlockchainConnected) {
        PeerplaysService.callBlockchainDbApi('list_offers',['1.29.0',100]).then(listings => {
          setListings(listings.toJS());
        }).catch(() => {/*ignore*/});
      }
    }
  }, [dispatch, isLoggedIn, isBlockchainConnected]);

  const handleBidClicked = (e, listing) => {
    e.preventDefault();

    dispatch(NFTActions.setSelectedLisitingForBid(fromJS(listing)));
    dispatch(push('/bid'));
  }

  return (
    <div className='nftlist'>
      <div className='nftlist-container'>
        <div>
          Marketplace
        </div>
        <hr/>
        <TableContainer className='nftlist-table' component={Paper}>
          <Table aria-label="marketplace table">
            <TableHead>
              <TableRow>
                <TableCell>Marketplace ID</TableCell>
                <TableCell>NFT IDs</TableCell>
                <TableCell>Min Price</TableCell>
                <TableCell>Max Price</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listings.map((row,index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.item_ids.join()}</TableCell>
                    <TableCell>PPY {row.minimum_price.amount/Math.pow(10,blockchainPrecision)}</TableCell>
                    <TableCell>PPY {row.maximum_price.amount/Math.pow(10,blockchainPrecision)}</TableCell>
                    <TableCell><Button onClick={(e) => handleBidClicked(e,row)} variant='contained'>Bid</Button></TableCell>
                  </TableRow>
                )}
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Button variant="contained" onClick={() => dispatch(push('/nft-list'))}>My NFTs</Button>
    </div>
  )
}

export default NFTMarketplace;