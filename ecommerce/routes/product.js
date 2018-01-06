var router=require('express').Router();
var Product=require('../models/product');

router.get('/',function(req,res){
	res.render('main/home');
});


router.post('/product/:id',function(req,res,next){
	Cart.findOne({owner:req.user._id},function(error,cart){
		cart.items.push({
			item:req.params.id,
			price:parseFloat(req.body.price),
			quantity:parseInt(req.body.quantity)
		});
		cart.total=(cart.total+parseFloat(req.body.price)).toFixed(2);
		cart.save(function(error){
			if(error) return next(error);
			return res.redirect('/cart');
		});
	});
});


router.get('/products/:id',function(req,res,next){
	Product
	.find({category:req.params.id})
	.populate('category')
	.exec(function(error,products){
		if(error) return next(error);
		res.render('main/category',{
			products:products
		});
	});
});

router.get('/products',function(req,res,next){
	Product
	.find({})
	.populate('category')
	.exec(function(error,products){
		if(error) return next(error);
		res.render('main/category',{
			products:products
		});
	});
});


router.get('/product/:id',function(req,res,next){
	Product.findById({_id:req.params.id},function(error,product){
		if(error) return next(error);
		res.render('main/product',{
			product:product
		});
	});
});

module.exports=router;