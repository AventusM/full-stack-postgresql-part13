const router = require('express').Router();

const { User, Note, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      { model: Blog, attributes: { exclude: ['userId'] } }, // Already get this data earlier from relevant json tree
      { model: Note, attributes: { exclude: ['userId'] } },
    ],
  });
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username, // Find by parameters
    },
  });

  if (user) {
    user.username = req.body.username; // Assign new username from body
    await user.save();
    return res.json(user);
  } else {
    res.status(404).end();
  }
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
