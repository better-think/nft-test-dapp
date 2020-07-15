import ActionTypes from './ActionTypes';

/**
 * Public actions related to Account actions.
 *
 * @class AccountActions
 */
class AccountActions {
  /**
   * Public Redux action creator.
   * Call to update redux with a boolean to define the user as logged in or not.
   *
   * @static
   * @param {boolean} isLoggedIn - True/false.
   * @memberof AccountActions
   * @returns {Action}
   */
  static setIsLoggedIn(isLoggedIn) {
    return {type: ActionTypes.ACCOUNT_SET_IS_LOGGED_IN, payload: {isLoggedIn}};
  }
}

export default AccountActions;
