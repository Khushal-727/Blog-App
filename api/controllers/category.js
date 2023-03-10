const mongoose = require('mongoose');
const Category = require('../models/category');


exports.create_Category = (req, res) => {
    const reqData = req.body;

    Category.find({name:reqData.name}).exec()
    .then(results => {
        if(results.length >= 1) {
            return res.status(409).json({
                Message: 'Category name is already exist'
            })
        } else {
            const category = new Category({
                _id: new mongoose.Types.ObjectId(),
                name: reqData.name        
            });
            category.save()
            .then(result => {
                res.status(200).json({
                    message: 'Data inserted.',
                    insertedData: {
                        _id: result.id,
                        name: result.name,
                        Action: {
                            type: 'GET',
                            url: 'http://localhost:3148/category/'
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
        }
    })
}

exports.get_All_Category = (req, res) => {
    Category.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                Count: docs.length,
                Category: docs.map(doc => {
                    return {
                        _id: doc._id,
                        category: doc.name,
                        Action: {
                            type: 'GET',
                            url: 'http://localhost:3148/category/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.update_Category = (req, res) => {
    const reqData = req.body;
    const id = req.params.categoryId;
    Category.find({name:reqData.name}).exec()
    .then(results => {
        if(results.length >= 1) {
            return res.status(409).json({
                Message: 'Category name is already exist'
            })
        } else {
            Category.findByIdAndUpdate( id, {$set: reqData})
            .exec()
            .then(results => {
                res.status(200).json({
                    Message: 'Category updated'
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error:err})
            });
        }
    })
}

exports.delete_Category = (req, res) => {
    const id = req.params.categoryId;
    Category.findByIdAndDelete({_id: id})
    .exec()
        .then(results => {
            if(results){
                res.status(200).json({
                    Category: results,
                    Message: 'Category deleted'
                });
            } else {
                res.status(200).json({
                    Message: 'Category Not Found'
                });
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        });
}


exports.get_tok = (req, res, next) => {
    let adminId = req.adminData.adminId;
    // console.log(adminId);
    res.status(200).json({adminId: adminId});
}
