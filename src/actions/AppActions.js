import ActionTypes from './ActionTypes';

/**
 * Public actions related to Application wide actions.
 *
 * @class AppActions
 */
class AppActions {
  /**
   * Public Redux Action Creator.
   *
   * @static
   * @memberof AppActions
   * @returns {Dispatch}
   */
  static logout() {
    return {
      type: ActionTypes.ACCOUNT_LOGOUT,
      payload: {
        isLoggedIn: false
      }
    };
  }
}

export default AppActions;
