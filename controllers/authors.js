const router = require('express').Router();
const { Blog } = require('../models');
const { col, fn, literal } = require('sequelize');

// 13.16 https://sequelize.org/master/manual/model-querying-basics.html
router.get('/', async (req, res) => {
  const authorBlogs = await Blog.findAll({
    group: 'author',
    order: literal('max(likes) DESC'), // 13.16 Bonus
    // [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats']
    attributes: [
      'author',
      [fn('SUM', col('likes')), 'likes'],
      [fn('COUNT', col('author')), 'blogs'],
    ],
  });
  res.json(authorBlogs);
});

module.exports = router;
