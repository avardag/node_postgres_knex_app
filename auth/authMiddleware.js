function ensureLoggedIn(req, res, next) {
  console.log(req.signedCookies)
  if(req.signedCookies.user_id){
    next({user:req.signedCookies.user_id});
  }else{
    res.status(401);
    next(new Error("Unauthorized"))
  }
}

module.exports = ensureLoggedIn;