var service = require('../services/service.js');
var express = require('express');
var router = express.Router();

// Get the Users from database as JSON Array
router.get('/', function(req, res) {

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

module.exports = router;
