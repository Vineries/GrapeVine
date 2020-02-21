var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    res.send('respond with a resource');
});
/* GET users listing. */
router.put('/:id', function(req, res, next) {
    res.send('respond with a resource');
});
/* GET users listing. */
router.get('/list', function(req, res, next) {
    res.send('respond with a resource');
});
/* GET users listing. */
router.post('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;