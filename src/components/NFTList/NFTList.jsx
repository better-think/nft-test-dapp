import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import {Button} from '@material-ui/core';
//import { PeerplaysService } from '../../services';

const ListItem = (props) => (
  <li>{props.name}</li>
);

const NFTList = () => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.getIn(['account','isLoggedIn']));

  useEffect(() => {
    if(!isLoggedIn)
      dispatch(push('/login'));
    //PeerplaysService.callBlockchainDbApi()
  });

  return (
    <div>
      <Button variant="contained" onClick={() => dispatch(push('/create-nft'))}>Create New NFT</Button>
      <ul>
        {items.map((item, i) => (
          <ListItem
            key={i}
            name={item}
          />
        ))}
      </ul>
    </div>
  )
}

export default NFTList;