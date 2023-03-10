const mongoose = require('mongoose');
const adminSchema = mongoose. Schema ({
    _id: mongoose.Types.ObjectId,
    email: { type: String, 
        required : true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required : true },
    token: {type: String } 
},{ versionKey: false });

module.exports = mongoose.model('admin', adminSchema);