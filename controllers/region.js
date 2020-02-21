const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
const Region = mongoose.model('Region');
const ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/all', function(req, res, next) {
    var limit = parseInt(req.query.limit) || 0;
    var skip = parseInt(req.query.skip) || 0;
    var pretty = req.query.pretty || false;
    try {
        Region.find({}).skip(skip).limit(limit).then((wines) => {
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
router.get('/:id', function(req, res, next) {
    const _id = req.params.id;
    if (_id == undefined) {
        res.sendStatus(500)
        res.end();
    };

    Region.findById(_id).then(x => {
        res.send(JSON.stringify(x));
    }).catch(err => {
        res.send(JSON.stringify(err));
    })
});

/* GET users listing. */
router.post('/new', function(req, res, next) {
    const _Region = new Region();
    _Region._id = new ObjectID();
    _Region.name = req.body.name;
    _Region.description = req.body.description;
    _Region.country = req.body.country;

    _Region.save((err) => {
        if (err) res.sendStatus(500);
        else res.end(JSON.stringify(_Region));
    });
    res.send('respond with a resource');
});

/* GET users listing. */
router.put('/update/:id', function(req, res, next) {
    res.send('respond with a resource');
});

/* GET users listing. */
router.delete('/delete/:id', function(req, res, next) {
    const _id = req.params.id;
    if (_id == undefined) {
        res.sendStatus(500)
        res.end();
    };
    Region.findByIdAndDelete(_id).then(x => {
        res.send(_id);
    }).catch(err => {
        res.send(JSON.stringify(err));
    })
    res.send('respond with a resource');
});
module.exports = router;