const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const bcrypt = require('bcrypt');


exports.admin_Signup = (req, res) => {
    const reqData = {email,password} = req.body
    Admin.find({email: reqData.email})
    .exec()
    .then(admin => {
        if(admin.length >= 1) {
            return res.status(409).json({
                Message: 'Mail Already Exists'
            });
        } else {
            bcrypt.hash(reqData.password, 10, (err, hash) => {
                if (err){
                    return res.status(500).json ({error: err});
                } else {
                    const admin = new Admin({
                        _id: new mongoose.Types.ObjectId(),
                        email: reqData.email,
                        password: hash
                    });
                    admin.save()
                    .then(result => {
                        res.status(201).json({
                            Message: 'Admin is Created',
                            Created_Admin: result
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    });
}

exports.admin_Login = (req, res) => {
    const reqData = req.body
    Admin.findOne({ email: reqData.email })
    .exec()
    .then(admin => {
        if (admin.length < 1) {
            return res.status(401).json({
                Message: 'Admin Email is Invalid'
            });
        }
        bcrypt.compare(reqData.password, admin.password, (err,result) => {
            if (err) {
                return res.status(401).json({
                    Message: 'Admin Auth have error'
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: admin.email,
                    adminId: admin._id
                }, process.env.JWT_KEY,
                { expiresIn: "5h" });

                Admin.findOneAndUpdate({email: reqData.email}, {$set: {token:token}}).exec()
                
                return res.status(200).json({
                    Message: 'Admin Auth successful',
                    Admin_id: admin._id,
                    Token: token,
                });
                
            } else {
                res.status(401).json({
                    Message: 'Admin Password is Invalid'
                });
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json ({
            error: err
        });
    });
}

exports.admin_Logout = (req, res) => {
    let admin = req.adminData.adminId;
    Admin.findByIdAndUpdate(admin , {$set: {token : null} }).exec()
    .then(result => {
        return res.status(200).json({
            Message: 'Admin Logout successful',
            Admin_id: admin[0]._id,
            Data: result
        });
    });
}