var assert = require("assert");

describe.only('AppUserModel', function() {

  describe('#generateAccessToken()', function() {

    before(function() {
      // runs before all tests in this block
      return AppUser.create(
        {
          deviceId: 'deviceid1'
        }
      );
    });

    it('should generate and store an access token', function (done) {

      AppUser.findOne( { where: { deviceId: 'deviceid1'} }).exec(function(err, appUser) {
        // now we have an appUser, get the current access token
        var currentAccessToken = appUser.accessToken;
        appUser.generateAccessToken(function(accessToken) {
          assert.notEqual(accessToken, currentAccessToken);
          currentAccessToken = accessToken;
          appUser.generateAccessToken(function(accessToken) {
            assert.notEqual(accessToken, currentAccessToken);
            currentAccessToken = accessToken;
            appUser.generateAccessToken(function(accessToken) {
              assert.notEqual(accessToken, currentAccessToken);
              done();
            });
          });

        });

      });
    });
  });

});
