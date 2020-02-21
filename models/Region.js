const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Region = new Schema({
  _id: ObjectId,
  name: String,
  description: String,
  country: String
});

mongoose.model('Region', Region);

module.exports = Region;