const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
  original: String,
  short: String,
});

module.exports = mongoose.model('Url', UrlSchema);
