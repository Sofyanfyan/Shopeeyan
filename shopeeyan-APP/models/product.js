'use strict';
const {
  Model
} = require('sequelize');

const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Shop)
      Product.belongsTo(models.Category)
      Product.belongsToMany(models.Customer, {
         through: models.Cart
      })
    }

    formattedDate() {
      return this.updatedAt.toISOString().slice(0, 10)
    }

    static home(options, name) {
      if (name) {
        options.where = {
           name : { [Op.iLike]: `%${name}%` }
        }
     }

      return Product.findAll(options)
        .then(products => products)
        .catch(err => err)
    }
  }
  Product.init({
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    description: DataTypes.STRING,
    ShopId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};