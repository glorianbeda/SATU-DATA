module.exports = (req, res) => {
  res.json({
    env: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
  });
};
