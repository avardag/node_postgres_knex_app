const express = require("express");
const router = express.Router();
//needed for search to use LIKE %jddj%;
const Sequilize = require('sequelize');
const Op = Sequilize.Op;
//DB imports
const db = require("../config/databaseConfigs");
const Gig = require("../models/Gig");

//Routes
//GET Route
router.get("/", (req, res)=>{
  // Gig.findAll({
  //   attributes: ['title', 'technologies'] //columns
  // })
  Gig.findAll()
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

    Gig.create({
    title,
    technologies,
    budget,
    description,
    contact_email
    })
    .then(gig=> res.redirect('/gigs'))
    .catch(err => console.log(err))
  }
})

//SEarch route, GET
router.get('/search', (req, res)=>{
  let {search_term} = req.query;

  search_term = search_term.toLowerCase();

  Gig.findAll({where: {technologies: { [Op.like]: '%'+search_term+'%' }}})
  .then(gigs=> res.render('gigs', { gigs }))
  .catch(err => console.log(err))


})

module.exports = router;