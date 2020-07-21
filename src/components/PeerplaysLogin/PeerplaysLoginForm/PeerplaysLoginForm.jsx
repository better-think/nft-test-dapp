import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {FormControl, Button, OutlinedInput, InputLabel} from '@material-ui/core';

import {AccountActions, PeerplaysActions} from '../../../actions';
import { PeerplaysService } from '../../../services';

class PeerplaysLoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      username: '',
      password: '',
      position: null,
      errors:{
        username: null,
        password: null
      }
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if(this.state.password.length < 12) {
      this.setState({errors: {username: 'password should be at least 12 characters long'}});
      return;
    }

    this.setState({loading: true});

    if(this.isDisabled()){
      console.warn('Login disabled');
      return;
    }

    PeerplaysService.peerplaysLogin(this.state.username, this.state.password).then((res) => {
      if(res) {
        this.props.setLoggedIn(true);
        this.props.setPeerplaysAccount(res);
        this.props.setPeerplaysPassword(this.state.password);
        this.props.history.replace('/');
      } else {
        this.setState({
          errors: {
            username: 'Invalid username or password'
          }
        });
      }
    }).catch((err) => {
      console.log(err);
      this.setState({
        errors: {
          username: err
        }
      });
    });
  };

  handleUsernameChange = (e) => {
    this.setState({
      username: e.target.value
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value
    });
  }

  isDisabled = () => {
    const {username, password} = this.state;
    return username.length < 1 || password.length < 1;
  };

  render() {
    return (
      <>
        <form className='peerplayslogin-form' onSubmit={ this.handleSubmit }>
          <FormControl margin='normal' required variant='outlined'>
          <InputLabel htmlFor="username">
            Username
          </InputLabel>
            <OutlinedInput
              name='username'
              id='username'
              type='text'
              onChange={ this.handleUsernameChange }
              variant='outlined'
              label='Username'
              fullWidth
            />
          </FormControl>
          <FormControl margin='normal' required variant='outlined'>
            <InputLabel htmlFor="password">
              Password
            </InputLabel>
            <OutlinedInput
              name='password'
              id='password'
              type='password'
              onChange={ this.handlePasswordChange }
              label='Password'
              fullWidth
            />
          </FormControl>
          <div className='peerplayslogin-error'>
            {this.state.errors.username}
          </div>
          <div className='peerplayslogin__btn-container'>
            <Button disabled={ this.isDisabled() } type='submit' variant="contained">
              Login
            </Button>
          </div>
        </form>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    setLoggedIn: AccountActions.setIsLoggedIn,
    setPeerplaysAccount: PeerplaysActions.setPeerplaysAccount,
    setPeerplaysPassword: PeerplaysActions.setPeerplaysPassword
  },
  dispatch
);
export default connect(
  null,
  mapDispatchToProps
)(PeerplaysLoginForm);
