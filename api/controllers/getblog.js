const Blog = require('../models/blog');

exports.get_slug = (req,res) => {
    const slug = req.params.slug;
    Blog.findOne({ slug : slug , isDeleted:false })
        .populate('category','name')
    .exec().then(docs => {
        console.log("Data is fetch using slug");
        if(docs) {
            res.status(200).json({ Blog: docs });
        } else {
            res.status(406).json({message: 'Invalid slug, No entry found'});
        }
    })
}

// exports.search_function = (req,res) => {
//     const title = req.params.slug;
//     const regex = new RegExp(title , 'i');
//     Blog.find({ title : regex})
//     .then(results => {
//         res.status(200).json(results);
//     })
// }