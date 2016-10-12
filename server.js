var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
mongoose.Promise = global.Promise;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var options = { promiseLibrary: require('bluebird') };

var myDbConnection = "mongodb://localhost:4321/myVegAppDb";

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type:String,required:true},
	password: {type:String,required:true},
	tipology:{type:String,required:true},
	firstName:{type:String,required:true},
	lastName:{type:String,required:true},
	email:{type:String,required:true},
});
var locationSchema = new Schema({
    coordinates:{type:Array,required:true},
    type:{type:String,required:true}
});
var menuSchema = new Schema({
    dishName:{type:String,required:true},
    price:{type:Number,required:true},
    currency:{type:String,required:true}
})
var placeSchema = new Schema(
    {
    name : {type:String,required:true},
    "type" : {type:String,required:true},
    "phoneNumber" : {type:String,required:true},
    "address" : {type:String,required:true},
    "location" : {type:locationSchema,required:true},
    "menu" : [menuSchema],
    "rating" : {type:Number},
    "totalFeed" : {type:Number}
})

var User = mongoose.model('User',userSchema)
var Places = mongoose.model('Places',placeSchema)

app.post('/login', function (req, res) {

    mongoose.connect(myDbConnection);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      // we're connected!
        User.count({username:req.body.username,password:req.body.password},function(err,count){
            mongoose.disconnect();
            return res.json({login:count});
        });
    }); 
  
});

app.get('/getPlaces',function(req,res){
     mongoose.connect(myDbConnection);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        var search = {};
		if(req.query.search!=""&&req.query.search!=undefined)
			search =   {"$or": [{name:{ "$regex": req.query.search, "$options": "i" }},{"menu.dishName":{"$regex":req.query.search,"$options":"i"}}]};
        
        Places.find(search,function(err,doc){
            mongoose.disconnect();
            return res.json(doc);
        })
     });
}); 

app.get('/find',function(req,res){
    res.send("find something here!")
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});