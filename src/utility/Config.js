const isDev = process.env.NODE_ENV === 'development';
const {
  REACT_APP_BLOCKCHAIN_ENDPOINTS,
  REACT_APP_FAUCET_URL
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
  elizabethEndpoints: REACT_APP_BLOCKCHAIN_ENDPOINTS.replace(' ', '').split(','),

  /**
   * Faucet url.
   *
   * @type {string[]}
   * @memberof Config
   */
  faucetUrl: REACT_APP_FAUCET_URL,
};

export default Config;
