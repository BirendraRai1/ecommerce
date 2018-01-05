var router=require('express').Router();
var async=require('async');
var faker=require('faker');
var Product=require('../models/product');
var Category=require('../models/category');


router.get('/:name',function(req,res,next){
	async.waterfall([
		function(callback)
		{
			Category.findOne({name:req.params.name},function(error,category){
				if(error) return next(error);
				callback(null,category);
			});
		},
		function(category,callback)
		{
			for(var i=1;i<=30;i++)
			{
				var product=new Product();
				product.category=category._id;
				product.name=faker.commerce.productName();
				product.price=faker.commerce.price();
				product.image=faker.image.image();
				product.save();
			}
		}
	]);
	res.json({message:'success'});
});

module.exports=router;