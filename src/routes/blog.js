// Node module
const express = require('express');
const { body } = require('express-validator');

// Jalankan function Router()
const router = express.Router();

// local module
const blogController = require('../controllers/blog');

// HTTP Method + validasi [POST] : /v1/blog/post 
router.post('/post', [
  body('title')
    .isLength({ min: 5 })
    .withMessage('input title tidak sesuai'),
  body('body')
    .isLength({ min: 5 })
    .withMessage('input body tidak sesuai')],
  blogController.create);

/*
// HTTP Method [GET] All : /v1/blog/posts
router.get('/posts', blogController.getAll);
 */

// HTTP Method [GET] limit : /v1/blog/posts?page=1&perPage=5
router.get('/posts', blogController.getLimit);

// HTTP Method [GET] by ID : /v1/blog/post/:postId
router.get('/post/:postId', blogController.getById);

// HTTP Method + validasi [PUT] by ID : /v1/blog/post/:postId
router.put('/post/:postId', [
  body('title')
    .isLength({ min: 5 })
    .withMessage('input title tidak sesuai'),
  body('body')
    .isLength({ min: 5 })
    .withMessage('input body tidak sesuai')],
  blogController.update);

// HTTP Method [DELETE] by ID : /v1/blog/post/:postId
router.delete('/post/:postId', blogController.delete);


// Export router
module.exports = router;