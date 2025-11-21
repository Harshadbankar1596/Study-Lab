
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Management = require('../models/managementModel');

const authMiddleware = async (req, res, next) => {

    const { token } = req.cookies;
    if (!token) {
        return res.status(400).json({ message: "Invalid token" });
    }
    const decoded = jwt.verify(token, process.env.JWT);
    const { _id } = decoded;

    const user = await User.findById({ _id });
    if (user) {
        req.user = user;
        return next();
    }
    const admin = await Admin.findById({ _id })
    if (admin) {
        req.admin = admin;
        return next();
    }
    const management = await Management.findById({ _id })
    if (management) {
        req.management = management;
        return next();
    }
}


module.exports = authMiddleware;