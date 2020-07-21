import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from '@material-ui/core';

import RegisterForm from './RegisterForm';

class Register extends Component {
  redirectToLogin = () => {
    this.props.history.push('/login');
  }

  render() {
    return (
      <>
        <div className='register-page'>
          <span className='register__subHeader'>Peerplays Register</span>
          <span className='register__subHeader1'>Your username and password cannot be recovered. So, please copy and save them somewhere safe.</span>
          <RegisterForm history={this.props.history}/>
          <Button onClick={ this.redirectToLogin } >Login Instead</Button>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({isLoggedIn: state.getIn(['account', 'isLoggedIn'])});

export default connect(
  mapStateToProps,
  null
)(Register);
