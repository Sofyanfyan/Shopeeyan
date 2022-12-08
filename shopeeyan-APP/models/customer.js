'use strict';
const {
  Model
} = require('sequelize');

var bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsToMany(models.Product, {
         through: models.Cart
      })
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });

  Customer.beforeCreate((instance, options) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(instance.password, salt);
    instance.password = hash
  })

  return Customer;
};