const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name : 'dnjemi0gt',
    api_key:'139849697959833',
    api_secret: 'xBEnuk6JhxoXWti0y0nSUjsH8DM'
  })

module.exports = cloudinary;