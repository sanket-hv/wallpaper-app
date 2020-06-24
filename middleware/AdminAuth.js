const isAuthenticated = (req, res, next) => {
    if (!req.cookies) {
        return res.redirect('/login');
    } else {
        next();
    }

}

module.exports = { isAuthenticated }