/**
 * Created by Saab on 9/11/2016.
 */

var db = require('./../models/persistence/dbconnector.js');
var async = require('async');

function reformatForNow(array)
{
    var result = {};
    for(var i=0;i<array.length;i++)
    {
        result[array[i].id] = {name:array[i].name};
    }
    return result;
}

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
    //  - data: { quizzes: [ {id:{name,numOfQuestions,solved,highestScore}} ] }
    getProfileViewDataSeparate: function(userId,callback)
    {
        db.get(function (err, connection)
        {
            if (err) {
                callback(err, null);
            }
            else
            {
                connection.query("select id,name from Quizzes where owner_user_id ="+userId,
                    function(err, rows)
                    {
                        if(err) {
                            callback(err,null);
                        }
                        else
                        {
                            if(rows.length==0)
                                callback(err,{});
                            var quizzes = reformatForNow(rows);
                            var sum = 0;
                            for (var quizId in quizzes)
                            {
                                (function(id){
                                    connection.query("select count(*) as count from Questions where quiz_id=?",[id],
                                        function(err, rows)
                                        {
                                                if(err){
                                                    callback(err,null);
                                                }else {
                                                    quizzes[id].numberOfQuestions = rows[0].count;
                                                    done();
                                                }
                                        })
                                })(quizId);

                                (function(id){
                                    connection.query("select count(*) as solved, MAX(score) as maxScore " +
                                        "from UserQuizSolution where quiz_id=?",[id],
                                        function(err, rows)
                                        {
                                            if(err){
                                                callback(err,null);
                                            }else{
                                                quizzes[id].solved = rows[0].solved;
                                                quizzes[id].maxScore = rows[0].maxScore;
                                                done();
                                            }
                                        });
                                })(quizId);

                                (function(id){
                                    var queryString = ' select first_name as firstName, last_name as lastName from ' +
                                        'Users where id = (select user_id from UserQuizSolution where score = '+
                                        '(select MAX(score) from UserQuizSolution where quiz_id= ?) LIMIT 1)';
                                    connection.query(queryString,[id],
                                        function(err, rows)
                                        {
                                            if(err){
                                                callback(err,null);
                                            }else{
                                                if (rows.length==0)
                                                {
                                                    quizzes[id].firstName = null;
                                                    quizzes[id].lastName = null;
                                                }
                                                else
                                                {
                                                    quizzes[id].firstName = rows[0].firstName;
                                                    quizzes[id].lastName = rows[0].lastName;
                                                }
                                                done();
                                            }
                                        });
                                })(quizId);



                                function done()
                                {
                                    sum++;
                                    if(sum == rows.length*3)
                                    {
                                        callback(err,quizzes);
                                    }
                                }
                            }

                        }
                    });
            }
        });
    }
};