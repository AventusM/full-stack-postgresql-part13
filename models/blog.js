const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Blog extends Model {}
Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: { type: DataTypes.TEXT, allowNull: true },
    url: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    // 13.18
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value < 1991 || value > new Date().getFullYear()) {
            throw new Error('Year should be within 1991 and this year');
          }
        },
      },
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: 'blog' },
);

module.exports = Blog;
