import ActionTypes from './ActionTypes';

/**
 * Public actions related to NFTs.
 *
 * @class NFTActions
 */
class NFTActions {
  /**
   * Public Redux action creator.
   * Call to update redux with an array of selected nft ids to be listed on marketplace.
   *
   * @static
   * @param {Array} selected - Array of selected nft ids.
   * @memberof NFTActions
   * @returns {Action}
   */
  static setSelectedNFTs(selected) {
    return {type: ActionTypes.NFT_SELECTED_FOR_MARKETPLACE, payload: {selected}};
  }

  /**
   * Public Redux action creator.
   * Call to update redux with a selected marketplace listing to be bid upon.
   *
   * @static
   * @param {object} bid - selected listing to be bid upon.
   * @memberof NFTActions
   * @returns {Action}
   */
  static setSelectedLisitingForBid(bid) {
    return {type: ActionTypes.NFT_SELECTED_FOR_BIDDING, payload: {bid}};
  }
}

export default NFTActions;
