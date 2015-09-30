var assert = require("assert");
var moment = require("moment");

describe.only('ShopModel', function() {

  describe('#isOpen()', function() {

    before(function() {
      // runs before all tests in this block
      return Shop.create(
        {
          title: 'Test Shop 2',
          smallPicture: 'http://www.test.com/smallpic.jpg',
          largePicture: 'http://www.test.com/largepic.jpg',
          description: 'Test shop 2 description - CLOSED',
          longitude: 0.0,
          latitude: 0.0
        }
      ).then(function(shop) {
          var anHourAgo = moment().subtract(1, 'hours');
          var anHourAhead = moment().add(+1, 'hours');
          var now = moment();
          // set shop to be closing now
          return ShopOpeningTime.create({shop: shop, day: now.format('e'), open: anHourAgo.format('HH:mm'), close: now.format('HH:mm')});
        })
    });

    before(function() {
      // runs before all tests in this block
      return Shop.create(
        {
          title: 'Test Shop 3',
          smallPicture: 'http://www.test.com/smallpic.jpg',
          largePicture: 'http://www.test.com/largepic.jpg',
          description: 'Test shop 3 description - OPEN',
          longitude: 0.0,
          latitude: 0.0
        }
      ).then(function(shop) {
          var now = moment();
          var anHourAgo = moment().subtract(1, 'hours');
          var anHourAhead = moment().add(+1, 'hours');
          // set shop to be closing now
          return ShopOpeningTime.create({shop: shop, day: now.format('e'), open: anHourAgo.format('HH:mm'), close: anHourAhead.format('HH:mm')});
        })
    });

    it('should say if a shop is open for the next n minutes', function (done) {

      Shop.findOne( { where: { title: 'Test Shop 2'} }).exec(function(err, shop) {

        //console.log("checking shop 2");

        // now we have a shop, run the isOpen callback
        shop.isOpen(30, function(isOpen) {
          //console.log("should be false");
          //console.log(isOpen);
          assert.equal(isOpen, false);

          //console.log("checking shop 3");

          Shop.findOne( { where: { title: 'Test Shop 3'} }).exec(function(err, shop) {
            // now we have a shop, run the isOpen callback
            shop.isOpen(30, function(isOpen) {
              //console.log("should be true");
              //console.log(isOpen);
              assert.equal(isOpen, true);
              done();
            });

          });

        });

      });

    });
  });

  describe('#getLocalShops()', function() {

    before(function() {
      return AppUser.create(
        {
          deviceId: 'deviceid9384'
        }
      );
    });


    it('should say if a shop is open for the next n minutes', function (done) {

      var location = { latitude: 0.0, longitude: 0.0 };
      var miles = 1.5;
      var distance = 1609.344 * miles;

      Shop.findLocalShops(location, distance, function(shops) {

        assert.notStrictEqual(shops, undefined);
        assert.equal(shops.length, 2);

        done();
      });

    });
  });


  describe('#getListForAppUser(appUser)', function() {

    before(function() {
      return AppUser.create(
        {
          deviceId: 'deviceid9384244'
        }
      );
    });


    it('should return me a list object', function (done) {

      assert.equal(1,1);

      AppUser.findOne({deviceId: 'deviceid9384244'}).exec(function(err, appUser) {
        Shop.findOne({title: 'Test Shop 2'}).exec(function(error, shop) {
          shop.getListForAppUser(appUser, function(list) {

            assert.notStrictEqual(list, undefined);

            ListItem.count({list: list.id}).exec(function(err, num) {
              assert.equal(num, 0);
              done();
            });


          });
        });
      });


    });
  });

});
