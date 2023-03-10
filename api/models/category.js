const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true }
},{ versionKey: false });

module.exports = mongoose.model('category', categorySchema);
                            // collection name