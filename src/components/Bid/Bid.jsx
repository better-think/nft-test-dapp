import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormControl, Button, OutlinedInput, InputLabel, Typography} from '@material-ui/core';
import {push} from 'connected-react-router';

import { PeerplaysService } from '../../services';
import { NFTActions } from '../../actions';

const Bid = () => {
  const [bidPrice, setBidPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const dispatch = useDispatch();

  const peerplaysAccount = useSelector(state => state.getIn(['peerplays','account']));

  if(!peerplaysAccount) {
    dispatch(push('/login'));
  }

  const peerplaysAccountId = peerplaysAccount.getIn(['account','id']);
  const peerplaysAccountName = peerplaysAccount.getIn(['account','name']);
  const peerplaysPassword = useSelector(state => state.getIn(['peerplays','password']));
  const blockchainPrecision = useSelector(state => state.getIn(['peerplays','balancePrecision']));
  const offer = useSelector(state => state.getIn(['nft','bid']));

  if(!offer) {
    dispatch(push('/'));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors('');

    if(isDisabled()){
      console.warn('Login disabled');
      return;
    }

    if(offer.get('issuer') === peerplaysAccountId) {
      setErrors('Owner of NFT cannot bid on it');
      return;
    }

    PeerplaysService.createAndSendTransaction('bid', {
      fee: {
        amount: 0,
        asset_id: '1.3.0'
      },
      bidder: peerplaysAccountId,
      bid_price: {
        amount: Math.round(bidPrice * Math.pow(10, blockchainPrecision)),
        asset_id: '1.3.0'
      },
      offer_id: offer.get('id'),
      extensions: []
    }, peerplaysAccountName, peerplaysPassword).then((res) => {
      if(!res) {
        setErrors('Some error occurred while bidding');
        return;
      }
      dispatch(NFTActions.setSelectedLisitingForBid(null));
      setCreateSuccess(true);
      setBidPrice('');
    }).catch((err) => {
      console.log(err);
      setErrors(err.toString());
    });
  };

  const handleBidPriceChange = (e) => {
    setBidPrice(parseFloat(e.target.value));
    setCreateSuccess(false);
    setErrors('');
  };

  const isDisabled = () => {
    return offer && bidPrice == 0.0;
  };

  return (
    <>
      <form className='createnft-form' onSubmit={ handleSubmit }>
        {offer && <div><Typography>
          {`Offer ID: ${offer.get('id')}`}
        </Typography>
        <Typography>
          {`Item IDs: ${offer.get('item_ids').join()}`}
        </Typography>
        <Typography>
          {`Minimum Price: PPY ${offer.getIn(['minimum_price','amount'])/Math.pow(10,blockchainPrecision)}`}
        </Typography>
        <Typography>
          {`Maximum Price: PPY ${offer.getIn(['maximum_price','amount'])/Math.pow(10,blockchainPrecision)}`}
        </Typography></div>}
        <FormControl margin='normal' required variant='outlined'>
          <InputLabel htmlFor="bidprice">
            Bid Price
          </InputLabel>
          <OutlinedInput
            name='bidprice'
            id='bidprice'
            type='number'
            onChange={ handleBidPriceChange }
            label='Bid Price'
            value={bidPrice}
          />
        </FormControl>
        <div className='createnft-error'>
          {errors}
        </div>
        {createSuccess && <div className='createnft-success'>
          Bid Created Successfully
        </div>}
        <div className='createnft__btn-container'>
          <div className='createnft__btn'>
            <Button variant='contained' onClick={() => {
              dispatch(push('/'));
              dispatch(NFTActions.setSelectedLisitingForBid(null));
            }}>Back</Button>
          </div>
          <div className='createnft__btn'>
            <Button disabled={ isDisabled() } type='submit' variant='contained'>
              Bid
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Bid;