/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  if(req.body.access_token == undefined) {
    console.log("forbidden (2)");
    return res.forbidden('Required data not provided (2)');
  }

  // is it the right user?
  AppUser.findOne({deviceId: req.body.device_id, accessToken: req.body.access_token }).exec(function(err, appUser) {
    req.appUser = appUser;
    if(appUser == undefined) {
      return res.forbidden('Access information invalid (3)')
    }
    req.accessToken = req.body.access_token;
    next();
  });

};
