var router=require('express').Router();
var path=require('path');
var passport=require('passport');
var passportConf=require('../config/passport');
var multer=require('multer');
var fs=require('fs');

var User=require('../models/user');
var Cart=require('../models/cart');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+'.'+file.mimetype.split('/')[1]);
  }
});
var upload = multer({ storage : storage}).single('file');
router.get('/login',function(req,res,next){
	if(req.user) return res.redirect('/');
	res.render('accounts/login',{message:req.flash('loginMessage'),user:req.user,categories:req.session.categories});
});

//API to post login
router.post('/login',function(req,res){
	console.log("checking body",req.body.email,req.body.password)
	User.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]},function(err,foundUser){
		console.log("during login",foundUser);
		if(err){
			//var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
			res.send(err);
		}

		else if(foundUser==null ||foundUser==undefined){
			res.redirect('/signup')
		}
		else{
			req.session.user=foundUser;
			req.user = foundUser;
			Cart.findOne({owner:req.session.user._id},function(err,cart){
				if(err)
					res.send(err);
				req.session.cart=cart;
			});
			
			delete req.session.user.password;
			res.redirect('/');
		}
	});
});
router.get('/signup',function(req,res){
	res.render('accounts/signup',{
		errors: req.flash('errors'),user:req.user,session:req.session,categories:req.session.categories
	});
});


router.post('/signup',function(req,res,next){
	console.log("hi all")
	var user=new User();
	user.name=req.body.name;
	user.email=req.body.email;
	user.password=req.body.password;
	User.findOne({email : req.body.email},function(error,existingUser){
		if(existingUser)
		{
			req.flash('errors','Accounts with this email already exists!');
			return res.redirect('/signup');
		}
		else
		{
			user.save(function(error,user){
				if(error)
				{
					return next(error);
				}
				req.session.user=user;
				req.user = req.session.user
				var cart=new Cart();
				cart.owner=user._id;
				cart.save(function(error,cart){
					if(error) 
						return next(error);
					req.session.cart=cart;
					res.redirect('/');
					/*req.logIn(user,function(error){
						if(error) return next(error);
						res.redirect('/');
					});*/

				});
			});
		}
	});
});

router.get('/changePassword',function(req,res){
	res.render('accounts/changePassword',{user:req.user,session:req.session,categories:req.session.categories});
});

router.post('/changePassword', function (req, res) {
    User.findOne({'email': req.body.email}, function (err, userFound) {
      if (err) {
        res.send(next(err));
      } else if (userFound == null) {
        res.send("enter correct email id");
      } else {
        if (req.body.newPassword != req.body.confirmPassword) {
          console.log('newPassword and confirmPassword should match')
          res.render('forgotPassword')
        } else {
          userFound.password = req.body.newPassword
          userFound.save(function () {
            res.redirect('/')
          })
        }
      }
    })
  });

router.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/'); 
  });
});
module.exports=router;