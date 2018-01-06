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
//API to add a product
router.post('/add-product',auth.checkUser,function(req,res,next){
	var product=new Product();
	product.category=req.body.id;
	product.name=req.body.name;
	product.price=parseInt(req.body.price);
	product.image=req.body.image;
	product.description=req.body.description;
	product.save(function(error,newProduct){
		if(error) return next(error);
		req.flash('success','Successfully added a product');
		return res.redirect('/add-product');
	});
});

router.get('/edit-product',auth.checkUser,function(req,res,next){
	res.render('admin/edit-product',{message:req.flash('success')});
});


//API to edit a product
router.post('/edit-product',auth.checkUser, function(req, res, next){

    var obj = req.body;
    var id = req.body.id;

    Product.update({_id: id}, obj, {upsert: true}, function(err, Product){
        if(err)
        	return next(err);
        req.flash('success','Successfully deleted a product');
        res.redirect('/edit-product');
    });

});

router.get('/delete-product',auth.checkUser,function(req,res,next){
	res.render('admin/delete-product',{message:req.flash('success')});
});

//API to delete a particular product
	router.post('/delete-product',auth.checkUser,function(req,res,next){
		console.log("came here");
		console.log(req.body.id);
		Product.remove({_id:req.body.id},function(err,deletedProduct){
			console.log("db deleted",deletedProduct);
			if(err){
				req.flash('success','Product is not available')
				return res.redirect('/delete-product');;
			}
			/*if(deletedProduct===undefined){
				console.log("mama mia")
				req.flash('success','Product is not available')
				return res.redirect('/delete-product');
			}*/
			else{
				req.flash('success','Successfully deleted a product');
				return res.redirect('/delete-product');
			}
		});
	});




module.exports=router;