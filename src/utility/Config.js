const isDev = process.env.NODE_ENV === 'development';
const {
  REACT_APP_BLOCKCHAIN_ENDPOINTS
} = process.env;

/**
 * @namespace Config
 */
const Config = {
  /**
   * @type {boolean}
   * @memberof Config
   */
  isDev: isDev,

  /**
   * Endpoints for elizabeth testnet. Used for Peerplays Global Login.
   *
   * @type {string[]}
   * @memberof Config
   */
  elizabethEndpoints: REACT_APP_BLOCKCHAIN_ENDPOINTS.replace(' ', '').split(',')
};

export default Config;
