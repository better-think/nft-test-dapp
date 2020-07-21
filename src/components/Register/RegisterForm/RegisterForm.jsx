import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {FormControl, Button, OutlinedInput, InputLabel} from '@material-ui/core';
import RandomString from 'randomstring';
import { ChainValidation } from 'peerplaysjs-lib';
import copy from 'copy-to-clipboard';

import {AccountActions, PeerplaysActions} from '../../../actions';
import { PeerplaysService } from '../../../services';

class RegisterForm extends Component {
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
      },
      copySuccess: ''
    };
  }

  componentDidMount() {
    this.setState({
      password: this.generatePassword()
    });
  }

  generatePassword = () => {
    return RandomString.generate({
      length: 52,
      charset: 'alphanumeric'
    })
  }

  copyToClipboard = (e) => {
    copy(this.state.password);
    this.setState({ copySuccess: 'Copied!'});
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const {username} = this.state;

    this.setState({loading: true});

    let accountError = ChainValidation.is_account_name_error(
      username
    );

    if (!username) {
      this.setState({ errors: {username: "Field is required" } });
      return;
    }
    if (username.length >= 64) {
      this.setState({ errors: {username: "Max 64 characters allowed in username" } });
      return;
    }
    if (username.substr(username.length - 1) === '-') {
      this.setState({ errors: {username: "Username should not end with a dash" } });
      return;
    }
    if (username.endsWith('-dividend-distribution')) {
      this.setState({ errors: {username: "Username can't end with -dividend-distribution" } });
      return;
    }
    if (accountError) {
      this.setState({ errors: {username: accountError } });
      return;
    }
    if (username[0].toLowerCase() == username[0].toUpperCase()) {
      this.setState({ errors: {username: "Username should start with a letter" } }); // start with letter;
      return;
    }
    if (!ChainValidation.is_cheap_name(username)) {
      this.setState({ errors: {username: "Username should be a cheap name" } });
      return;
    }

    if(this.isDisabled()){
      console.warn('Login disabled');
      return;
    }

    PeerplaysService.registerAccount(1, username, this.state.password).then((res) => {
        if(res.error) {
            console.warn("CREATE ACCOUNT RESPONSE", res);
            console.warn("CREATE ACCOUNT ERROR", res.error);
            throw res.error;
        }
        console.log('fetchFaucetAddress RESULT', res);
        return res;
    }).then(() => {
      return PeerplaysService.getFullAccount(username).then((res) => {
        if(res) {
          this.props.setLoggedIn(true);
          this.props.setPeerplaysAccount(res);
          this.props.setPeerplaysPassword(this.state.password);
          this.props.history.replace('/');
        } else {
          this.setState({
            errors: {
              username: 'Unknown faucet error'
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
    if(e.target.value.length > 64)
    {
      this.setState({
        username: e.target.value.substr(0, 64)
      })
    } else {
      this.setState({
        username: e.target.value
      });
    }
  };

  isDisabled = () => {
    const {username} = this.state;
    return username.length < 1;
  };

  render() {
    return (
      <>
        <form className='register-form' onSubmit={ this.handleSubmit }>
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
              value={this.state.username}
              fullWidth
            />
          </FormControl>
          <FormControl margin='normal' required variant='outlined'>
            <InputLabel htmlFor="password">
              Password
            </InputLabel>
            <span>
            <OutlinedInput
              ref={(password) => this.passwordInput = password}
              name='password'
              id='password'
              label='Password'
              value={this.state.password}
              fullWidth
              readOnly
            />
            <div>
              <Button onClick={ this.copyToClipboard } variant="contained">
                Copy
              </Button>
              {this.state.copySuccess}
            </div>
            </span>
          </FormControl>
          <div className='register-error'>
            {this.state.errors.username}
          </div>
          <div className='register__btn-container'>
            <Button disabled={ this.isDisabled() } type='submit' variant="contained">
              Register
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
)(RegisterForm);
