var express = require('express');
var router = express.Router();
var service = require('../services/service.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '7amada' });
});

router.get('/getUserQuizzes', function(req, res, next) {
  service.getAllQuizOfUser(req.query.id,function(err, quizzes){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      res.send(quizzes);
    }
  });
});

module.exports = router;
