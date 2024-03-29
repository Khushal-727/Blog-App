const mongoose = require('mongoose');
const Blog = require('../models/blog');

const titleToSlug = title => {
    let slug = title.toLowerCase();
    slug = slug.replace(/ /g, '-')
    slug = slug.replace(/[^\w-]+/g, '');
    return slug;
};

let date = () => {
    return new Date().toLocaleString()
} 

exports.get_All_Blog = (req, res) => {
    Blog.find({isDeleted: false})
    .populate('category')
        .exec()
        .then(docs => {
            res.status(200).json({
                Count: docs.length,
                Blog: docs
            });
        })      
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.get_Trading_Blog = (req, res) => {
    let title = req.query.search;
    if(title) {
        const regex = new RegExp(title , 'i');
        Blog.find({title: regex, isDeleted:false }).populate('category').exec()
        .then(results => {
            if(results.length >= 1){
                res.status(200).json({
                    Count: results.length,
                    Blogs: results
                })
            } else {
                res.status(200).json({
                    Message: "No Blog Found"
                });
            }
        })
    } else {
        Blog.find({isDeleted: false})
        .select('-isDeleted')
        .sort({publish_date: -1})
        .populate('category')
            .exec()
            .then(docs => {
                res.status(200).json({
                    Count: docs.length,
                    Data: docs
                });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
    }
}

exports.insert_Blog = (req, res) => {
    const reqData = req.body;
    Blog.find({title:reqData.title}).exec()
    .then(results => {
        if(results.length >= 1) {
            return res.status(409).json({
                Message: 'Blog title already exist'
            })
        } else {
            const blog = new Blog({
                _id: new mongoose.Types.ObjectId(),
                title: reqData.title,
                description: reqData.description,
                category: reqData.category,
                blogImage: req.file.path,
                slug: titleToSlug(reqData.title),
                createdBy: req.adminData.adminId,
                publish_date: date()
            })
            blog.save()
            .then(result => {
                res.status(200).json({
                    message: 'Data inserted.',
                    insertedData: {
                        Blog: result
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(501).json({error: err});
            });
        }        
    })
}

exports.get_Single_Blog = (req, res) => {
    const id = req.params.blogId;
    Blog.findById({_id: id})
    .select('-isDeleted')
    .populate('category')
    .exec()
        .then(results => {
            res.status(200).json({
                Message: 'Blog Data',
                Blog: results
            });
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                Message: "BlogId Invalid To Fetch the Blog",
                error: err
            });
        });
}

exports.update_Blog = (req, res) => {
    const reqData = req.body;
    const id = req.params.blogId;

    Blog.findOne({_id: id}).exec()
    .then(results => {
        if (results.isDeleted == true) {
            return res.status(200).json({
                Message: 'Blog is not found, it may be deleted',
            });
        } else {
            Blog.find({title: reqData.title}).exec()
            .then(results => {
                if(results.length >= 1) {
                    return res.status(409).json({
                        Message: 'Blog title already exist'
                    })
                } else {
                    if(results.title != reqData.title) {
                        reqData.slug = titleToSlug(reqData.title);
                    }

                    reqData.updatedBy = req.adminData.adminId;
                    reqData.updatedAt = date();
                    delete reqData.isDeleted;

                    Blog.findByIdAndUpdate(id, {$set: reqData})
                    .exec()
                    .then(results => {
                        res.status(200).json({
                            Message: 'Blog updated',
                            BlogId: results._id,
                            updatedData: reqData,
                            Token: results.token
                        });
                    })
                }                
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(501).json({
            Message: "BlogId Invalid for Blog Update",
            error: err
        });
    });
}

exports.delete_Blog = (req, res) => {
    const id = req.params.blogId;
    let Data = {
        isDeleted: true,
        deletedBy: req.adminData.adminId,
        deletedAt: date()
    };
    Blog.findById(id).exec()
    .then(results => {
        if(results.isDeleted == false) {
            Blog.findByIdAndUpdate( id, {$set: Data})
            .exec()
            .then(result => {
                res.status(200).json({
                    Message: 'Blog deleted',
                    Blog: {deletedBy: Data.deletedBy, deletedAt: Data.deletedAt}
                })
            });
        } else {
            res.status(200).json({
                Message: 'Blog already deleted',
                Blog: {deletedBy: results.deletedBy, deletedAt: results.deletedAt}
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(501).json({
            Message: "BlogId Invalid to Delete the Blog",
            error: err
        });
    });
}
