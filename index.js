// Core module
const path = require('path');

// Node module
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

// Jalankan function express()
const app = express();

// Routes
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

// image
const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// Gunakan middleware
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// Setting untuk cross origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

// Standar API
app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

// Standart Error Status
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
})

// Koneksi ke mongo db
mongoose.connect('mongodb://localhost:27017/mernapi', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Port
    app.listen(4000, () => console.log('conection success'));
  })
  .catch(err => console.log(err));
