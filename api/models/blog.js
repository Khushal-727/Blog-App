const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {type: mongoose.Types.ObjectId ,ref:'category', required: true},
    blogImage: {type: String , required: true},
    slug: { type: String },
    createdBy: { type: String},
    publish_date: { type: String },
    updatedBy: { type: String},
    updatedAt: { type: String},
    isDeleted: { type: Boolean, default : false},
    deletedBy: { type: String},
    deletedAt: { type: String}
}, { versionKey: false });

module.exports = mongoose.model('blog', blogSchema);
                          