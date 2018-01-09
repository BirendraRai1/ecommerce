var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: { type: Object, required:true},
    createAt: { type: Date, default: Date.now() },
    address: { type: String, required:true},
    username: { type: String, required:true},
    mobileNumber:{type:Number,required:true},
    quantity:{type:Number,default:0},
    amount:{type:Number,default:0}
});
module.exports = mongoose.model('Order', schema);