var express = require('express');
var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://localhost:4321/myVegAppDb');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type:String,required:true},
	password: {type:String,required:true},
	tipology:{type:String,required:true},
	firstName:{type:String,required:true},
	lastName:{type:String,required:true},
	email:{type:String,required:true},
});

var User = mongoose.model('User',userSchema)


app.get('/', function (req, res) {
  User.find({},function(err,users){})
	if(err) throw error;
	return users.toString();
	
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});