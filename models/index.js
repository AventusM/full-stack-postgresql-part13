const Note = require('./note');
const Blog = require('./blog');

Note.sync();
Blog.sync();

module.exports = {
  Note,
  Blog,
};
