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
                        category: doc.name
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
            Category.findByIdAndUpdate({_id: id}, {$set: reqData})
            .exec()
            .then(result => {
                res.status(200).json({
                    Message: 'Category updated',
                    CategoryId: result._id,
                    CategoryName: reqData.name
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ Message: "CategoryId is Invalid" });
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
            res.status(500).json({ Message: "CategoryId is Invalid" });
        });
}
