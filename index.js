const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const notesRouter = require('./controllers/notes');
const blogsRouter = require('./controllers/blogs');

app.use(express.json());

app.use('/api/notes', notesRouter);
app.use('/api/blogs', blogsRouter);

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeDatabaseError'
  ) {
    return response
      .status(400)
      .send({ type: error.name, message: error.message });
  }

  if (error.message === 'notFound') {
    response.status(404).send({ error: 'Unknown endpoint. Path not found' });
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
