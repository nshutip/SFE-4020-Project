const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/userModel")

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

const verifyToken = async(req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) return res.status(403).send("A token is required for authentication");

  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.user_id });

    if (!user) return res.status(404).send({ error: "User not found!" });

    req.user = user
    next();
  } catch {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;