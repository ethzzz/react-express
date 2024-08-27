var express = require('express');
var router = express.Router();
/* GET home page. */
exports.index =function(req:any, res:any, next:any) {
  res.render('index', { title: 'Express' });
}

exports.getKey = (req:any, res:any) => {
}

module.exports = router;
