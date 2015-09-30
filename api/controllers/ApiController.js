/**
 * ApiController
 *
 * @description :: Server-side logic for managing apis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getToken: function(req, res) {
    AppUser.findOrCreate({ deviceId: req.body.device_id })
      .exec(function(err, appUser) {
        if(err) res.send(JSON.stringify({success: false, message: "Unable to generate token"}));
        // generate a new access token every single time this is called
        appUser.generateAccessToken(function(accessToken) {
          response = {success: true, access_token: appUser.accessToken};
          res.send(JSON.stringify(response));
        });
      });
  },

  postcodeCheck: function(req, res) {
    Shop.isValidDeliveryPostcode(req.body.postcode, function(deliveryAvailable, validPostcode) {
      res.setHeader('Content-Type', 'application/json');
      response = {success: false, postcodeValid: validPostcode, delivery: deliveryAvailable};
      if(validPostcode && deliveryAvailable) {
        response.success = true;
      }
      res.send(JSON.stringify(response));
    });
  },
  sendNotifyWhenAvailableEmail: function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    FutureAppUser.create({deviceId: req.deviceId, email: req.body.email, deliveryPostcode: req.body.postcode}).then(function(futureAppUser) {
      res.send(JSON.stringify({success: true}));
    }).catch(function(err) {
      res.send(500, JSON.stringify({success: false, message: err.message}));
    });
  },

  shopsList: function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    Shop.findLocalShopsFromPostcode(req.body.postcode, 1609.344 * 1.5, function(shops) {
      res.send(JSON.stringify({success: true, shops: shops}));
    });
  },

  shopListGetOrCreate: function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    Shop.findOne({id: req.body.shop}).exec(function(err, shop) {
      if(shop == undefined) {
        res.send(JSON.stringify({success: false, message: "No shop with that id in database"}));
      } else {
        shop.getListForAppUser(req.appUser, function(list) {

          console.log(list);

          res.send(JSON.stringify({success: true, list: list}));
        });
      }
    })
  },

  shopListAddItem: function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log("shop list add item");
    console.log(req.appUser);
    res.send(JSON.stringify({success: true, list: {id: 1, items: []}}));
  }



};

