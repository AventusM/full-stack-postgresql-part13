const { User, Session } = require('../models');

const tokenExtractor = async (req, res, next) => {
  const bodyToken = req.body.token;
  if (bodyToken) {
    const foundSession = await Session.findOne({ where: { token: bodyToken } });
    if (!foundSession) {
      return res.status(401).json({ error: 'token invalid' });
    }
    const foundUserFromSession = await User.findByPk(foundSession.userId);
    if (!foundUserFromSession.disabled) {
      req.decodedToken = { id: foundSession.userId };
    } else {
      return res.status(401).json({ error: 'user disabled. token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }

  next();
};

module.exports = { tokenExtractor };
