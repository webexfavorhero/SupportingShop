/**
* Shop.js
*
* @description :: Stores information on specific shops
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var moment = require('moment');
var geolib = require('geolib');
var https = require('https');

var geoService = require('../services/GeoService');

module.exports = {
  attributes: {
    title: {
      type: 'string'
    },
    // URL to S3
    // small square image, must be 100x100 pixels
    smallPicture: {
      type: 'string',
      url: true
    },
    // URL to S3
    // large widescreen image, must be 16:9 and at least 250px wide
    largePicture: {
      type: 'string',
      url: true
    },
    description: {
      type: 'text'
    },
    longitude: {
      type: 'float'
    },
    latitude: {
      type: 'float'
    },

    openingTimes: {
      collection: 'shopOpeningTime',
      via: 'shop'
    },

    lists: {
      collection: 'list',
      via: 'shop'
    },


    /**
     * Check if the shop is currently open and for the next number of "minutes"
     * Sending 30 minutes, would check if the shop is closing in more than 30 minutes and return true if it is closing
     * more than 30 minutes later.
     *
     * This has turned out to be rather complicated due to the difficult nature of storing the opening times so they
     * are valid for the entire year. So, the data is stored as HH:MM in the database and parsed into a relevant
     * moment() in the code, to check against current date and time rather than anything else.
     *
     * Checks against the shop opening times
     * @param  {Integer}   minutes
     */
    /*
     */
    isOpen: function(minutes, cb) {
      var day = moment().format('e');
      var nowHourMinute = moment().format('HH:MM');
      var closingHourMinute = moment().add(minutes, 'm').format('HH:MM');

      ShopOpeningTime.find(
        { where:
          {
            shop: this.id,
            day: parseInt(day)//,
            //open: { '<': nowHourMinute },
            //close: { '>': closingHourMinute }
          }
        },
        function(err, openingTimes) {

          //console.log(openingTimes);

          openingTimes.forEach(function(openingTime) {

            //console.log(openingTime.open);
            //console.log(openingTime.close);

            openingHour = parseInt(openingTime.open.substr(0,2));
            openingMinutes = parseInt(openingTime.open.substr(3,5));
            closingHour = parseInt(openingTime.close.substr(0,2));
            closingMinutes = parseInt(openingTime.close.substr(3,5));

            //console.log(openingHour);
            //console.log(openingMinutes);
            //console.log(closingHour);
            //console.log(closingMinutes);

            var o = moment().hour(openingHour).minute(openingMinutes);
            var c = moment().hour(closingHour).minute(closingMinutes);

            //console.log(o.toString());

            openValid = false;            //console.log(c.toString());

            if(parseInt(o.format('x')) < parseInt(moment().format('x'))) {
              //console.log('open is before now');
              openValid = true;
            } else {
              //console.log('open is after now');
            }

            closeValid = false;
            if(parseInt(c.format('x')) > parseInt(moment().add(minutes, 'm').format('x'))) {
              //console.log('close + ' + minutes + ' is after now + ' + minutes + ' minutes');
              closeValid = true;
            } else {
              //console.log('close + ' + minutes + ' is not after now');
            }

            if(closeValid && openValid) {
              cb(true);
            }

          });

          // return false if nothing else...
          cb(false);


          }
        );

      //});

    },
    /**
     * Get (or create) a list for this shop and a specific appUser
     * @param  {AppUser}   appUser
     * @param  {Function}  callback(list)
     */
    getListForAppUser: function (appUser, callback) {
      List.findOrCreate(
        {shop: this.id, appUser: appUser.id},
        {shop: this.id, appUser: appUser.id}
      )
        .populate('items')
        .exec(function (err, list) {
          if(err) console.log(err);
          //console.log(list);
          callback(list);
        });
    }

  },

  /**
   * UNTESTED
   * This is used to find shops that are within the range of the location.
   * e.g. if you put in the GPS coordinates of a point in central London and 1.5 miles in metres (2414.06), it would
   * return all the shops in the database that are within 1.5 miles of that point
   * @param  {Object}   location
   *            => latitude (Float)
   *            => longitude (Float)
   * @param  {Float} range
   * @param  {Function} callback
   */
  findLocalShops: function (location, range, callback) {
    // http://sailsjs.org/documentation/concepts/models-and-orm/models
    corners = geoService.getSquareCornersAroundLocation(location, range);

    if(corners == undefined) {
      // return no shops
      callback([]);
    } else {

      var maxLatitude = -90;
      var maxLongitude = -180;
      var minLatitude = 90;
      var minLongitude = 180;

      for(var i = 0; i < corners.length; i++) {
        var corner = corners[i];
        if(corner.latitude > maxLatitude) maxLatitude = corner.latitude;
        if(corner.latitude < minLatitude) minLatitude = corner.latitude;
        if(corner.longitude > maxLongitude) maxLongitude = corner.longitude;
        if(corner.longitude < minLongitude) minLongitude = corner.longitude;
      }

      //console.log("max lat: " + maxLatitude);
      //console.log("min lat: " + minLatitude);
      //console.log("max lon: " + maxLongitude);
      //console.log("min lon: " + minLongitude);

      Shop.find().where({latitude: {'<=': maxLatitude, '>=': minLatitude}, longitude: {'<=': maxLongitude, '>=': minLongitude}}).exec(function(err, shops) {
        if(err) {
          // return nothing
          console.log(err);
          callback([]);
        } else {
          shopsToReturn = [];
          //console.log(shops);
          for(var i = 0; i < shops.length; i++) {
            var shop = shops[i];
            distanceFromLocation = geolib.getDistance(location, shop);
            if(distanceFromLocation <= range) {
              shopsToReturn.push(shop);
            }
          }

          callback(shopsToReturn);
        }
      });
    }



  },

  /**
   * UNTESTED
   * Pass through using postcode instead of location
   * @param  {String}   postcode
   * @param  {Float} range
   * @param  {Function} callback
   */
  findLocalShopsFromPostcode: function (postcode, range, callback) {
    GeoService.getLatitudeLongitudeFromPostcode(postcode, function(location) {
      // set range to 1.5 miles = 1609.344 * 1.5
      Shop.findLocalShops(location, 1609.344 * 1.5, function(localShops) {
        callback(localShops);
      })
    });
  },

  /**
   * UNTESTED
   * This is used to find out if the postcode entered is near enough to valid shops in the database
   * @param  {String}   postcode
   * @param  {Function} callback
   */
  isValidDeliveryPostcode: function (postcode, callback) {

    // for FUTURE reference... this is only prototype code for initial version
    // Can use OS Code-Point Open data
    // https://www.ordnancesurvey.co.uk/business-and-government/help-and-support/products/opendata-getting-started.html
    // and can use npm ospoint to convert
    // https://www.npmjs.com/package/ospoint
    // could easily model this via: postcode (no spaces, PK), Latitude, Longitude

    GeoService.getLatitudeLongitudeFromPostcode(postcode, function(location) {
      // set range to 1.5 miles = 1609.344 * 1.5
      Shop.findLocalShops(location, 1609.344 * 1.5, function(shops) {
        callback((shops.length > 2), true);
      })
    });


  }




};

