/**
 * ShopperController
 *
 * @description :: Server-side logic for managing shoppers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');
var sync = require('sync');
var async = require('async');

module.exports = {
    login: function (req, res) {
        res.view();
    },
    
    index: function (req, res, next) {
        
        if (!req.session.user) {
            Users.findOne({where: {email: req.param('email')}}).populate('deliveries').exec(function(err, user) {
                if (err) return next(err);

                if (!user) {
                    var noAccountError = [{name: 'noAccount', message: 'The user with email ' + req.param('email') + ' not found.'}]
                    req.session.flash = {
                        err: noAccountError
                    }
                    res.redirect('/shopper/login');
                    return;
                } else {

                    // Compare password from the form params to the encrypted password of the user found.
                    bcrypt.compare(req.param('password'), user.password, function(err, valid) {
                        if (err) return next(err);
    
                        // If the password from the form doesn't match the password from the database...
                        if (!valid) {
                            var emailPasswordMismatchError = [{name: 'emailPasswordMismatch', message: 'Invalid email and password combination.'}]
                            req.session.flash = {
                                err: emailPasswordMismatchError
                            }
                            res.redirect('/shopper/login');
                            return;
                        }

                        // Log shopper in
                        req.session.authenticated = true;
                        req.session.user = user;

                        if (req.session.flash) {
                            delete req.session.flash;
                        }
                    
                        var deliveries = user.deliveries;
                        
                        var deliveriesReturn = [];
                        var i = 0;
                        async.each(
                            deliveries,
                            function (delivery, callback) {
                                var jsonData = {};
                                
                                jsonData.listId = delivery.list;
                                jsonData.orderedDate = delivery.createdAt;
                                jsonData.deliveredDate = delivery.updatedAt;
                                
                                async.waterfall([
                                    function(callback) {
                                        
                                        List.findOne({where: {delivery: delivery.id}}).exec(function (err, list) {
                                            
                                            if (err) return err;
                                            
                                            if (!list) {
                                                console.log('There is no list for this condition.');
                                            } else {
                                                callback(null, list.shop, list.id);
                                            }
                                        });
                                    }, function(shopId, listId, callback) {
                                        
                                        Shop.findOne({where: {id: shopId}}).exec(function (err, shop){
                                            if (err) return err;
                                            
                                            if (!shop) {
                                                console.log('There is no shop for this condition.');
                                            } else {
                                        
                                                ListItem.count({where: {list: listId}}).exec(function (err, count){
                                                    if (err) return err;

                                                    if (!count) {
                                                        console.log('There is no itemCount for this condition.');
                                                    } else { 
                                                        i = i + 1;
                                                        jsonData.shopTitle = shop.title;
                                                        jsonData.itemCount = count;
                                                        
                                                        if (!delivery.isDelivered) {
                                                            deliveriesReturn.push(jsonData);
                                                        }
                                                        
                                                        if (i == deliveries.length) {
                                                            res.view({
                                                                deliveries: deliveriesReturn
                                                            });
                                                        }
                                                        
                                                        callback(null, 'done');
                                                    }
                                                });
                                            }
                                        });
                                    },
                                ]);
                                
                                callback();
                            }, function(err){
                                if (err) return err;
                            }
                        );

                    });  // Compare password end
                }
            });
        } else {
            var user = req.session.user;
            var deliveries = user.deliveries;

            var deliveriesReturn = [];
            
            var i = 0;
            async.each(
                deliveries,
                function (delivery, callback) {
                    var jsonData = {};

                    jsonData.listId = delivery.list;
                    jsonData.orderedDate = delivery.createdAt;
                    jsonData.deliveredDate = delivery.updatedAt;

                    async.waterfall([
                        function(callback) {

                            List.findOne({where: {delivery: delivery.id}}).exec(function (err, list) {

                                if (err) return err;

                                if (!list) {
                                    console.log('There is no list for this condition.');
                                } else {
                                    callback(null, list.shop, list.id);
                                }
                            });
                        }, function(shopId, listId, callback) {

                            Shop.findOne({where: {id: shopId}}).exec(function (err, shop){
                                if (err) return err;

                                if (!shop) {
                                    console.log('There is no shop for this condition.');
                                } else {

                                    ListItem.count({where: {list: listId}}).exec(function (err, count){
                                        if (err) return err;

                                        if (!count) {
                                            console.log('There is no itemCount for this condition.');
                                        } else { 
                                            i = i + 1;
                                            jsonData.shopTitle = shop.title;
                                            jsonData.itemCount = count;

                                            if (!delivery.isDelivered) {
                                                deliveriesReturn.push(jsonData);
                                            }

                                            if (i == deliveries.length) {
                                                res.view({
                                                    deliveries: deliveriesReturn
                                                });
                                            }

                                            callback(null, 'done');
                                        }
                                    });
                                }
                            });
                        },
                    ]);

                    callback();
                }, function(err){
                    if (err) return err;
                }
            );
        }
    },
    
    lists: function(req, res) {
        var id = req.param('id');
        
        if (id == 'completed') {
            if (req.session.user) {
                var user = req.session.user;

                var deliveries = user.deliveries;

                var deliveriesReturn = [];
                
                var i = 0;
                async.each(
                    deliveries,
                    function (delivery, callback) {
                        var jsonData = {};

                        jsonData.listId = delivery.list;
                        jsonData.orderedDate = delivery.createdAt;
                        jsonData.deliveredDate = delivery.updatedAt;

                        async.waterfall([
                            function(callback) {

                                List.findOne({where: {delivery: delivery.id}}).exec(function (err, list) {

                                    if (err) return err;

                                    if (!list) {
                                        console.log('There is no list for this condition.');
                                    } else {
                                        callback(null, list.shop, list.id);
                                    }
                                });
                            }, function(shopId, listId, callback) {

                                Shop.findOne({where: {id: shopId}}).exec(function (err, shop){
                                    if (err) return err;

                                    if (!shop) {
                                        console.log('There is no shop for this condition.');
                                    } else {

                                        ListItem.count({where: {list: listId}}).exec(function (err, count){
                                            if (err) return err;

                                            if (!count) {
                                                console.log('There is no itemCount for this condition.');
                                            } else { 
                                                i = i + 1;
                                                jsonData.shopTitle = shop.title;
                                                jsonData.itemCount = count;

                                                if (delivery.isDelivered) {
                                                    deliveriesReturn.push(jsonData);
                                                }

                                                if (i == deliveries.length) {
                                                    res.view('shopper/completedLists', {
                                                        deliveries: deliveriesReturn
                                                    });
                                                }

                                                callback(null, 'done');
                                            }
                                        });
                                    }
                                });
                            },
                        ]);

                        callback();
                    }, function(err){
                        if (err) return err;
                    }
                );
            } else {
                res.redirect('shopper/login');
            }
        } else {
            if (req.session.user) {
                List.findOne({where: {id: id}}).populate('items').exec(function (err, items) {
                    if (err) return err;
                    
                    if (!items) {
                        console.log('There is no item.');
                    } else {
                        res.view('shopper/shoppingList', {
                            items: items
                        });
                    }
                });
            } else {
                res.redirect('shopper/login');
            }
        }
    },
    
    update: function (req, res, next) {
        var criteria = {};
        
        criteria = _.merge({}, req.params.all(), req.body);
        
        var id = req.params('id');
        
        if (!id) {
            return res.badRequest('No id provided.');
        }
        
        List.update(id, criteria, function(err, lists) {
            if (lists.length == 0) return res.notFound();
            
            if (err) return next(err);
            
            res.json(lists);
        });
    },
    
    destroy: function (req, res, next) {
        var id = req.param('id');
        
        if (!id) {
            return res.badRequest('No id provided.');
        }
        
        List.findOne(id).done(function(err, result) {
            if (err) return res.serverError(err);
            
            if (!result) return res.notFound();
            
            List.destroy(id, function (err) {
                if (err) return next (err);
                
                return res.json(result);
            });
        });
    },
    
    _config: {}
};

