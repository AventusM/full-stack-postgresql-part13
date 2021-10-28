const router = require('express').Router();

const { User, Note, Blog } = require('../models');
const { tokenExtractor } = require('../util/middleware');

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not permitted' });
  }
  next();
};

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

// This functionality requires both username and disabled to be provided in the body
// As material and tasks are put in the same space here.
router.put('/:username', [tokenExtractor, isAdmin], async (req, res) => {
  console.log('req params', req.params);
  const user = await User.findOne({
    where: {
      username: req.params.username, // Find by parameters
    },
  });

  if (user) {
    user.username = req.body.username; // Assign new username from body
    user.disabled = req.body.disabled; // Things from material
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
