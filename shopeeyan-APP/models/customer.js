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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name cannot be empty!'
        },
        notEmpty: {
          msg: 'Name cannot be empty!'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Email cannot be empty!'
        },
        notEmpty: {
          msg: 'Email cannot be empty!'
        },
        isEmail: {
          msg: 'Please use valid email address!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password cannot be empty!'
        },
        notEmpty: {
          msg: 'Password cannot be empty!'
        }
      }
    }
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