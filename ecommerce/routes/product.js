var router=require('express').Router();
var Product=require('../models/product');
var Cart=require('../models/cart');



router.get('/',function(req,res){
	Product
	.find({})
	.populate('category')
	.exec(function(error,products){
		if(error) return next(error);
		res.render('main/home',{
			products:products
		});
	});
});

router.post('/add-to-cart/:id',function(req,res,next){
	Cart.findOne({owner:req.user._id},function(error,cart){
		cart.items.push({
			item:req.params.id,
			price:parseFloat(req.body.price),
			quantity:parseInt(req.body.quantity)
		});
		cart.total=(cart.total+parseFloat(req.body.price*req.body.quantity));
		cart.totalProduct=cart.totalProduct+parseInt(req.body.quantity);
		cart.save(function(error){
			if(error) 
				return res.send(error);
			req.session.cart=cart;
			console.log("req.session.cart",req.session.cart)
			return res.redirect('/');
		});
	});
});

//API to get product by category
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


router.get('/cart',function(req,res,next){
	if(!req.session.cart){
		return res.render('main/cart',{products:null});
	}
	var cart = new Cart(req.session.cart);
	res.render('main/cart',{products:req.session.cart.items,totalprice:req.session.cart.total}) 
});

//API to get all products
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

//API to get a product by id
router.get('/product/:id',function(req,res,next){
	Product.findById({_id:req.params.id},function(error,product){
		if(error) return next(error);
		res.render('main/product',{
			product:product
		});
	});
});

module.exports=router;