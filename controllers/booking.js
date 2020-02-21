const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

const mongoose = require("mongoose");
const Booking = mongoose.model("Booking");

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    Booking.aggregate([
        {
            $group: {
                _id: "$wineryID",
                bookings: {
                    $push: "$$ROOT"
                }
            }
        }
    ]).then(booking => {
        res.end(JSON.stringify(booking));
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

router.get('/all', function (req, res, next) {
    Booking.find({}).then(booking => {
        res.end(JSON.stringify(booking));
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    })
});

router.post('/new', function (req, res, next) {
    var _id = new ObjectID();
    var booking = new Booking();

    var bookingDate = req.query.bookingDate || req.body.bookingDate;
    var guestCount = req.query.guestCount || req.body.guestCount;
    var specialInstructions = req.query.specialInstructions || req.body.specialInstructions;
    var wineryID = req.query.wineryID || req.body.wineryID;
    var accountID = req.query.accountID || req.body.accountID;

    if (!bookingDate || !guestCount || !specialInstructions) {
        res.sendStatus(500);
    }

    booking._id = _id;
    booking.bookingDate = bookingDate;
    booking.guestCount = guestCount;
    booking.specialInstructions = specialInstructions;

    booking.accountID = accountID;
    booking.wineryID = wineryID;

    booking.createdOn = Date.now();
    booking.lastModified = Date.now();

    booking.save(function (err, product) {
        if (err) {
            console.error(err)
            res.send(err);
        } else {
            res.end(JSON.stringify(_id));
        }
    })
});

module.exports = router;
