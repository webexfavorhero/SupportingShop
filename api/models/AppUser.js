/**
* AppUser.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var crypto = require('crypto');

module.exports = {
  attributes: {
    deviceId: {
      type: 'string',
      unique: true
    },
    accessToken: {
      type: 'string'
    },

    lists: {
      collection: 'list',
      via: 'appUser'
    },


    /*
     * Generates a new access token for this user and returns it
     *
     * Could be used to store an "expiry" but for now, we'll just
     * create the access token
     */
    generateAccessToken: function(cb) {
      var token = crypto.randomBytes(18).toString('hex');
      this.accessToken = token;
      this.save(function(err) {
        if(err) console.log(err);
      });
      cb(token);
    }
  }
};

