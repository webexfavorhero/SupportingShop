var assert = require("assert");

describe.only('UserModel', function() {

  before(function() {
    // runs before all tests in this block
    return User.create(
      {
        name: 'paul',
        email: 'paul@roundaboutlabs.com',
        password: 'abcd1234',
        isStaff: false,
        isShopper: true,
        isSuperUser: false
      }
    ).then(function(user) {
      now = new Date();
      start = new Date();
        start.setHours(now.getHours());
        start.setMinutes(00);
        start.setSeconds(00);
      // add 2 hours to start
      end = new Date(start.getTime() + (1000*60*60*2));

      ShopperAvailable.create({user: user, start: start, end: end}).exec(function(err, availability) {
        if(err) console.log(err);
      });

    });
  });

  before(function() {
    // runs before all tests in this block
    return User.create(
      {
        name: 'paul2',
        email: 'paul2@roundaboutlabs.com',
        password: 'abcd12345',
        isStaff: false,
        isShopper: true,
        isSuperUser: false
      }
    ).then(function(user) {
        now = new Date();
        start = new Date();
        start.setHours(now.getHours());
        start.setMinutes(00);
        start.setSeconds(00);
        // add 30 minutes to start - should then fail
        end = new Date(start.getTime() + (1000*60*30));

        ShopperAvailable.create({user: user, start: start, end: end}).exec(function(err, availability) {
          if(err) console.log(err);
        });

      });
  });


  before(function() {
    // runs before all tests in this block
    return User.create(
      {
        name: 'chris',
        email: 'chris@roundaboutlabs.com',
        password: 'defg3948',
        isStaff: true,
        isShopper: false,
        isSuperUser: false
      }
    );
  });

  before(function() {
    // runs before all tests in this block
    return User.create(
      {
        name: 'jeff',
        email: 'jeff@roundaboutlabs.com',
        password: '3948lskj',
        isStaff: true,
        isShopper: false,
        isSuperUser: true
      }
    );
  });

  describe('#checkPassword()', function() {

    it('should check password is correct or otherwise', function (done) {
      User.findOne({ where: { email: 'paul@roundaboutlabs.com' } }).exec(function(err, user) {
        assert.notEqual('abcd1234', user.password);
        user.checkPassword('abcd1234', function(res) {
          assert.equal(true, res);
        });
        user.checkPassword('abc1234', function(res) {
          assert.equal(false, res);
        });
        done();
      });
    });
  });

  describe('#isAvailableToShop()', function() {

    it('should check if user is a shopper or not', function (done) {
      User.findOne({ where: { email: 'paul@roundaboutlabs.com' } }).exec(function(err, user) {
        assert.equal(true, user.isShopper);
        user.isAvailableToShop(null, function(isAvailable) {
          assert.equal(true, isAvailable);
        })
        done();
      });
    });

    it('should check if user is available for next 60 minutes', function (done) {
      User.findOne({ where: { email: 'paul2@roundaboutlabs.com' } }).exec(function(err, user) {
        assert.equal(true, user.isShopper);
        user.isAvailableToShop(null, function(isAvailable) {
          assert.equal(false, isAvailable);
        })
        done();
      });
    });

  });

});
