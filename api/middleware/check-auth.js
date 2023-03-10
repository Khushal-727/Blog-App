const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        let admin = await Admin.findOne({_id: decoded.adminId})

        if(token == admin.token) {
            req.adminData = decoded;
            next();
        } else {
            return res.status(400).json({
                Message: 'Token invalid'
            });
        }
    } catch (error) {
        return res.status(401).json({
            Message: 'Token Auth failed'
        });
    }
};