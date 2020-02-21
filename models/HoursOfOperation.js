const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Booking = new Schema({
    _id: ObjectId,
    date: Date,
    wineryID: String,
    createdOn: Date,
    lastModified: Date,
    bookingDate: Date,
    guestCount: Number,
    specialInstructions: String
});

mongoose.model('Booking', Booking);

module.exports = Booking;