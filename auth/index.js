const express = require('express');
const router = express.Router();
const db = require("../config/databaseConfigs")

router.get('/', (req, res)=>{
  res.render("signup")
})

router.post('/signup', (req, res, next)=>{
  const {email, password, password_confirm} = req.body;

  let errors = [];

  if(validUser(req.body) && confirmPassword(req.body)){
    //Find user in DB
    db('users').where('email', email).first()
      .then(user=>{
        //check if email already exists
        if (!user) {
          //unique email
          //hash password
          //insert user into db
          //redirect
          res.json({user, message: 'OK'})
        } else {
          //email in use
          // next(new Error("Email in use"))
          errors.push({text: 'Email in use, try again'})
          res.render("signup", {errors})
        }
        
      })
  }else{
    //send error
    // next(new Error("Check your input"))
    errors.push({text: 'Check your input'});
    res.render("signup", {errors, email, password, password_confirm})
    
  }
})


function validUser(user){
  const validEmail = typeof user.email == 'string' &&
                    user.email.trim() != '';
  const validPassword = typeof user.password == 'string' &&
                    user.password.trim() != '' &&
                    user.password.trim().length >=6;

  return validEmail && validPassword;
}

function confirmPassword(user){
  return user.password === user.password_confirm;
}
module.exports = router;