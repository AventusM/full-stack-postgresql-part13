const Note = require('./note');
const Blog = require('./blog');
const User = require('./user');
const Team = require('./team');

// Association tables below
const Membership = require('./membership');
const UserNotes = require('./user_notes');
const Reading = require('./reading');

const Session = require('./session');

User.hasMany(Note);
User.hasMany(Blog);
Note.belongsTo(User);
Blog.belongsTo(User);

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

// Aliases to prevent mixups with original notes
User.belongsToMany(Note, { through: UserNotes, as: 'markedNotes' }); // --> Material example with markedNotes just before 13.19-13.23 excercises has notes that have no previous owner?
Note.belongsToMany(User, { through: UserNotes, as: 'usersMarked' });

// Testing: The best of both worlds: the Super Many-to-Many relationship --> Commented out things not used
//User.hasMany(Reading);
//Reading.belongsTo(User);
Blog.hasMany(Reading, { as: 'readinglists' });
//Reading.belongsTo(Blog);
User.belongsToMany(Blog, { through: Reading, as: 'readings' });
//Blog.belongsToMany(User, { through: Reading });

// 13.24
User.hasOne(Session);
Session.belongsTo(User);

module.exports = {
  Note,
  Blog,
  User,
  Team,
  Membership,
  UserNotes,
  Reading,
  Session,
};
