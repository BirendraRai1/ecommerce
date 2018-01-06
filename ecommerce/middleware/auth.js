var User=require('../models/user');
exports.checkUser=function (req,res,next){
	console.log("hi");
	if(req.user.email!="birendrabit123@gmail.com")
		res.redirect('/')
	else
		next()
};