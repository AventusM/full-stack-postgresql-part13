const router = require('express').Router();
const { Op } = require('sequelize');

const { User, Note, Blog, Team, Reading } = require('../models');
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
      {
        model: Note,
        as: 'markedNotes',
        attributes: { exclude: ['userId'] },
        through: { attributes: [] },
        include: { model: User, attributes: ['name'] },
      },
      { model: Team, attributes: ['name', 'id'], through: { attributes: [] } }, // dismiss the association table as it is not needed (https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table) --> If you don't want the nested grant field at all, use attributes: []:
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
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: { attributes: [] },
        include: {
          model: Reading,
          as: 'readinglists',
          attributes: { exclude: ['userId', 'blogId'] },
        },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
