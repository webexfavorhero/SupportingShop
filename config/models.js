/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

var models = {

  /***************************************************************************
   *                                                                          *
   * Your app's default connection. i.e. the name of one of your app's        *
   * connections (see `config/connections.js`)                                *
   *                                                                          *
   ***************************************************************************/
  connection: 'sourcedpgdev',

  /***************************************************************************
   *                                                                          *
   * How and whether Sails will attempt to automatically rebuild the          *
   * tables/collections/etc. in your schema.                                  *
   *                                                                          *
   * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html *
   *                                                                          *
   ***************************************************************************/
  migrate: 'alter',

  /***************************************************************************
   *                                                                          *
   * Default model settings ensures schema is true, and PK, created and       *
   * updated are specified by default on all models.                          *
   *                                                                          *
   * http://sailsjs.org/documentation/concepts/models-and-orm/model-settings  *
   *                                                                          *
   ***************************************************************************/
  schema: true,
  autoPK: true,
  autoCreatedAt: true,
  autoUpdatedAt: true

};

/**
 * Override specific settings for test and production. Default is development
 */
if(process.env.NODE_ENV=='test') {
  models.migrate = 'drop';
} else if(process.env.NODE_ENV=='production') {
  models.migrate = 'safe';
}

module.exports.models = models;
