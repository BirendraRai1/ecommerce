var router=require('express').Router();
var Category=require('../models/category');
var Product=require('../models/product');
var User=require('../models/user');
var faker=require('faker');
var auth=require('../middleware/auth')
router.get('/add-category',auth.checkUser,function(req,res,next){
	res.render('admin/add-category',{message:req.flash('success')});
});

router.post('/add-category',auth.checkUser,function(req,res,next){
	var category=new Category();
	category.name=req.body.name;

	category.save(function(error){
		if(error) return next(error);
		req.flash('success','Successfully added a category');
		return res.redirect('/add-category');
	});
});

router.get('/add-product',auth.checkUser,function(req,res,next){
	res.render('admin/add-product',{message:req.flash('success')});
});

router.post('/add-product',auth.checkUser,function(req,res,next){
	var product=new Product();
	product.category=req.body.id;
	product.name=req.body.name;
	product.price=parseInt(req.body.price);
	product.image=req.body.image;
	product.save(function(error,newProduct){
		if(error) return next(error);
		req.flash('success','Successfully added a product');
		return res.redirect('/add-product');
	});
});

router.get('/delete-product',auth.checkUser,function(req,res,next){
	res.render('admin/delete-product',{message:req.flash('success')});
});

//API to delete a particular product
	router.post('/delete-product',auth.checkUser,function(req,res){
		Product.remove({_id:req.params.id},function(err,deletedProduct){
			if(err){
				res.send(err);
			}
			else{
				res.send(deletedProduct);
			}
		});
	});




module.exports=router;