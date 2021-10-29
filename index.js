const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const authorsRouter = require('./controllers/authors');
const readingsRouter = require('./controllers/readings');

app.use(express.json());

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/readinglists', readingsRouter);

const errorHandler = (error, request, response, next) => {
  console.log(error);
  console.log(Object.keys(error));

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeDatabaseError'
  ) {
    // Input validation error (e.g. Attempted to create new user without email as username)
    // Assumes that only 1 error in the current state...
    if (error.errors) {
      return response
        .status(400)
        .send({ type: error.name, error: error.errors[0].message });
    }
    return response
      .status(400)
      .send({ type: error.name, message: error.message });
  }

  if (error.message === 'deletionIdMismatch') {
    response
      .status(400)
      .send({ error: 'No chance my dude, go delete your own thing :)' });
  }

  if (error.message === 'notFound') {
    response.status(404).send({ error: 'Not found' });
  }
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
