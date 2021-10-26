const Note = require('./note');
const Blog = require('./blog');
const User = require('./user');

Note.sync();
Blog.sync();
User.sync();

User.hasMany(Note);
User.hasMany(Blog);
Note.belongsTo(User);
Blog.belongsTo(User);

User.sync({ alter: true });
Note.sync({ alter: true });
Blog.sync({ alter: true });

module.exports = {
  Note,
  Blog,
  User,
};
