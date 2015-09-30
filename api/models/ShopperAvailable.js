/**
* ShopperAvailable.js
*
* @description :: Availability of Shopper by date and time
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    user: {
      model: 'user'
    },
    start: {
      type: 'datetime'
    },
    end: {
      type: 'datetime'
    }
  }
};

