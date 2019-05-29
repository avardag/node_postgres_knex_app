require('dotenv').config();
const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")

//DATABASE
const db = require('./config/databaseConfigs');

const app = express();
const PORT = process.env.PORT || 3000;

//View Engine setup
app.engine("handlebars", exphbs({defaultLayout: 'main'}));
app.set("view engine", 'handlebars');
//Set static folder MW
app.use(express.static(path.join(__dirname, 'public')));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));

//Index view
app.get('/', (req, res)=>{
  res.render('index', {layout: 'landing'})
});
//ROUTES
app.use("/gigs", require("./routes/gigs"));

//server
app.listen(PORT, ()=> console.log(`App started on port ${PORT}`))