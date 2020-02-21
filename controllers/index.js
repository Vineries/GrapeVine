const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const mongoose = require("mongoose");
const Wine = mongoose.model("Wine");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/handshake', function(req, res, next) {
    res.send(200);
});

module.exports = router;