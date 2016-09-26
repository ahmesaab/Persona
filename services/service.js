/**
 * Created by Saab on 9/11/2016.
 */

var db = require('./../models/persistence/dbconnector.js');

module.exports = {

    // MY COMMENT

    //Description: Get all users from the database.
    //Params: function to call when finished.
    //Callback Params :
    //  - err: error object or null if no errors
    //  - users: array of user objects defined in /models/User.js
    getAllUsers: function(callback)
    {
       db.get(function(err,connection)
       {
           if(err)
           {
               callback(err,null);
           }
           else
           {
               connection.query("SELECT * FROM Users",function(err,rows)
               {
                   if(err)
                       callback(err,null);
                   else
                   {
                       var users = [];
                       for(var i=0;i<rows.length;i++)
                       {
                           var row = rows[i];
                           var user = {
                               id : row.id,
                               name : row.first_name+' '+row.last_name
                           };
                           users.push(user);
                       }
                       callback(err,users);
                   }
               });
           }
       });
    },

    //Description: Get all quizzes of a specific user
    //Params: function to call when finished.
    //Callback Params :
    //  - err: error object or null if no errors
    //  - quizzes: array of quiz objects defined in /models/quiz.js
    getAllQuizOfUser: function(userId,callback)
    {
        db.get(function ( err, connection){
            if (err){
                callback(err, null);
            }else{
                connection.query("SELECT * FROM Quizzes WHERE owner_user_id = "+userId, function(err, rows){
                    if(err){
                        callback(err,null);
                    }else{
                        var quizzes = rows;
                        callback(err,quizzes);
                    }
                })
            }
        })
    },

    //Description: Get required data for Quizzes area in profile view
    //Params: function to call when finished.
    //Callback Params :
    //  - err: error object or null if no errors
    // - TODO: replace this line with a description of the returned data
    getProfileViewDataComposite: function(userId,callback)
    {},

    //Description: Get required data for Quizzes area in profile view
    //Params: function to call when finished.
    //Callback Params :
    //  - err: error object or null if no errors
    // - TODO: replace this line with a description of the returned data
    getProfileViewDataSeparate: function(userId,callback)
    {}
};