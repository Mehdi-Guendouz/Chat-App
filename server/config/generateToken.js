const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_S, {
        expiresIn: "5d"
    })
}

module.exports = generateToken