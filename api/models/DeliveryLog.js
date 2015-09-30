/**
* DeliveryLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    delivery: {
      model: 'delivery'
    },
    status: {
      model: 'deliveryStatus'
    },
    shopper: {
      model: 'user',
      default: null
    },
    log: {
      type: 'text'
    }
  }
};

