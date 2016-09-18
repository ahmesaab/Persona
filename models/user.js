/**
 * Created by Saab on 9/18/2016.
 */
var db = require('../database/db.js');


var user = function(id, firstName, lastName, facebookId, twitterId, googleId, userName, password){
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.facebookId = facebookId;
    this.twitterId = twitterId;
    this.googleId = googleId;
    this.userName = userName;
    this.password = password;
};

user.prototype.save = function(callback){
    db.get(function(err, connection){
        if(err)
        {
            callback(err);
        }
        else
        {
            connection.query('INSERT INTO Users (first_name, last_name, facebook_id, twitter_id, ' +
                'google_id, user_name, password ) values (?,?,?,?,?,?,?)',[this.firstName, this.lastName,
                this.facebookId, this.twitterId, this.googleId, this.userName, this.password],
                function(err, res)
                {
                    if(err)
                    {
                        callback(err);
                    }
                    else
                    {
                        this.id = res.insertId;
                        callback(null);
                    }
                })
        }
    });
};

module.exports = user;