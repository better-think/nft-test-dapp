import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import {Button} from '@material-ui/core';
import { PeerplaysService } from '../../services';

const ListItem = (props) => (
  <li>{props.name}</li>
);

const NFTList = () => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.getIn(['account','isLoggedIn']));
  const accountId = useSelector(state => state.getIn(['peerplays','account','account','id']));
  const isBlockchainConnected = useSelector(state => state.getIn(['peerplays','connected']));

  useEffect(() => {
    if(!isLoggedIn)
      dispatch(push('/login'));
    else {
      if(isBlockchainConnected) {
        PeerplaysService.callBlockchainDbApi('nft_get_tokens_by_owner',[accountId]).then(async nfts => {
          Promise.all(nfts.map((nft) => {
            return PeerplaysService.callBlockchainDbApi('nft_get_name',[nft.get('nft_metadata_id')]).catch(() => {/*ignore*/});
          })).then(nftNames => setItems(nftNames));
        }).catch(()=>{/*ignore*/});
      }
    }
  }, [accountId, dispatch, isLoggedIn, isBlockchainConnected]);

  return (
    <div>
      {items && items.size === 0 ? <div>No NFTs found for user</div> : <ul>
        {items.map((item, i) => (
          <ListItem
            key={i}
            name={item}
          />
        ))}
      </ul>}
      <Button variant="contained" onClick={() => dispatch(push('/create-nft'))}>Create New NFT</Button>
    </div>
  )
}

export default NFTList;