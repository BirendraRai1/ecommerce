var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CartSchema=new Schema({
	owner:{type:Schema.Types.ObjectId,ref:'User'},
	total:{type:Number,default:0},
	items:[{
		item:{type:Schema.Types.ObjectId,ref:'Product'},
		quantity:{type:Number,default:0},
		price:{type:Number,default:0},
		name:{type:String,default:''}
	}],
	totalProduct:{type:Number,default:0}
});

CartSchema.methods.reduceByOne=function(id) {
	for(var i=0;i<this.items.length;i++){
		if(this.items[i].item==id){
			console.log("this.items[i]",this.items[i]);
			this.items[i].quantity--;
	        this.items[i].price -= this.items[i].price;
	        this.totalProduct--;
	        this.total -= this.items[i].price;
	        if (this.items[i].quantity <= 0) {
	            delete this.items[i];
			}
		}
	}
};

module.exports=mongoose.model('Cart',CartSchema);