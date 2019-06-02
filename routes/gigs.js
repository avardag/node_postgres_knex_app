const express = require("express");
const router = express.Router();

//DB imports
const db = require("../config/databaseConfigs");
// const Gig = require("../models/Gig");

const authMiddleware = require("../auth/authMiddleware")
//Routes
//GET Route
router.get("/", (req, res)=>{
  db.select().table('gigs')
    .then(gigs=>{
      res.render('gigs', {
        gigs
      });
    })
    .catch(err => console.log(err))
})

//Display a form
router.get('/add', (req, res)=> res.render("add"))


//ADD route
router.post("/add", (req, res)=>{

  let {title, technologies, budget, description, contact_email} = req.body;

  let errors = [];
  //Validate fields
  if(!title){
    errors.push({text: 'Please add a title'})
  }
  if(!technologies){
    errors.push({text: 'Please add some technologies'})
  }
  if(!description){
    errors.push({text: 'Please add a descriptio'})
  }
  if(!contact_email){
    errors.push({text: 'Please add a contact email'})
  }

  //check for errors
  if(errors.length > 0){
    res.render('add', {
      errors,
      title, 
      technologies, 
      budget, 
      description, 
      contact_email
    })
  }else{
    //budget is not required, if no budget save "unknown"
    if (!budget) {
      budget = 'Unknown'
    } else {
      budget = `$${budget}`
    }
    //technologies arr, make lowercase & remove space after comma
    technologies = technologies.toLowerCase().replace(/,/g, ',')

    db('gigs').insert(
      { title: title,
        technologies: technologies,
        budget: budget,
        description: description,
        contact_email: contact_email
      }
    )
    .then(gig=> res.redirect('/gigs'))
    .catch(err => console.log(err))
  }
})

//SEarch route, GET
router.get('/search', (req, res)=>{
  let {search_term} = req.query;

  search_term = search_term.toLowerCase();

  db('gigs').where('technologies', 'like', `%${search_term}%`)
  .then(gigs=> res.render('gigs', { gigs }))
  .catch(err => console.log(err))

})

//USers gigs
router.get('/user/:id', authMiddleware, (req, res)=>{
  console.log(user)
  db('gigs').where('user_id', req.params.id)
  .then(gigs=>{
    if(gigs){
    res.render("userGigs", {gigs})
    }else{
      res.render("userGigs", {message: 'No gigs from you'})
    }
  })
  .catch(err=> console.log(err))
})

module.exports = router;