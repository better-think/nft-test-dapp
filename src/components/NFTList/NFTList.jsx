import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import {Button, Table, TableBody, TableCell, TableRow, TableHead, TableContainer, Paper, Checkbox} from '@material-ui/core';
import { fromJS } from 'immutable';
import { PeerplaysService } from '../../services';
import { NFTActions } from '../../actions';

const ListItem = (props) => {
  const {row, index, isSelected, handleClick} = props;
  const isItemSelected = isSelected(row.id);
  const labelId = `enhanced-table-checkbox-${index}`;
  return (
    <TableRow
      hover
      key={row.id}
      onClick={(event) => handleClick(event, row.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      selected={isItemSelected}>
      <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
      <TableCell component="th" scope="row">
        {row.name}
      </TableCell>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.nft_metadata_id}</TableCell>
      <TableCell>{row.approved}</TableCell>
      <TableCell><img className='nftlist-img' src={row.token_uri} alt=''/></TableCell>
    </TableRow>
  );
};

ListItem.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
};

const NFTList = () => {
  const [items, setItems] = useState([]);
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.getIn(['account','isLoggedIn']));
  const accountId = useSelector(state => state.getIn(['peerplays','account','account','id']));
  const isBlockchainConnected = useSelector(state => state.getIn(['peerplays','connected']));
  const blockchainPrecision = useSelector(state => state.getIn(['peerplays','balancePrecision']));

  useEffect(() => {
    if(!isLoggedIn)
      dispatch(push('/login'));
    else {
      if(isBlockchainConnected) {
        PeerplaysService.callBlockchainDbApi('nft_get_tokens_by_owner',[accountId]).then(async nfts => {
          Promise.all(nfts.map((nft) => {
            return PeerplaysService.callBlockchainDbApi('nft_get_name',[nft.get('nft_metadata_id')])
            .then(tokenName => {
              return PeerplaysService.callBlockchainDbApi('nft_get_token_uri',[nft.get('id')])
              .then(tokenUri => {
                return {...nft.toJS(), name: tokenName, token_uri: tokenUri};
              });
            }).catch(() => {/*ignore*/});
          })).then(nftNames => {
            PeerplaysService.callBlockchainDbApi('get_offers_by_issuer',['1.29.0',accountId,100]).then(listings => {
              setListings(listings.toJS());
              const itemsNotListed = nftNames.filter(item => !listings.toJS().some(listing => listing.item_ids.indexOf(item.id) !== -1));
              setItems(itemsNotListed);
            }).catch(() => {/*ignore*/});
          });
        }).catch(()=>{/*ignore*/});
      }
    }
  }, [accountId, dispatch, isLoggedIn, isBlockchainConnected, items]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = items.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleListOnMarketplaceClicked = () => {
    const selectedNFTs = items.filter(item => selected.indexOf(item.id) !== -1);
    dispatch(NFTActions.setSelectedNFTs(fromJS(selectedNFTs)));
    dispatch(push('/create-marketplace-listing'));
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <div className='nftlist'>
      {items && items.length === 0 ? <div>No NFTs found for user</div> :
      <div className='nftlist-container'>
        <div>
          Your NFT Tokens (Not Listed on Marketplace Yet)
        </div>
        <hr/>
        <TableContainer className='nftlist-table' component={Paper}>
          <Table aria-label="nft list table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < items.length}
                  checked={items.length > 0 && selected.length === items.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all NFTs' }}
                />
                </TableCell>
                <TableCell>NFT Name</TableCell>
                <TableCell>NFT ID</TableCell>
                <TableCell>NFT Metadata ID</TableCell>
                <TableCell>Approved</TableCell>
                <TableCell>Token Uri</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row,index) =>
                <ListItem key={index} row={row} index={index} isSelected={isSelected} handleClick={handleClick}/>)}
            </TableBody>
          </Table>
        </TableContainer>
        {selected.length > 0 &&
        <Button onClick={handleListOnMarketplaceClicked}>
          Click here to List {selected.length} token(s) on marketplace
        </Button>}
      </div>}
      <Button variant="contained" onClick={() => dispatch(push('/create-nft'))}>Create New NFT</Button>
      <div className='nftlist-marketplace'>
        <div className='nftlist-container'>
          <div>
            NFTs Listed on Marketplace
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
                    </TableRow>
                  )}
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Button variant="contained" onClick={() => dispatch(push('/'))}>Go To Marketplace</Button>
      </div>
    </div>
  )
}

export default NFTList;