module.exports = (req, res) => {
    res.json({ message: "Test route working", timestamp: new Date() });
};
