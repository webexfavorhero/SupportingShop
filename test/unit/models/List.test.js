var assert = require("assert");

describe.only('ListModel', function() {

  describe('#getDeliveryEstimateInMinutes()', function() {

    before(function() {

      // runs before all tests in this block
      // see: http://ricostacruz.com/cheatsheets/bluebird.html
      return Shop.create(
        {
          title: 'Test Shop',
          smallPicture: 'http://www.test.com/smallpic.jpg',
          largePicture: 'http://www.test.com/largepic.jpg',
          description: 'Test shop description',
          longitude: 0.0,
          latitude: 0.0
        }
      ).then(function(shop) {
          return [AppUser.create(
            {
              deviceId: 'deviceid9384'
            }
          ), shop];
        }).spread(function(appUser, shop) {
          return List.create(
            {
              appUser: appUser,
              shop: shop
            }
          )
        });
    });

    it('should return the delivery estimate in minutes', function (done) {

      assert.equal(1,1);

      Shop.findOne({where: {title: 'Test Shop'}})
        .then(function(shop) {
          return [ AppUser.findOne({where: {deviceId: 'deviceid9384'}}), shop ];
        })
        .spread(function(appUser, shop) {
          return List.findOne({where: {shop: shop, appUser: appUser}}).exec(function(err, list) {
            if(err) return err;
            list.getDeliveryEstimateInMinutes(function(estimateInMinutes) {
              // default is 60 minutes
              assert.equal(estimateInMinutes, 60);
              done();
            });
          })

        }).catch(function(err) {
          console.log(err);
          done();
        });
    });

  });

});
