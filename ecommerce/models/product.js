var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ProductSchema=new Schema({
	category:{type:Schema.Types.ObjectId, ref:'Category'},
	name: {type: String, default: ''},
	price: {type: Number, default: 0},
	image:String,
	description: {type: String, default: ''},
	qty: {type: Number, default: 1}
});

module.exports=mongoose.model('Product',ProductSchema);