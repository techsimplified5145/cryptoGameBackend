const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  if(req.header("authorization")) {
  const token = req.header("authorization").split(" ")[1];
  //Check for token
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // Verify token
    const decode = jwt.verify(JSON.parse(token), "Profit_Outcome@2023");
    // Add user from payload
    req.user = decode;
    next();
  } catch (e) {
    res.status(400).json({ e, msg: "Token is not valid" });
  }
} else {
  res.status(400).json({ msg: "You are not authorized" });

}
}

module.exports = auth;
