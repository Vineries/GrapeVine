const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Wine = require("./Wine")
const PointSchema = require("./PointSchema")

const Winery = new Schema({
    _id: ObjectId,
    name: String,
    phone: [String],
    email: String,
    website: String,
    menu: Boolean,
    reservations: Boolean,
    address1: String,
    address2: String,
    country: String,
    province: String,
    postal: String,
    region: String,
    thumbnail: String,
    photos: [String],
    pending: Boolean,
    location: {
        type: PointSchema
    },
    wines: [String]
});

mongoose.model('Winery', Winery);