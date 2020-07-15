import ActionTypes from './ActionTypes';

/**
 * Public actions related to Peerplays actions.
 *
 * @class PeerplaysActions
 */
class PeerplaysActions {
  /**
   * Public Redux action creator.
   * Call to update redux with a boolean to define the user as logged in or not.
   *
   * @static
   * @param {boolean} isLoggedIn - True/false.
   * @memberof AccountActions
   * @returns {Action}
   */

  static setPeerplaysConnected(connected) {
    return {
      type: ActionTypes.PEERPLAYS_SET_IS_CONNECTED,
      payload: {
        connected: connected
      }
    };
  }

  static setPeerplaysPrecision(precision) {
    return {
      type: ActionTypes.PEERPLAYS_SET_PRECISION,
      payload: {
        balancePrecision: precision
      }
    };
  }

  static setPeerplaysAccount(account) {
    return {
      type: ActionTypes.PEERPLAYS_SET_ACCOUNT,
      payload: {
        account: account
      }
    };
  }

  static setPeerplaysBalance(balance) {
    return {
      type: ActionTypes.PEERPLAYS_SET_BALANCE,
      payload: {
        balance: balance
      }
    };
  }

  static setPeerplaysPassword(password) {
    return {
      type: ActionTypes.PEERPLAYS_SET_PASSWORD,
      payload: {
        password: password
      }
    };
  }

  static setPeerplaysTransferFee(transferFee) {
    return {
      type: ActionTypes.PEERPLAYS_SET_TRANSFERFEE,
      payload: {
        transferFee: transferFee
      }
    };
  }
}

export default PeerplaysActions;
