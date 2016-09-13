var express = require('express');
var router = express.Router();
var service = require('../services/service.js');

/* GET users listing. */
router.get('/', function(req, res, next) {

    // Get the Users from database
    // and save it in users

    service.getAllUsers(function(data)
    {
       var users = [];
       res.send(users);
    });

});

module.exports = router;
