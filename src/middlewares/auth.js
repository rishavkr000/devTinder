const isAdmin = (req, res, next) => {
    const token = req.body?.token || "xyz";
    const isAuthorized = token === "xdyz";
    if(!isAuthorized) {
        res.status(401).send("Unauthorized access");
    } else {
        next();
    }
}

module.exports = {isAdmin};