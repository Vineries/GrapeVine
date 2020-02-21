const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const mongoose = require("mongoose");
const Wine = mongoose.model("Wine");

const phone = require("phone")

/* List all wines. */
router.get('/all', function(req, res, next) {
    var limit = parseInt(req.query.limit) || 0;
    var skip = parseInt(req.query.skip) || 0;
    var pretty = req.query.pretty || false;
    try {
        Wine.find({}).skip(skip).limit(limit).then((wines) => {
            if (pretty)
                res.end(JSON.stringify(wines, false, 4))
            else
                res.end(JSON.stringify(wines))
        })
    } catch (err) {
        console.log(err);
        res.end(500);
    }
});

/* GET users listing. */
router.post('/new', function(req, res, next) {
    var _id = new ObjectID();
    var name = req.body.name;
    var description = req.body.description;
    var category = req.body.category;
    var photos = req.body.photos;
    var thumbnail = req.body.thumbnail;

    var w = new Wine();
    w._id = _id;
    w.name = name;
    w.description = description;
    w.category = category;
    w.photos = photos;
    w.thumbnail = thumbnail;
    w.save(function(err, product) {
        if (err) res.sendStatus(500);
        res.end(JSON.stringify(_id));
    })
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    var _id = new ObjectID(req.params.id);
    Wine.findById(req.params.id).exec()
        .then(wine => {
            res.end(JSON.stringify(wine));
        })
        .catch(err => {
            res.end(JSON.stringify(err));
        })

});

module.exports = router;