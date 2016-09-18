/**
 * Created by Saab on 9/18/2016.
 */

var quiz = function(id,name){
    this.id = id;
    this.name = name;
};

quiz.prototype.sayHello = function() {
    console.loge(this.id);
    console.log("Hello, I'm " + this.firstName);
};

//

var myQuiz = new quiz();
var myQuiz2 = new quiz(2,'samer');