const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Wine = new Schema({
  _id: ObjectId,
  name: String,
  description: String,
  photos: [String],
  thumbnail: String,
  category: {
      type: String,
      enum: ["White", "Red", "Rose", "Sparkling", "Champagne", "Ice", "Mulled"]
  }
});

mongoose.model('Wine', Wine);

module.exports = Wine;