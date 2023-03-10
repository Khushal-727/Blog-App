const express = require("express");
const multer = require("multer");
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const blogController = require('../controllers/blog')

// let date = new Date().toLocaleString()
let date = new Date().toISOString()

const storage = multer.diskStorage({
    destination: function( req, file, cb) {
        cb (null,'./uploads/');
    },
    filename: function( req, file, cb) {
        cb(null,date+file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 15
    },
    fileFilter: fileFilter
});



router. get('/tranding',blogController.get_Trading_Blog);

router. get('/list', checkAuth, blogController.get_All_Blog);
router.post('/add', checkAuth, uploadFile.single('blogImage'),blogController.insert_Blog);

router.get('/:blogId',blogController.get_Single_Blog);
router.patch('/:blogId',checkAuth,blogController.update_Blog);
router.delete('/:blogId',checkAuth,blogController.delete_Blog);

module.exports = router;