var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User=require('../models/user');


//serialize and deserialize
passport.serializeUser(function(user,done){
	done(null,user._id);
});


passport.deserializeUser(function(id,done){
	User.findById(id,function(error,user){
		done(error,user);
	});
});


//middleware

passport.use('local-login',new LocalStrategy({
	usernameField:"email",
	passwordField:"password",
	passReqToCallback:true
},function(req,email,password,done){
	User.findOne({email:email},function(error,user){
		if(error) return done(error);
		if(!user)
		{
			return done(null,false,req.flash('loginMessage','Email does not exist!'));
		}
		if(!user.comparePassword(password))
		{
			return done(null,false,req.flash('loginMessage','Oops, Wrong Password!'));
		}
		return done(null,user);
	});
}));


//custom function to validate

exports.isAuthenticated=function(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	req.redirect('/login');
};