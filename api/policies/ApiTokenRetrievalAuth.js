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

  if(req.body.device_id == undefined) {
    return res.forbidden('Required data not provided (1)');
  } else {
    req.deviceId = req.body.device_id;
    return next();
  }

};
