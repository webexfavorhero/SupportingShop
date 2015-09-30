/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

module.exports = {
	'new': function(req, res) {
        res.view('/shopper/index');
    },
    
    create: function(req, res, next) {
        
        // Check for username and password in params via the form, if none
        // redirect the browser back to the sign-in form.
        if (!req.param('username') || !req.param('password')) {
            // return next({err: ["Password doesn't match password confirmation."]});
            
            var usernamePasswordRequireError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}]
            
            req.session.flash = {
                err: usernamePasswordRequireError
            }
            
            res.redirect('/shopper/index');
            return;
        }
        
        // Try to find the user by there username.
        User.find().where({email: req.param('email')}).exec(function foundUser (err, user) {
            if (err) return next(err);
            
            if (!user) {
                var noAccountError = [{name: 'noAccount', message: 'The username ' + req.param('username') + ' not found.'}]
                req.session.flash = {
                    err: noAccountError
                }
                res.redirect('/shopper/index');
                return;
            }
            
            // Compare password from the form params to the encrypted password of the user found.
            bcrypt.compare(req.param('password'), user.password, function(err, valid) {
                if (err) return next(err);
                
                // If the password from the form doesn't match the password from the database...
                if (!valid) {
                    var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid username and password combination.'}]
                    req.session.flash = {
                        err: usernamePasswordMismatchError
                    }
                    res.redirect('/shopper/index');
                    return;
                }
                
                // Log shopper in
                req.session.authenticated = true;
                req.session.User = user;
                
                // consol.log(req.session.User);
                
                // Redirect to shopper page
                res.redirect('/shopper/index/' + user.id);
            });
        });
    },
    
    destroy: function(req, res, next) {
        
        // Wipe out the session (log out)
        req.session.destroy;
        
        // Redirect the browser to the sign-in screen
        res.redirect('/');
    }
};

