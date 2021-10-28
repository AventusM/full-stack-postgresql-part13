const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { Blog, User } = require('../models');
const { SECRET } = require('../util/config');
const { tokenExtractor } = require('../util/middleware');

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  let where = {};

  // 13.14 Examples with Op.and and Op.or https://sequelize.org/master/manual/model-querying-basics.html
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: '%' + req.query.search + '%', // Case insensitive
          },
        },
        {
          author: {
            [Op.iLike]: '%' + req.query.search + '%', // Case insensitive
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username'], // This is basically the populate function of mongoose
    },
    where,
    order: [['likes', 'DESC']], // 13.15
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    throw Error('notFound');
  }
});

router.delete('/:id', [blogFinder, tokenExtractor], async (req, res) => {
  if (req.blog) {
    const tokenUserId = req.decodedToken.id;
    const blogUserId = req.blog.toJSON().userId;
    if (tokenUserId === blogUserId) {
      await req.blog.destroy();
    } else {
      throw Error('deletionIdMismatch');
    }
  }
  res.status(204).end();
});

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      req.blog.likes = req.body.likes;
      await req.blog.save();
      res.json(req.blog);
    }
    throw Error('notFound');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
