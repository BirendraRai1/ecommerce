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
	successRedirect:'/profile',
	failureRedirect:'/login',
	failureFlash:true
}));

router.get('/profile',function(req,res,next){
	User.findOne({_id:req.user._id},function(error,user){
		if(error) return next(error);
		res.render('accounts/profile',{user:user});
	});	
});

router.get('/signup',function(req,res){
	res.render('accounts/signup',{
		errors: req.flash('errors')
	});
});


router.post('/signup',function(req,res,next){
	var user=new User();
	user.profile.name=req.body.name;
	user.email=req.body.email;
	user.password=req.body.password;
	user.profile.picture=user.gravatar();

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
						res.redirect('/profile');
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

router.get('/edit-profile',function(req,res,next){
	if(!req.user) return res.redirect('/login');
	res.render('accounts/edit-profile',{message:req.flash('success')});
});


router.post('/edit-profile',function(req,res,next){
	upload(req,res,function(error) {
			if(error) {
	            return next(error);
	        }
			var picture=null;
			if(typeof req.file!=='undefined'){ 
				picture="/uploads/"+req.file.filename;
			}

		    User.findOne({_id:req.user._id},function(error,user){
				if(error) return next(error);
				if(req.body.name) user.profile.name=req.body.name;
				if(req.body.address) user.address=req.body.address;
				if(picture){ 
					if(fs.existsSync("C:/project/ecommerce/ecommerce/public"+user.profile.picture))
					fs.unlink("C:/project/ecommerce/ecommerce/public"+user.profile.picture);
					user.profile.picture=picture; 
				}
				user.save(function(error,user){
					if(error) return next(error);
					req.flash('success','Successfully Edited Profile.');
					return res.redirect('/edit-profile');
				});
			});

	});
});




module.exports=router;