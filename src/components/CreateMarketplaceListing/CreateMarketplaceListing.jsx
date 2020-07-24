import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput } from '@material-ui/core';
import { PeerplaysService } from '../../services';
import { NFTActions } from '../../actions';

const ListItem = (props) => {
  const {row} = props;
  return (
    <TableRow
      hover
      key={row.id}
      tabIndex={-1}>
      <TableCell component="th" scope="row">
        {row.name}
      </TableCell>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.nft_metadata_id}</TableCell>
      <TableCell>{row.approved}</TableCell>
      <TableCell>{row.token_uri}</TableCell>
    </TableRow>
  );
};

ListItem.propTypes = {
  row: PropTypes.object.isRequired
};

const CreateMarketplaceListing = () => {
  const [min, setMin] = useState(0.0);
  const [max, setMax] = useState(0.0);
  const [errors, setErrors] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const items = useSelector(state => state.getIn(['nft','selected'])).toJS();
  const peerplaysAccountId = useSelector(state => state.getIn(['peerplays','account','account','id']));
  const peerplaysAccountName = useSelector(state => state.getIn(['peerplays','account','account','name']));
  const peerplaysPassword = useSelector(state => state.getIn(['peerplays','password']));
  const blockchainPrecision = useSelector(state => state.getIn(['peerplays','balancePrecision']));

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors('');
    setCreateSuccess(false);

    if(max < min) {
      setErrors('Maximum price cannot be less than minimum price');
      return;
    }

    if(min == 0.0 || max == 0.0) {
      setErrors('Minimum and Maximum prices should be more than 0');
      return;
    }

    console.log('min: ' + min);
    console.log('max: ' + max);
    console.log('precision: ' + blockchainPrecision);

    let expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth()+6);

    PeerplaysService.createAndSendTransaction('offer',{
      item_ids: items.map(item => item.id),
      fee: {
        amount: 0,
        asset_id: '1.3.0'
      },
      issuer: peerplaysAccountId,
      minimum_price: {
        amount: Math.round(min * Math.pow(10,blockchainPrecision)),
        asset_id: '1.3.0'
      },
      maximum_price: {
        amount: Math.round(max * Math.pow(10,blockchainPrecision)),
        asset_id: '1.3.0'
      },
      buying_item: false,
      offer_expiration_date: Math.floor(expiryDate.getTime()/1000),
      extensions: []
    },peerplaysAccountName, peerplaysPassword)
    .then(res => {
      setCreateSuccess(true);
      setMin(0.0);
      setMax(0.0);
      dispatch(NFTActions.setSelectedNFTs(fromJS([])));
    }).catch(err => setErrors(err.toString()));
  }

  const handleMinPriceChange = (e) => {
    setMin(parseFloat(e.target.value));
    setErrors('');
    setCreateSuccess(false);
  }

  const handleMaxPriceChange = (e) => {
    setMax(parseFloat(e.target.value));
    setErrors('');
    setCreateSuccess(false);
  }

  return (
    <div className='nftlist'>
      {items && items.size === 0 ? <div>No NFTs selected</div> :
      <div className='nftlist-container'>
        <div>
          Selected NFTs
        </div>
        <hr/>
        <TableContainer className='nftlist-table' component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>NFT Name</TableCell>
                <TableCell>NFT ID</TableCell>
                <TableCell>NFT Metadata ID</TableCell>
                <TableCell>Approved</TableCell>
                <TableCell>Token Uri</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row,index) =>
                <ListItem key={index} row={row}/>)}
            </TableBody>
          </Table>
        </TableContainer>
      </div>}
      <form className='createnft-form' onSubmit={ handleSubmit }>
        <FormControl margin='normal' required variant='outlined'>
          <InputLabel htmlFor="min">
            Minimum Price
          </InputLabel>
          <OutlinedInput
            name='min'
            id='min'
            type='number'
            onChange={ handleMinPriceChange }
            variant='outlined'
            label='Minimum Price'
            value={min}
          />
        </FormControl>
        <FormControl margin='normal' required variant='outlined'>
          <InputLabel htmlFor="max">
            Maximum Price
          </InputLabel>
          <OutlinedInput
            name='max'
            id='max'
            type='number'
            onChange={ handleMaxPriceChange }
            label='Maximum Price'
            value={max}
          />
        </FormControl>
        {errors.length > 0 && <div className='createnft-error'>
          {errors}
        </div>}
        {createSuccess && <div className='createnft-success'>
          NFT(s) Listed Successfully
        </div>}
        <div className='createnft__btn-container'>
          <div className='createnft__btn'>
            <Button variant='contained' onClick={() => dispatch(push('/'))}>Back</Button>
          </div>
          <div className='createnft__btn'>
            <Button variant='contained' type='submit' >Create New Listing</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateMarketplaceListing;