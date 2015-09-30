/**
* FutureAppUser.js
*
* @description :: Saves data for a future app user.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    deviceId: {
      type: 'string'
    },
    email: {
      type: 'email',
      required: true
    },
    deliveryPostcode: {
      type: 'string'
    }
  }
};

