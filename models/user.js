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
    var newUser = this;
    db.get(function(err, connection){
        if(err)
        {
            callback(err);
        }
        else
        {

            connection.query('INSERT INTO Users (first_name, last_name, facebook_id, twitter_id, ' +
                'google_id, user_name, password ) values (?,?,?,?,?,?,?)',[newUser.firstName, newUser.lastName,
                    newUser.facebookId, newUser.twitterId, newUser.googleId, newUser.userName, newUser.password],
                function(err, res)
                {
                    if(err)
                    {
                        callback(err);
                    }
                    else
                    {
                        newUser.id = res.insertId;
                        callback(null);
                    }
                })
        }
    });
};

module.exports = user;