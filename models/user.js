/**
 * Created by Saab on 9/18/2016.
 */

var db = require('../models/persistence/dbconnector.js');

var User = function(params){
    this.id = params.id;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.facebookId = params.facebookId;
    this.twitterId = params.twitterId;
    this.googleId = params.googleId;
    this.userName = params.userName;
    this.password = params.password;
};

User.prototype.save = function(callback){
    var self = this;
    db.get(function(err, connection)
    {
        if(err)
        {
            callback(err);
        }
        else
        {
            connection.query('INSERT INTO Users (first_name, last_name, facebook_id, twitter_id, ' +
                'google_id, user_name, password ) values (?,?,?,?,?,?,?)',[self.firstName, self.lastName,
                    self.facebookId, self.twitterId, self.googleId, self.userName, self.password],
                function(err, res)
                {
                    if(err)
                    {
                        callback(err);
                    }
                    else
                    {
                        self.id = res.insertId;
                        callback(null);
                    }
                })
        }
    });
};

module.exports = User;