// Node module
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Membuat skema collection (model) dalam database
const BlogPost = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  author: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

// export model
module.exports = mongoose.model('BlogPost', BlogPost);