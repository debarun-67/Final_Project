const getMe = (req, res) => {
    res.json(req.user);
};

module.exports = { getMe };
