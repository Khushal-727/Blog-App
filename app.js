const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(morgan('dev'));
mongoose.connect('mongodb://khushals:9m7fJ4D1b7Xpmqk9cpMI@15.206.7.200:28017/khushals?authMechanism=DEFAULT&authSource=admin')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

const adminRoute = require('./api/routes/admin');
const blogRoute = require('./api/routes/blog');
const categoryRoute = require('./api/routes/category');
const getblog = require('./api/controllers/getblog');

app.use('/admin',adminRoute);
app.use('/blog',blogRoute);
app.use('/category',categoryRoute);
app.get('/:slug', getblog.get_slug);

module.exports = app;