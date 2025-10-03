const leoProfanity = require("leo-profanity");
leoProfanity.loadDictionary();

const profanityFilterMiddleware = (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  if (leoProfanity.check(username)) {
    return res.status(400).json({ error: "Inappropriate username. Please choose another." });
  }

  next();
};

module.exports = profanityFilterMiddleware;
