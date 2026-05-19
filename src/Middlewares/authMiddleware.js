const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Missing Bearer token",
    });
  }

  req.token = authHeader.slice("Bearer ".length);
  return next();
};

module.exports = {
  requireAuth,
};
