require('dotenv').config();
const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const path = require("path")


const app = express();
const PORT = process.env.PORT || 3000;

//View Engine setup
app.engine("handlebars", exphbs({defaultLayout: 'main'}));
app.set("view engine", 'handlebars');
//Set static folder MW
app.use(express.static(path.join(__dirname, 'public')));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
//Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//Index view
app.get('/', (req, res)=>{
  res.render('index', {layout: 'landing'})
});
//ROUTES
app.use('/auth', require("./auth/index"))
app.use("/gigs", require("./routes/gigs"));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); // error view
});

//server
app.listen(PORT, ()=> console.log(`App started on port ${PORT}`))