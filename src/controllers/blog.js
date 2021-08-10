// Core module
const path = require('path');
const fs = require('fs');

// Node module
const { validationResult } = require('express-validator');

// local module
const BlogPost = require('../models/blog');

// Controller: Blog --> method: create
exports.create = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid Value Tidak Sesuai');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error('Image harus di upload');
    err.errorStatus = 422;
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;

  const Posting = new BlogPost({
    title: title,
    body: body,
    image: image,
    author: { uid: 1, name: 'azami' }
  })

  Posting.save()
    .then(result => {
      res.status(200).json({
        message: "Create Blog Post Succsess",
        data: result
      });
    })
    .catch(err => {
      console.log('err: ', err);
    });
}

// Controller: Blog --> method: getAll
/* 
exports.getAll = (req, res, next) => {
  BlogPost.find()
    .then(result => {
      res.status(200).json({
        message: 'Data Blog Post Berhasil dimuat',
        data: result
      })
    })
    .catch(err => {
      next(err)
    });
}
 */

// Controller: Blog --> method: getLimit
exports.getLimit = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  let totalData;

  BlogPost.find()
    .countDocuments()
    .then(count => {
      totalData = count;

      return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then(result => {
      res.status(200).json({
        message: 'Data Blog Post Berhasil dimuat',
        data: result,
        total_data: totalData,
        per_page: parseInt(perPage),
        current_page: parseInt(currentPage)
      })
    })
    .catch(err => {
      next(err)
    });
}

// Controller: Blog --> method: getById
exports.getById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then(result => {
      if (!result) {
        const err = new Error('Blog Post tidak ditemukan');
        err.errorStatus = 404;
        throw err;
      }
      res.status(200).json({
        message: 'Data berhasil diambil',
        data: result
      })
    })
    .catch(err => {
      next(err);
    })
}

// Controller: Blog --> method: update
exports.update = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid Value Tidak Sesuai');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error('Image harus di upload');
    err.errorStatus = 422;
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then(post => {
      if (!post) {
        const err = new Error('Blog Post tidak ditemukan');
        error.errorStatus = 404;
        throw err;
      }

      post.title = title;
      post.body = body;
      post.image = image;

      return post.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Data berhasil diupdate.',
        data: result
      })
    })
    .catch(err => {
      next(err);
    })

}

// Controller: Blog --> method: delete
exports.delete = (req, res, next) => {
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then(post => {
      if (!post) {
        const err = new Error('Blog Post tidak ditemukan.');
        err.errorStatus = 404;
        throw err;
      }

      // hapus dulu image-nya
      removeImage(post.image);

      // hapus blog post-nya
      return BlogPost.findByIdAndRemove(postId);
    })
    .then(result => {
      res.status(200).json({
        message: 'Hapus blog post berhasil',
        data: result
      })
    })
    .catch(err => {
      next(err);
    })
}

// function untuk menghapus image;
const removeImage = (filePath) => {
  /* 
  console.log('filePath: ', filePath);
  console.log('dirname: ', __dirname);
 */

  // temukan lokasi image
  filePath = path.join(__dirname, '../..', filePath);

  // Setelah lokasi ditemukan, hapus image.
  fs.unlink(filePath, err => console.log(err));
}