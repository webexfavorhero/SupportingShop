/**
* List.js
*
* @description :: Stores the data about which shopping lists belong to whom and for which shop
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    appUser: {
      model: 'AppUser'
    },
    shop: {
      model: 'Shop'
    },

    items: {
      collection: 'listItem',
      via: 'list'
    },

    delivery: {
      model: 'delivery',
      via: 'list'
    },

    /**
     * Get the current delivery estimate for this list from the delivery
     */
    getDeliveryEstimateInMinutes: function(cb) {
      return this.delivery.getDeliveryEstimateInMinutes(cb);
    }

  },

  // Lifecycle Callbacks
  /**
   * Ensure that delivery is created on the back of this
   */
  afterCreate: function (list, cb) {
    Delivery.create({list: list, deliveryPostcode: "XXX XXX"}).exec(function(err, delivery) {
      if(err) return err;
      cb();
    });
  },
    
  /**
   * Return: List information of specific delivery
   * @param: deliveryId
   * @return: shopTitle, itemCount
   */
    listByDelivery: function (deliveryId, cb) {
        List.findOne({where: {delivery: deliveryId}}).exec(function (err, list) {
            if (err) return err;
            if (list) {
                // Shop Title
                Shop.findOne({where: {id: list.shop}}).exec(function (err, shop) {
                    if (err) {
                        console.log(err);
                        return err;
                    }

                    if (shop) {

                        // Item Count
                        ListItem.count({where: {list: list.id}}, function (err, count) {
                            if (err) return next(err);

                            if (!count) {

                            } else {
                                cb(shop.title, count);
                            }
                        });
                    }
                });
            }
        });
    }

};

