require('dotenv').config();
const cookieParser = require("cookie-parser");
const cl = require('./utils/logAlias')
const express = require('express');
//Main route declaration
const bookRoutes = require('./routes/bookRoutes'); 

//Start DB connection
require('./db/conn');

//Use modules
const app = express();

//Set middlewares and static files
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/public', express.static(__dirname+ 'public'));

function logger(req, res, next) {
  console.log(`Accessed Path ${req.originalUrl}`);
  next();
}

// View engine to use to serve front end
app.set('view engine', 'ejs');
// Set view directories, the first view is a default parameter
// and the second one is the directory for ejs files
app.set('views', './views');

//Run logger
app.use(logger);

//Routes
app.use('/', bookRoutes);

//Start serving (Port 80, 81 or Random Port)
const server = app.listen(process.env.PORT || ++process.env.PORT || 0, (err)=>{
  if (err) cl(err);
  cl(`Server started at port ${server.address().port}`);
});

// If there is no path as the user requested
// USE going to fire this function for every incoming request
// regardless of the url specifically if there is no match
// and must be on bottom since it fires in every request
app.get('*',(req, res)=>{
  res.status(404).render('404', {title:'Error 404'});
});