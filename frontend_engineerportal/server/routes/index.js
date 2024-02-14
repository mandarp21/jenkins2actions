var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(path.join(__dirname, '../../dist/') + 'index', { title: 'Express' });
});

module.exports = router;
