var express = require('express');
var router = express.Router();
var service = require('../services/service.js');

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: '7amada' });
});

// Get the Users from database as JSON Array
router.get('/getAllUsers', function(req, res) {

    service.getAllUsers(function(err,users)
    {
        if(err)
        {
            console.log("Error: "+err.message);
            res.sendStatus(500);
        }
        else
            res.send(users);
    });

});

// Get the Quizzes of a User from database as Quiz Array
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
