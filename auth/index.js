const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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
          bcrypt.hash(password, 10)
          .then((hash)=>{
            const user = {
              email: req.body.email,
              password: hash,
              createdat: new Date()
            }
            //insert user into db
            db('users').insert(user, 'id')
            .then(idArr=> {
              return idArr[0]
            })
            .then(id=> {
              // res.json({id})
              // redirect to signin view
              res.redirect("/auth/signin")
            })
            //redirect
          // res.json({user, message: 'OK'})
          })
          
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

//signin/Login route
router.get('/signin', (req, res)=>{
  res.render("signin")
})

router.post('/signin', (req, res)=>{
  let errors = [];

  if(validUser(req.body)){
    //check if in DB
    db('users').where('email', req.body.email) // returns array
    .then(userArr=> userArr[0])
    .then(user=>{
      //check in db if email exists for login
      if(user){
        //compare password with hashed password
        bcrypt.compare(req.body.password, user.password)
        .then((isValid)=>{
          if(isValid){
            //passwords match, set cookie header
            const isSecure = req.app.get('env') != 'development' //bool
            res.cookie('user_id', user.id, {
              //options
              httpOnly: true,
              secure: isSecure,
              signed: true
            })
            res.render("userGigs")
          }else{
            //passwords dont match
            errors.push({text: 'Invalid Login'})
            res.render("signin", {errors})
          }
        })
      }else{
        //user not found ( returned undefined from prev promise)
        res.json({message: 'Invalid credentials'})
      }
    })
  }
  else{
    // next(new Error("Invalid Login"))
    errors.push({text: 'Check your input'})
    res.render("signin", {errors})
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