const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');


const CategoryController = require('../controllers/category');

router.post('/', checkAuth, CategoryController.create_Category);
router.get ('/', checkAuth, CategoryController.get_All_Category );
router.patch('/:categoryId', checkAuth, CategoryController.update_Category);
router.delete('/:categoryId', checkAuth, CategoryController.delete_Category);

module.exports = router;