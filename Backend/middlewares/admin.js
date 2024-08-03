const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config")

function adminMiddleware(req, res, next){
    const jwtToken = req.headers.authorization
    const word = jwtToken.split(" ")
    const token = word[1]
    try {
        const decodeValue = jwt.verify(token, JWT_SECRET)
        if (decodeValue.username) {
            next()
        } else {
            res.status(403).json({
                message: "Unauthorized" 
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "incorrect input"
        })
    }
}

module.exports = adminMiddleware;