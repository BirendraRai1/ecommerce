var router=require('express').Router();
var Product=require('../models/product');
var Cart=require('../models/cart');
var Order=require('../models/order');
var auth=require('../middleware/auth')
var mongoose=require('mongoose');

var cartModel = mongoose.model('Cart');


router.get('/',function(req,res,next){
	Product
	.find({})
	.populate('category')
	.exec(function(error,products){
		res.render('main/home',{
			products:products,user:req.session.user,session:req.session,categories:req.session.categories
		});
	});
});


/*Reduce Products Qty by One from Cart. */
router.get('/reduce/:id', function(req, res, next) {
	var productId = req.params.id;
	cartModel.findOne({owner:req.user._id},function(error,cart){
	var cartItemToBeModified = cart.items.id(productId);
	cartItemToBeModified.quantity -=1;
	cart.total -= cartItemToBeModified.price;
	cart.totalProduct -=1;
	cart.items.id(productId).remove();
	if(cartItemToBeModified.quantity>0){
		cart.items.push(cartItemToBeModified);
	}
	cart.save(function(error){
		if(error){
			res.redirect('/');
		}
		req.session.cart = cart;
		res.redirect('/cart')
	})
});
});


//API to add a product to cart
router.post('/add-to-cart/:id',auth.addToCartCheck,function(req,res,next){
	cartModel.findOne({owner:req.user._id},function(error,cart){
		cart.items.push({
			item:req.params.id,
			name:req.body.name,
			price:parseFloat(req.body.price),
			quantity:parseInt(req.body.quantity)
		});
		cart.total=(cart.total+parseFloat(req.body.price*req.body.quantity));
		cart.totalProduct=cart.totalProduct+parseInt(req.body.quantity);
		cart.save(function(error){
			if(error) 
				return res.send("<h1 style='color:red;margin-left:50px;'>Please enter the quantity of the product which you want to purchased</h1>");
			req.session.cart=cart;
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
			products:products,
			user:req.user,
			session:req.session,
			categories:req.session.categories
		});
	});
});

//API to get a cart
router.get('/cart',function(req,res,next){
	if(!req.session.cart){
		res.render('main/cart',{products:null,user:req.session.user,session:req.session,categories:req.session.categories});
	}
	//var cart = new Cart(req.session.cart);
	res.render('main/cart',{products:req.session.cart.items,totalprice:req.session.cart.total,user:req.session.user,session:req.session,categories:req.session.categories}) 
});

//API to get all products
router.get('/products',function(req,res,next){
	Product
	.find({})
	.populate('category')
	.exec(function(error,products){
		if(error) return next(error);
		res.render('main/category',{
			products:products,
			user:req.user,
			session:req.session,
			categories:req.session.categories
		});
	});
});

//API to get a product by id
router.get('/product/:id',function(req,res,next){
	Product.findById({_id:req.params.id},function(error,product){
		if(error) return next(error);
		res.render('main/product',{
			product:product,
			user:req.user,
			session:req.session,
			categories:req.session.categories
		});
	});
});

router.get('/checkout',function(req,res,next){
	if(!req.session.cart){
		return res.redirect('/cart');
	}
	//var cart = new Cart(req.session.cart);
	res.render('main/checkout',{
		user:req.user,
		session:req.session,
		categories:req.session.categories
	}); 
});

router.post('/checkout',function(req,res,next){
	var order=new Order();
	order.items=req.session.cart.items;
	order.username=req.body.name;
	order.address=req.body.address;
	order.mobileNumber=req.body.mobile;
	order.amount=req.session.cart.total;
	order.quantity=req.session.cart.totalProduct;
	order.save(function(error){
		if(error)
			return res.send(error);
		var cart=req.session.cart;
		cart.items = []
		cart.total = 0
		cart.totalProduct = 0
		cart.save(function(error){
			if (error){
				return res.send(error);
			}
			req.session.cart = cart
			console.log("successfully purchased");
			res.render('main/order',{order:order,user:req.user,session:req.session,categories:req.session.categories});
		})
	});
});

module.exports=router;