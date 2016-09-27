/**
 * Created by Saab on 9/11/2016.
 */

var db = require('./../models/persistence/dbconnector.js');

module.exports = {

    // MY COMMENT 2

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
    {
        db.get(function(err, connection)
        {
            if(err)
            {
                callback(err,null);
            }
            else
            {
                var queryString = "SELECT distinct qz.name,qz.id,count(q.id)" +
                    " as 'questionPerQuiz',(select count(uqs.quiz_id) from " +
                    "userquizsolution uqs where qz.id = uqs.quiz_id )as " +
                    "'userSolvedQuiz',(select  max(uqs.score) from userquizsolution" +
                    " uqs where qz.id = uqs.quiz_id )as 'maxScore',(SELECT user_name " +
                    "from users where id =  (  SELECT user_id from userquizsolution " +
                    "where qz.id=userquizsolution.quiz_id order by score DESC LIMIT 1 )) " +
                    "as 'topSolver' from quizzes qz INNER JOIN questions q ON q.quiz_id = " +
                    "qz.id and qz.owner_user_id=? group by q.quiz_id";
                connection.query(queryString,[userId], function(err, rows)
                {
                    if(err)
                    {
                        callback(err,null);
                    }
                    else
                    {
                        callback(err,rows);
                    }
                });
            }

        });
    },

    //Description: Get required data for Quizzes area in profile view
    //Params: function to call when finished.
    //Callback Params :
    //  - err: error object or null if no errors
    // - TODO: replace this line with a description of the returned data
    getProfileViewDataSeparate: function(userId,callback)
    {
        db.get(function ( err, connection){
            if (err){
                callback(err, null);
            }else{
                connection.query("select name , id from Quizzes where owner_user_id ="+userId, function(err, rows){
                    if(err){
                        callback(err,null);
                    }else{
                        var out = rows;
                        console.log(out);
                        for(var i=0; i < rows.length;i++){
                            var quizId = rows[i].id;

                            connection.query("select count(*) from Questions where quiz_id =  "+quizId, function(err, rows){
                                        if(err){
                                            callback(err,null);
                                        }else{
                                            var out2 = rows;
                                            console.log(out2+" loop #"+i);
                                            callback(err,out2);
                                        }
                            });

                            connection.query(" select count(*), MAX(score) as maxScore from UserQuizSolution " +
                                        "where quiz_id = "+quizId, function(err, rows){
                                        if(err){
                                            callback(err,null);
                                        }else{
                                            var out3 = rows;
                                            console.log(out3+"  loop #"+i);
                                            callback(err,out3);
                                }
                            });
                        }

                        callback(err,out);
                    }
                });


            }
        })




    }
};