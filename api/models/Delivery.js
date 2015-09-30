<<<<<<< HEAD
/**
* Delivery.js
*
* @description :: Stores delivery information for a given list
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {

    deliveryPostcode: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string',
      email: true
    },
    mobile: {
      type: 'string'
    },
    address: {
      type: 'text'
    },
    // information on the delivery e.g. ring bottom doorbell on arrival
    note: {
      type: 'text'
    },

    /**
     * Payment card information and Stripe extra info for auth and capture
     */
    cardName: {
      type: 'string'
    },
    cardNumber: {
      type: 'string'
    },
    cardExpiryMonth: {
      type: 'integer'
    },
    cardExpirtyYear: {
      type: 'integer'
    },
    cardCVV: {
      type: 'string'
    },
    stripeChargeId: {
      type: 'string'
    },
    isStripeChargeCaptured: {
      type: 'boolean',
      default: false
    },

    /**
     * Specific information on the payment's authorised and delivery costs.
     * Currency values are in lowest currency value e.g. pence or cents not pounds or dollars
     * so storing £10.38, means storing 1038 and currency of GBP
     */
    shopAuthorisedValue: {
      type: 'integer'
    },
    shopTotalValue: {
      type: 'integer'
    },
    shopCurrency: {
      type: 'string',
      default: 'GBP'
    },
    customerDeliveryCost: {
      type: 'integer'
    },
    feedback: {
      type: 'text'
    },
      
    isDelivered: {
      type: 'boolean',
      defaultsTo: false
    },

    /*********************
     * ASSOCIATIONS      *
     *********************/

    /**
     * One to one relationship with List
     */
    list: {
      model: 'list',
      via: 'delivery'
    },
    shopper: {
      model: 'user'
    },
    
    /**
     * One to many DeliveryNotes
     */
    deliveryNotes: {
      collection: 'deliveryNote',
      via: 'delivery'
    },

    deliveryLogs: {
      collection: 'deliveryLog',
      via: 'delivery'
    },




    /*********************
     * ATTRIBUTE METHODS *
     *********************/

    /**
     * Returns the latest DeliveryStatus identified from the last DeliveryAuditLog record created
     * @returns {null}
     */
    getCurrentStatus: function(cb) {
      cb(null);
    },

    /**
     * Returns: Number of minutes the delivery is likely to arrive at the delivery postcode as an integer
     * @returns {null}
     */
    getDeliveryEstimateInMinutes: function(cb) {
      cb(60);
    },

    /**
     * Returns: true if the stripe capture is successful
     * @returns {null}
     */
    doStripeCapture: function(cb) {
      cb(false);
    },

    /**
     * Returns: value of authorisation charge to set in pence as an integer e.g. £10.42 would be 1042
     * Method updates the authorisation charge value in the model directly
     * Algorithm TBC
     * @returns {null}
     */
    updateAuthorisationChargeInPence: function(cb) {
      cb(-1);
    },

    /**
     * Returns: value of delivery cost in pence as an integer e.g. £10.42 would be 1042
     * Method updates the delivery cost in the model directly
     * Algorithm TBC
     * @returns {null}
     */
    updateDeliveryCostInPence: function(cb) {
      cb(-1);
    }


  }
};

=======
/**
* Delivery.js
*
* @description :: Stores delivery information for a given list
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {

    deliveryPostcode: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string',
      email: true
    },
    mobile: {
      type: 'string'
    },
    address: {
      type: 'text'
    },
    // information on the delivery e.g. ring bottom doorbell on arrival
    note: {
      type: 'text'
    },

    /**
     * Payment card information and Stripe extra info for auth and capture
     */
    cardName: {
      type: 'string'
    },
    cardNumber: {
      type: 'string'
    },
    cardExpiryMonth: {
      type: 'integer'
    },
    cardExpirtyYear: {
      type: 'integer'
    },
    cardCVV: {
      type: 'string'
    },
    stripeChargeId: {
      type: 'string'
    },
    isStripeChargeCaptured: {
      type: 'boolean',
      default: false
    },

    //isShopper: {
    //  type: 'boolean',
    //  default: false
    //},

    /**
     * Specific information on the payment's authorised and delivery costs.
     * Currency values are in lowest currency value e.g. pence or cents not pounds or dollars
     * so storing £10.38, means storing 1038 and currency of GBP
     */
    shopAuthorisedValue: {
      type: 'integer'
    },
    shopTotalValue: {
      type: 'integer'
    },
    shopCurrency: {
      type: 'string',
      default: 'GBP'
    },
    customerDeliveryCost: {
      type: 'integer'
    },
    feedback: {
      type: 'text'
    },


    isDelivered: {
      type: 'boolean',
      defaultsTo: false
    },

    /*********************
     * ASSOCIATIONS      *
     *********************/

    /**
     * One to one relationship with List
     */
    shopper: {
      model: 'user'
    },

    /**
     * One to one relationship with List
     */
    list: {
      model: 'list',
      via: 'delivery'
    },

    /**
     * One to many DeliveryNotes
     */
    deliveryNotes: {
      collection: 'deliveryNote',
      via: 'delivery'
    },

    deliveryLogs: {
      collection: 'deliveryLog',
      via: 'delivery'
    },




    /*********************
     * ATTRIBUTE METHODS *
     *********************/

    /**
     * Returns the latest DeliveryStatus identified from the last DeliveryAuditLog record created
     * @returns {null}
     */
    getCurrentStatus: function(cb) {
      cb(null);
    },

    /**
     * Returns: Number of minutes the delivery is likely to arrive at the delivery postcode as an integer
     * @returns {null}
     */
    getDeliveryEstimateInMinutes: function(cb) {
      cb(60);
    },

    /**
     * Returns: true if the stripe capture is successful
     * @returns {null}
     */
    doStripeCapture: function(cb) {
      cb(false);
    },

    /**
     * Returns: value of authorisation charge to set in pence as an integer e.g. £10.42 would be 1042
     * Method updates the authorisation charge value in the model directly
     * Algorithm TBC
     * @returns {null}
     */
    updateAuthorisationChargeInPence: function(cb) {
      cb(-1);
    },

    /**
     * Returns: value of delivery cost in pence as an integer e.g. £10.42 would be 1042
     * Method updates the delivery cost in the model directly
     * Algorithm TBC
     * @returns {null}
     */
    updateDeliveryCostInPence: function(cb) {
      cb(-1);
    }


  }
};

>>>>>>> 66262501826cbbb0d7b5748b19065612415a6690
