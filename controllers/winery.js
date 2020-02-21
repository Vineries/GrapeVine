const express = require('express');
const router = express.Router();

const ObjectID = require('mongodb').ObjectID;

const mongoose = require("mongoose");
const Winery = mongoose.model("Winery")
const Wine = mongoose.model("Wine")
const PointSchema = mongoose.model("PointSchema");
const Region = mongoose.model("Region")
const aws = require('aws-sdk');

const { Storage } = require('@google-cloud/storage');

const HTTPSuccessHelper = require('../helpers/HTTPSuccessHelper');
const HTTPErrorHelper = require('../helpers/HTTPErrorHelper');

const phone = require("phone")

aws.config.getCredentials(function(err) {
    if (err) {
        console.log(err.stack); // credentials not loaded
    } else {
        console.log("AWS auth success");
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/* List all wineries. */
router.get('/all', function(req, res, next) {
    var limit = parseInt(req.query.limit) || 0;
    var skip = parseInt(req.query.skip) || 0;
    var pretty = req.query.pretty || false;

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    try {
        Winery.find({}).skip(skip).limit(limit).then((wineries) => {
            sleep(2000).then(x => {
                if (pretty)
                    res.end(JSON.stringify(wineries, false, 4))
                else
                    res.end(JSON.stringify(wineries))
            });
        })
    } catch (err) {
        console.log(err);
        res.end(500);
    }
});

/* List all wineries. */
router.get('/count', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    try {
        res.send(JSON.stringify({ wineries: 10, regions: 16 }));
    } catch (err) {
        console.log(err);
        res.end(500);
    }
});

/* List all wineries. */
router.get('/pending', function(req, res, next) {
    var limit = parseInt(req.query.limit) || 0;
    var skip = parseInt(req.query.skip) || 0;
    var pretty = req.query.pretty || false;
    try {
        Winery.find({}).skip(skip).limit(limit).then((wineries) => {
            if (pretty)
                res.end(JSON.stringify(wineries, false, 4))
            else
                res.end(JSON.stringify(wineries))
        })
    } catch (err) {
        console.log(err);
        res.end(500);
    }
});


/* GET home page. */
router.get('/:id', function(req, res, next) {
    Winery.find({ _id: new ObjectID(req.params.id) }).then((winery) => {
        if (req.query.pretty !== undefined)
            if (req.query.pretty.toLowerCase() === "true")
                res.end(JSON.stringify(winery, null, 4));
            else
                res.end(JSON.stringify(winery));
        else
            res.end(JSON.stringify(winery));
    });
});

/* Insert new Winery. */
router.post('/new', function(req, res, next) {
    const _Position = new PointSchema();
    _Position.type = "Point";
    _Position.coordinates = [req.body.lng, req.body.lat]

    _Position.save((err) => {
        console.log(err);
    });

    const _winery = new Winery();
    _winery._id = new ObjectID();
    _winery.name = req.body["name"];
    _winery.email = req.body["email"];
    _winery.phone = phone(req.body["phone"]);
    _winery.website = req.body["website"];
    _winery.reservations = req.body["reservations"];
    _winery.menu = req.body["menu"];

    _winery.region = req.body["region"];
    _winery.address1 = req.body["address1"];
    _winery.address2 = req.body["address2"];
    _winery.country = req.body["country"];
    _winery.province = req.body["province"];
    _winery.postal = req.body["postal"];

    _winery.photos = req.body["photos"];
    _winery.thumbnail = req.body["thumbnail"];
    _winery.location = _Position

    _winery.save().then(x => {
        console.log(_winery._id);
        res.end(JSON.stringify(_winery));
    }).catch(err => {
        console.error(err);
    })
});

router.put('/verify/:id', function(req, res, next) {
    // TODO: authenticate
    if (false) {
        res.sendStatus(403)
    }

    const _id = req.params.id;
    if (_id == undefined) {
        res.sendStatus(500)
        res.end();
    };
    Winery.findById(_id).exec((err, doc) => {
        if (err) throw err;
        doc.pending = false;
        doc.save();
        res.end(JSON.stringify(_id))
    });
});

/* Update winery. */
router.put('/update/:id', function(req, res, next) {
    // TODO: authenticate
    if (false) {
        res.sendStatus(403)
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const _id = req.params.id;
    if (_id == undefined) {
        res.sendStatus(500)
        res.end();
    }

    var Name = req.body["name"]
    var Address = req.body["address"]
    var Phone = req.body["phone"] || "+1 000-000-0000"
    var Email = req.body["email"]
    var Website = req.body["website"]
    var Country = req.body["country"]
    var AcceptsReservations = req.body["reservations"]
    var HasMenu = req.body["menu"]
    var Thumbnail = req.body["thumbnail"]

    Winery.findById(_id).exec((err, doc) => {
        if (err) throw err
        doc.name = Name || doc.name;
        doc.address = Address || doc.address;
        doc.phone = phone(Phone) || doc.phone;
        doc.email = Email || doc.email;
        doc.website = Website || doc.website;
        doc.country = Country || doc.country;
        doc.reservations = AcceptsReservations || doc.reservations;
        doc.menu = HasMenu || doc.menu;
        doc.thumbnail = Thumbnail || doc.thumbnail;

        doc.save();
        res.end(JSON.stringify(_id))
    })
});

/* DELETE winery. */
router.delete('/delete/:id', function(req, res, next) {
    // TODO: authenticate
    if (false) {
        res.sendStatus(403)
    }

    const _id = req.params.id;
    if (_id == undefined) {
        res.sendStatus(500)
        res.end();
    }

    Winery.findByIdAndDelete(_id).exec((err, gg) => {
        if (err) res.render("error")
        else res.send(JSON.stringify(gg))
    })
});

router.put('/addPhoto/:id', function(req, res, next) {
    const { id, photo } = req.params;

    if (!id || !photo) {
        res.end(HTTPErrorHelper('url_params_missing', "\'photoid\' is missing."));
    } else {
        Winery.findById(id).exec((err, winery) => {
            if (err) {
                res.end(HTTPErrorHelper('mongoose_error', err));
            }
            winery.photos.push(photo);
            winery.save().then(winery_id => {
                res.end(HTTPSuccessHelper(winery_id));
            }).catch(err => {
                res.end(HTTPErrorHelper('mongoose_error', err));
            })
        })

    }
})

router.get('/photo/:photoid', function(req, res, next) {
    var s3 = new aws.S3();
    const photoid = req.params.photoid;

    if (!photoid) {
        res.end(HTTPErrorHelper('url_params_missing', "\'photoid\' is missing."));
    } else {
        const getObjectRequest = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: photoid
        }

        s3.getObject(getObjectRequest, (err, data) => {
            var mimetype = 'image/png'
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.writeHead(200, {
                    'Content-Type': mimetype,
                    'Content-disposition': 'attachment;filename=' + photoid,
                    'Content-Length': data.Body.length
                });
                res.end(Buffer.from(data.Body, 'binary'));
            }
        });
    }
})

router.put('/addWine/:id/:wine', function(req, res, next) {
    const { id, wine } = req.params;

    if (!id || !wine) {
        res.end(HTTPErrorHelper('url_params_missing', "One or more parameters are missing."));
    } else {
        Wine.count({ _id: wine }, function(err, count) {
            if (count > 0) {
                Winery.findById(id).exec((err, winery) => {
                    var tempWinesArray = winery.wines;
                    tempWinesArray.push(wine);
                    winery.wines = tempWinesArray;
                    winery.save().then(winery_id => {
                        res.end(HTTPSuccessHelper(winery_id));
                    }).catch(err => {
                        res.end(HTTPErrorHelper('mongoose_error', err));
                    })
                })
            } else {
                res.end(HTTPErrorHelper('mongoose_error', err));
            }
        });
    }
})

router.put('/removeWine/:id/:wine', function(req, res, next) {
    const { id, wine } = req.params;

    if (!id || !wine) {
        res.end(HTTPErrorHelper('url_params_missing', "One or more parameters are missing."));
    } else {
        Wine.findById(wine).exec((err, _wine) => {
            if (err) {
                res.end(HTTPErrorHelper('mongoose_error', err));
            }
            Winery.findById(id).exec((err, doc) => {
                if (err) {
                    res.end(HTTPErrorHelper('mongoose_error', err));
                }
                doc.wines.push(_wine);
                doc.save().then(winery_saved => {
                    res.end(HTTPSuccessHelper(winery_saved));
                }).catch(err => {
                    res.end(HTTPErrorHelper('mongoose_error', err));
                })
            })
        })
    }

})

router.post('/search', function(req, res, next) {
    const { date, center, guests, bounds } = req.body;
    if (!date || !guests && (!bounds || !center)) {
        res.end(HTTPErrorHelper('url_params_missing', "One or more parameters are missing."));
    } else {
        if (!bounds) {
            Winery.find({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [center.lng, center.lat] },
                        $maxDistance: 2500
                    }
                }
            }).then(winery => {
                res.end(HTTPSuccessHelper(winery));
            }).catch(err => {
                res.end(HTTPErrorHelper('mongoose_error', err));
            })
        } else {
            const mapBounds = {
                type: 'Polygon',
                coordinates: [
                    [
                        [bounds.west, bounds.north],
                        [bounds.east, bounds.north],
                        [bounds.east, bounds.south],
                        [bounds.west, bounds.south],
                        [bounds.west, bounds.north],
                    ]
                ]
            };
            Winery.find({
                location: {
                    $geoWithin: {
                        $geometry: mapBounds
                    }
                }
            }).then(winery => {
                res.end(HTTPSuccessHelper(winery));
            }).catch(err => {
                res.end(HTTPErrorHelper('mongoose_error', err));
            })

        }
    }
})


router.post('/searchOne', function(req, res, next) {
    if (false) res.sendStatus(403);
    const { date, guests, wineryId } = req.body;
    if (!date || !guests || !wineryId) {
        res.end(HTTPErrorHelper('url_params_missing', "One or more parameters are missing."));
    } else {
        HTTPSuccessHelper();
    }
})

module.exports = router;