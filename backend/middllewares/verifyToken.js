const jwt = require('jsonwebtoken')

//verifyToken
const verifyToken = (req, res, next) => {
    if(!req.headers.authorization) return res.status(403).json({msg: "Not authorized. No token"})

    if(req.headers.authorization.startsWith("Bearer ")){
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if(err) return res.status(403).json({msg: "Wrong or expired token!"})
            req.user = data
            next()
        })
    } else {
        return res.status(403).json({msg: "Not authorized. Malformed token"})
    }
}

//verifyTokenAdmin
const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        //req.user = {id: user._id, isAdmin: user.isAdmin}
        if(!req.user.isAdmin) return res.status(403).json({msg: "You are not admin!"})
        next()
    })
}

module.exports = {
    verifyToken,
    verifyTokenAdmin
}
