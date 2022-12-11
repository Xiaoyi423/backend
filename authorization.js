const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
  const bearer = req.header('Authorization');

  if (!bearer) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const token = bearer ? bearer.slice(7, bearer.length) : '';

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.decoded = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden' });
  }
};
