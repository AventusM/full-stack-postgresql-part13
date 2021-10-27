const Note = require('./note');
const Blog = require('./blog');
const User = require('./user');

User.hasMany(Note);
User.hasMany(Blog);
Note.belongsTo(User);
Blog.belongsTo(User);

module.exports = {
  Note,
  Blog,
  User,
};
