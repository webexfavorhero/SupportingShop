/**
* DeliveryNote.js
*
* @description :: Stores notes to pass back and forth on a delivery. May not be used in prototype
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    delivery: {
      model: 'delivery'
    },
    isViewableByAppUser: {
      type: 'boolean',
      default: false
    },
    isAppUserNote: {
      type: 'boolean'
    },
    isShopperNote: {
      type: 'boolean'
    },
    isAdminNote: {
      type: 'boolean'
    },
    // specified the name of the person as a display element rather than an identifier in the database
    from: {
      type: 'string'
    },
    note: {
      type: 'text'
    }

  }
};

