/**
* ShopOpeningTime.js
*
* @description :: Stores opening and closing times for specific shops
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    shop: {
      model: 'shop'
    },
    day: {
      type: 'integer'
    },
    open: {
      type: 'string'
    },
    close: {
      type: 'string'
    }
  }
};

