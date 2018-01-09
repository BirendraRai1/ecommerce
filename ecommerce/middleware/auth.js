var User=require('../models/user');
exports.checkUser=function (req,res,next){
	console.log("hi");
	if(req.user.email!="birendrabit123@gmail.com")
		res.redirect('/')
	else
		next()
};

exports.addToCartCheck=function (req,res,next){
	console.log("hi there",req.user);
	if(req.user)
		next()
	else
		res.redirect('/');
};