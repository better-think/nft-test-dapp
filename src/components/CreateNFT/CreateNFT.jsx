import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {FormControl, Button, OutlinedInput, InputLabel} from '@material-ui/core';

import { PeerplaysService } from '../../services';

const CreateNFT = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [createSuccess, setCreateSuccess] = useState(false);

  const peerplaysAccount = useSelector(state => state.getIn(['peerplays','account']));
  const peerplaysAccountId = peerplaysAccount.getIn(['account','id']);
  const peerplaysAccountName = peerplaysAccount.getIn(['account','name']);
  const peerplaysPassword = useSelector(state => state.getIn(['peerplays','password']));

  const isUrl = (s) => {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return regexp.test(s);
  }

  const generateRandomString = () => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < 16; i++)
    {
      text += possible.charAt(Math.floor(Math.random() * possible.length)); 
    }

    return text;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if(isUrl(url)) {
      setErrors({name: 'malformed url'});
      return;
    }

    if(isDisabled()){
      console.warn('Login disabled');
      return;
    }

    PeerplaysService.createAndSendTransaction('nft_metadata_create', {
      fee: {
        amount: 0,
        asset_id: '1.3.0'
      },
      owner: peerplaysAccountId,
      name,
      symbol: generateRandomString(),
      base_uri: ''
    }, peerplaysAccountName, peerplaysPassword).then((res) => {
      if(!res) {
        setErrors({
            name: 'Some error occurred while creating NFT'
        });
        return;
      }

      PeerplaysService.createAndSendTransaction('nft_mint', {
        fee: {
          amount: 0,
          asset_id: '1.3.0'
        },
        payer: peerplaysAccountId,
        nft_metadata_id: res.trx.operation_results[0][1],
        owner: peerplaysAccountId,
        approved: peerplaysAccountId,
        approved_operators: [],
        token_uri: url
      }).then((mintRes) => {
        if(!mintRes) {
          setErrors({
            name: 'Some error occurred while minting NFT'
          });
        }
        setCreateSuccess(true);
        setName('');
        setUrl('');
      }).catch((err) => {
        console.log(err);
        setErrors({
          name: err
        });
      });
    }).catch((err) => {
      console.log(err);
      setErrors({
          name: err
      });
    });
  };

  const handleNFTnameChange = (e) => {
    setName(e.target.value);
    setCreateSuccess(false);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setCreateSuccess(false);
  }

  const isDisabled = () => {
    return name.length < 1 || url.length < 1;
  };

  return (
    <>
      <form className='createnft-form' onSubmit={ handleSubmit }>
        <FormControl margin='normal' required variant='outlined'>
        <InputLabel htmlFor="name">
          NFT Name
        </InputLabel>
          <OutlinedInput
            name='name'
            id='name'
            type='text'
            onChange={ handleNFTnameChange }
            variant='outlined'
            label='NFT Name'
            value={name}
          />
        </FormControl>
        <FormControl margin='normal' required variant='outlined'>
          <InputLabel htmlFor="url">
            Url
          </InputLabel>
          <OutlinedInput
            name='url'
            id='url'
            type='text'
            onChange={ handleUrlChange }
            label='Url'
            value={url}
          />
        </FormControl>
        <div className='createnft-error'>
          {errors.name}
        </div>
        {createSuccess && <div className='createnft-success'>
          NFT Created Successfully
        </div>}
        <div className='createnft__btn-container'>
          <Button disabled={ isDisabled() } type='submit' variant='contained'>
            Create
          </Button>
        </div>
      </form>
    </>
  );
}

export default CreateNFT;