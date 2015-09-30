var https = require('https');

module.exports = {

  getLatitudeLongitudeFromPostcode: function(postcode, callback) {

    // for simple testing
    if(postcode == 'mk12 5an') {
      callback({longitude: -0.813657, latitude: 52.0598});
    } else {
      https.get("https://api.postcodes.io/postcodes/" + postcode, function(res) {
        if(res.statusCode == 404) {
          // almost certainly an invalid postcode
          callback();
        } else {
          var body = '';
          res.on('data', function(chunk) {
            body += chunk;
          });
          res.on('end', function() {
            // parse json
            var postcodeData = JSON.parse(body);
            // create location object
            var location = {latitude: postcodeData.result.latitude, longitude: postcodeData.result.longitude};

            // set range to 1.5 miles
            callback(location);
          });
        }
      });
    }

  },

  toRadians: function(number) {
    return number * Math.PI / 180;
  },

  toDegrees: function(number) {
    return number * 180 / Math.PI;
  },

  /**
   * UNTESTED
   * Return an array of 4 points. These points are corners of a square where the sides are approximately distance
   * away from the location. Uses pythagorus to work out distance corners should be from location.
   * @param {Object} location
   *            => latitude (Float)
   *            => longitude (Float)
   */
  getSquareCornersAroundLocation: function(location, distance) {

    /*
     // where	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
     // note that angles need to be in radians to pass to trig functions!
     // from: http://www.movable-type.co.uk/scripts/latlong.html
     var φ2 = Math.asin( Math.sin(φ1)*Math.cos(d/R) +
     Math.cos(φ1)*Math.sin(d/R)*Math.cos(brng) );
     var λ2 = λ1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(φ1),
     Math.cos(d/R)-Math.sin(φ1)*Math.sin(φ2));
     */
    //console.log(location);

    var R = 6371000; // metres

    if(location == undefined) return undefined;

    if(location.latitude == undefined || location.longitude == undefined) {
      return undefined;
    }

    var φ1 = this.toRadians(location.latitude);
    var λ1 = this.toRadians(location.longitude);
    var brng = 0;
    // pythagorus
    var d = Math.sqrt(2*distance*distance);

    var corners = [];

    // start at 45 degrees (Math.PI/4) and move 90 degrees each time
    for(brng = Math.PI/4; brng < 2 * Math.PI; brng = brng + (Math.PI/2)) {
      //console.log("CORNER " + brng);

      var φ2 = Math.asin( Math.sin(φ1)*Math.cos(d/R) + Math.cos(φ1)*Math.sin(d/R)*Math.cos(brng) );
      var λ2 = λ1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(φ1), Math.cos(d/R)-Math.sin(φ1)*Math.sin(φ2));

      //console.log(φ2);
      //console.log(λ2);
      //
      //console.log(this.toDegrees(φ2));
      //console.log(this.toDegrees(λ2));

      corners.push({latitude: this.toDegrees(φ2), longitude: this.toDegrees(λ2)});

    }

    //console.log(corners);

    return corners;

  }

};
