<<<<<<< HEAD
/**
* User.js
*
* @description :: Admin user and Shopper class
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      minLength: 8,
      alphanumericdashed: true,
      required: true
    },
    mobile: {
      type: 'string'
    },
    publicMobile: {
      type: 'string'
    },
    isStaff: {
      type: 'boolean',
      defaultsTo: false
    },
    isShopper: {
      type: 'boolean',
      defaultsTo: false
    },
    isSuperuser: {
      type: 'boolean',
      defaultsTo: false
    },

    availableTimes: {
      collection: 'shopperAvailable',
      via: 'user'
    },

    deliveryLogs: {
      collection: 'deliveryLog',
      via: 'shopper'
    },
      
    deliveries: {
      collection: 'delivery',
      via: 'shopper'
    },

    // Attribute methods
    /**
     * Override object method to remove the encrypted password (in case it's ever sent) and user's private mobile
     */
    toJSON: function() {
      var obj = this.toObject();
      // Remove the password object value
      delete obj.password;
      // Remove the mobile
      delete obj.mobile;
      // return the new object without password/mobile
      return obj;
    },

    /**
     * Check password supplied is valid for this user
     */
    checkPassword: function(password, cb) {
      bcrypt.compare(password, this.password, function(err, res) {
        cb(res);
      })
    },

    /**
     * If this is is a shopper, and is available to complete the list and deliver it by the delivery time
     * - uses the ShopperAvailable model (availableTimes) and passed in list delivery data to identify this data
     */
    isAvailableToShop: function (list, cb){
      if(!this.isShopper) return cb(false);
      now = new Date();
      delivery_time_minutes = 90;
      now_plus_delivery_time = new Date(now.getTime() + (1000*60*60*delivery_time_minutes));
      // check if they are able to do this dates
      ShopperAvailable.find({ where: { user: this, start: { '<': now }, end: { '>': now_plus_delivery_time } } }).exec(function(err, times) {
        if(err) cb(false);
        cb(times.length > 0);
      });
    }
  },


  // Lifecycle Callbacks
  /**
   * Ensure password is encrypted on creation of password
   */
  beforeCreate: function (values, cb) {
    // Encrypt password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  },
    
  /**
   * Find user with required username
   */ 
  findOneByUsername: function (username, callback) {
      User.find({ where: {user: username}}).exec(function(err, user) {
          if (err) callback(err);
          if (!user.isShopper) callback(err);

          callback(user);
      });
  }
};

=======
/**
* User.js
*
* @description :: Admin user and Shopper class
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      minLength: 8,
      alphanumericdashed: true,
      required: true
    },
    mobile: {
      type: 'string'
    },
    publicMobile: {
      type: 'string'
    },
    isStaff: {
      type: 'boolean',
      defaultsTo: false
    },
    isShopper: {
      type: 'boolean',
      defaultsTo: false
    },
    isSuperuser: {
      type: 'boolean',
      defaultsTo: false
    },

    availableTimes: {
      collection: 'shopperAvailable',
      via: 'user'
    },

    deliveryLogs: {
      collection: 'deliveryLog',
      via: 'shopper'
    },

    // one to many deliveries for each user
    deliveries: {
      collection: 'delivery',
      via: 'shopper'
    },

    // Attribute methods
    /**
     * Override object method to remove the encrypted password (in case it's ever sent) and user's private mobile
     */
    toJSON: function() {
      var obj = this.toObject();
      // Remove the password object value
      delete obj.password;
      // Remove the mobile
      delete obj.mobile;
      // return the new object without password/mobile
      return obj;
    },

    /**
     * Check password supplied is valid for this user
     */
    checkPassword: function(password, cb) {
      bcrypt.compare(password, this.password, function(err, res) {
        cb(res);
      })
    },

    /**
     * If this is is a shopper, and is available to complete the list and deliver it by the delivery time
     * - uses the ShopperAvailable model (availableTimes) and passed in list delivery data to identify this data
     */
    isAvailableToShop: function (list, cb){
      if(!this.isShopper) return cb(false);
      now = new Date();
      delivery_time_minutes = 90;
      now_plus_delivery_time = new Date(now.getTime() + (1000*60*60*delivery_time_minutes));
      // check if they are able to do this dates
      ShopperAvailable.find({ where: { user: this, start: { '<': now }, end: { '>': now_plus_delivery_time } } }).exec(function(err, times) {
        if(err) cb(false);
        cb(times.length > 0);
      });
    }
  },


  // Lifecycle Callbacks
  /**
   * Ensure password is encrypted on creation of password
   */
  beforeCreate: function (values, cb) {
    // Encrypt password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  },

  /**
   * Find user with required username
   */
  findOneByUsername: function (username, callback) {
      User.find({ where: {user: username}}).exec(function(err, user) {
          if (err) callback(err);
          if (!user.isShopper) callback(err);

          callback(user);
      });
  },
    
    
  /**
   * Return: Deliveries of Specific User
   * @param: userEmail
   * @param: isDelivered
   * @return: deliveries
   */
    deliveriesByUser: function(userEmail, isDelivered, cb) {
        Users.findOne({where: {email: userEmail}}).populate('deliveries').exec(function(err, user) {
            
            if (err) {
              // return nothing
              console.log(err);
              cb([]);
            } else {
            }
        });
    }
};

>>>>>>> 66262501826cbbb0d7b5748b19065612415a6690
