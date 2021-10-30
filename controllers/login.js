const router = require('express').Router();
const { uuid } = require('uuidv4');

const { User, Session } = require('../models');
const { tokenExtractor } = require('../util/middleware');

// Middleware for session check in here?
// 13.24 slightly ambiguous, should session itself have boolean for validity or allow to check users' disabled value???
router.post('/', async (req, res) => {
  const body = req.body;

  let user;
  // Disable login with existing token ... what? Or should it say functionalities that require the token
  if (body.token) {
    const foundSession = await Session.findOne({
      where: { token: body.token },
    });
    if (!foundSession) {
      return res.status(401).json({ error: 'token invalid' });
    }
    user = await User.findByPk(foundSession.userId);
    if (user && user.disabled) {
      return res
        .status(401)
        .json({ error: 'user disabled. login prevented. token invalid' });
    }
  } else {
    user = await User.findOne({
      where: {
        username: body.username,
      },
    });
  }

  const passwordCorrect = body.password === 'salainen';

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  if (user.disabled) {
    return res
      .status(401)
      .json({ error: 'account disabled, please contact admin' });
  }

  const sessionData = { userId: user.id, token: uuid() };
  const previousSessions = await Session.findAll({
    where: { userId: user.id },
  });

  // Delete any previous session attached to the user
  if (previousSessions.length > 0) {
    previousSessions.forEach(async (session) => await session.destroy());
  }

  // 13.24: Set active session for user
  await Session.create(sessionData);
  res.status(200).send(sessionData);
});

router.delete('/', [tokenExtractor], async (req, res) => {
  try {
    const foundSession = await Session.findOne({
      where: { userId: req.decodedToken.id },
    });

    await foundSession.destroy();
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
