var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var ejs=require('ejs');
var engine=require('ejs-mate');
var session=require('express-session');
var cookieParser=require('cookie-parser');
var flash=require('express-flash');
var MongoStore=require('connect-mongo')(session);
var secret=require('./config/secret');
var User = require('./models/user');
var Product = require('./models/product');
var Category=require('./models/category');
var Cart=require('./models/cart');
//var cartLength=require('./middleware/middleware');

var app = express();
var dbPath="mongodb://localhost/ecommerceStore3";
//command to connect with the database
db=mongoose.connect(dbPath);
mongoose.connection.once('open',function(){
	console.log("database connection open success");
});
//middleware
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
	resave:false,
	saveUninitialized:false,
	secret:'myAppSecret',
	//store:new MongoStore({url:secret.database,autoReconnect:true}),
	cookie:{maxAge:180*60*1000},

}));
app.use(flash());

var mongoose=require('mongoose');
var userModel=mongoose.model('User');
var cartModel=mongoose.model('Cart');
var categoryModel=mongoose.model('Category');
app.use(function(req,res,next){
	if(req.session && req.session.user){
		userModel.findOne({'email':req.session.user.email},function(err,user){
			if(user){
				req.user=user;
				delete req.user.password;
				req.session.user=user;
				delete req.session.user.password;
			}
			else{
				//nothing to do
			}
		});
		cartModel.findOne({'owner':req.session.user._id},function(err,cart){
			if(cart){
				req.cart=cart;
				req.session.cart=cart;
			}
			else{
				//nothing to do
			}
		});
		categoryModel.find({},function(error,categories){
			if(categories) {
				req.categories = categories
				req.session.categories = categories
				next();
			}
			else{

			}
		});
	}
	else{
		categoryModel.find({},function(error,categories){
			if(categories) {
				req.categories = categories
				req.session.categories = categories
				next();
			}
			else{
				
			}
		});
		
	}
});



//app.use(cartLength);
//console.log("finding cart",req.session.cart);
/*app.use(function(req,res,next){
	Category.find({},function(error,categories){
		if(error) return next(error);
		res.locals.categories=categories;
		next();
	});
});*/

/*app.use(function(req,res,next){
	Category.find({},function(error,products){
		if(error) return next(error);
		res.locals.products=products;
		next();
	});
});*/
app.engine('ejs',engine);
app.set('view engine','ejs');
var mainRoutes=require('./routes/product');
app.use(mainRoutes);
var userRoutes=require('./routes/user');
app.use(userRoutes);
var adminRoutes=require('./routes/admin');
app.use(adminRoutes);
var apiRoutes=require('./api/api');
app.use('/api',apiRoutes);

app.use(function(err,req,res,next){
	console.log("came here due to error",err);
	res.send(err);
});


app.listen(3000,function(err){
	if(err) throw err;
	console.log("Server is listening on port 3000");
});