import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from '@material-ui/core';

import PeerplaysLoginForm from './PeerplaysLoginForm';

/**
 * TODO:
 * - realtime account lookup implementation similar to peerplays-core-gui account login username field.
 * - error messages in html markup reflecting status of account auth or above ^
 * - depending on use-case, proper redux state, actions, & reducers tweaking.
 * - see other TODO blocks within this .jsx file.
 */
class PeerplaysLogin extends Component {
  redirectToRegister = () => {
    this.props.history.push('/register');
  }

  render() {
    return (
      <>
        <div className='peerplayslogin-page'>
          <span className='peerplayslogin__subHeader'>Peerplays Login</span>
          <PeerplaysLoginForm history={this.props.history}/>
          <Button onClick={ this.redirectToRegister } >Register Account</Button>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({isLoggedIn: state.getIn(['account', 'isLoggedIn'])});

export default connect(
  mapStateToProps,
  null
)(PeerplaysLogin);
