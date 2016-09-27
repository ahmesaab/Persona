var express = require('express');
var router = express.Router();
var service = require('../services/service.js');

var User = require('../models/user.js');

// GET home page
router.get('/', function(req, res) {
  res.render('index', { title: '7amada' });
});

// Get the Users from database as JSON Array
router.get('/users', function(req, res) {

    service.getAllUsers(function(err,users)
    {
        if(err)
        {
            console.log("Error: "+err.message);
            res.sendStatus(500);
        }
        else
            res.render('users-view',{users:users});
    });

});

// Get the Quizzes of a User from database as Quiz Array
router.get('/getUserQuizzes', function(req, res) {

    service.getAllQuizOfUser(req.query.id,function(err, quizzes)
    {
        if(err)
        {
            console.log(err);
            res.sendStatus(500);
        }
        else
        {
            res.send(quizzes);
        }
    });

});

// Get signUp page
router.get('/signUp', function(req, res, next) {
    res.render('sign-up-view');
});

// Post signUp page
router.post('/signUp', function(req, res, next) {

    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName
    });

    newUser.save(function(err) {
        if(err)
        {
            console.log(err);
            res.send("Failed to create User");
        }
        else
            res.send("User was created and has ID of "+newUser.id);
    });

});

// Mokhtar's Controller
router.get('/doStuffComposite', function(req, res) {
    console.time("composite");
    service.getProfileViewDataComposite(req.query.id,function (err,data)
    {
        console.timeEnd("composite");
        if(err)
        {
            console.log(err);
            res.sendStatus(500);
        }
        else
        {
            res.render("profile-composite-info-box",{rows:data});
        }
    })

});

// TODO: Samer's Controller
router.get('/doStuffSeparate', function(req, res) {
    console.time("separate");
    service.getProfileViewDataSeparate(req.query.id, function(err, output) {
        console.timeEnd("separate");
        if(err){
            console.log(err);
        }else{
            res.send(output);
        }
    })

});

module.exports = router;
