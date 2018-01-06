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
	res.render('accounts/login',{message:req.flash('loginMessage')});
});

router.post('/login',passport.authenticate('local-login',{
	successRedirect:'/',
	failureRedirect:'/login',
	failureFlash:true
}));
router.get('/signup',function(req,res){
	res.render('accounts/signup',{
		errors: req.flash('errors')
	});
});


router.post('/signup',function(req,res,next){
	var user=new User();
	user.name=req.body.name;
	user.email=req.body.email;
	user.password=req.body.password;
	//user.profile.picture=user.gravatar();

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
				var cart=new Cart();
				cart.owner=user._id;
				cart.save(function(error){
					if(error) return next(error);
					req.logIn(user,function(error){
						if(error) return next(error);
						res.redirect('/');
					});

				});
			});
		}
	});
});

router.get('/changePassword',function(req,res){
	res.render('accounts/changePassword');
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


router.get('/logout',function(req,res,next){
	req.logout();
	res.redirect('/');
});
module.exports=router;