const router = require('express').Router();

const { Reading, Blog, User } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.post('/', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.body.user_id);
    const blog = await Blog.findByPk(req.body.blog_id);

    if (user && blog) {
      // "read" should be false by default
      const newReading = await Reading.create({
        userId: user.id,
        blogId: blog.id,
      });

      res.json(newReading);
    } else {
      throw Error('notFound');
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const reading = await Reading.findByPk(req.params.id);
    if (reading) {
      const readingUserId = reading.userId;
      const tokenUserId = req.decodedToken.id;
      if (tokenUserId === readingUserId) {
        reading.read = req.body.read;
        await reading.save();
        res.json(reading);
      } else {
        throw Error('editIdMismatch');
      }
    } else {
      throw Error('notFound');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
