const router = require('express').Router();

const { Reading, Blog, User } = require('../models');

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
module.exports = router;
