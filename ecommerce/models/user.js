var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	email:{type:String , unique:true , lowercase:true},
	password:String,
	name:{type:String , default:''},
	date:{type:Date,default:Date.now()}
});
module.exports=mongoose.model('User',UserSchema);