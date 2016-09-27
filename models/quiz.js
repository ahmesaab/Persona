/**
 * Created by Saab on 9/18/2016.
 */

var Quiz = function(id,name){
    this.id = id;
    this.name = name;
};

Quiz.prototype.sayHello = function() {
    console.loge(this.id);
    console.log("Hello, I'm " + this.firstName);
};

module.exports = Quiz;