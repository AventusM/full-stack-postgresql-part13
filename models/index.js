const Note = require('./note');
const Blog = require('./blog');
const User = require('./user');
const Team = require('./team');

// Association tables below
const Membership = require('./membership');
const UserNotes = require('./user_notes');
const Reading = require('./reading');

User.hasMany(Note);
User.hasMany(Blog);
Note.belongsTo(User);
Blog.belongsTo(User);

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

// Aliases to prevent mixups with original notes
User.belongsToMany(Note, { through: UserNotes, as: 'markedNotes' }); // --> Material example with markedNotes just before 13.19-13.23 excercises has notes that have no previous owner?
Note.belongsToMany(User, { through: UserNotes, as: 'usersMarked' });

User.belongsToMany(Blog, { through: Reading, as: 'readings' });
Blog.belongsToMany(User, { through: Reading });

module.exports = {
  Note,
  Blog,
  User,
  Team,
  Membership,
  UserNotes,
  Reading,
};
