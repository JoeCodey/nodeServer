const express = require('express');
const hbs = require('hbs');
const fs = require('fs') ;
const port = process.env.PORT || 3000 ;

var app = express();
// Set expression view enginer to hbs
app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials/')

hbs.registerHelper('getCurrentYear',() =>{
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt',(text)=>{
  return text.toUpperCase() ;
});

//Middleware - log requests
app.use((req,res,next) => {
  var now = new Date().toString() ;
  var log = `${now}:${req.method} ${req.url}` ;
  console.log(log);
  fs.appendFile('server.log',log + '\n', (err) =>{
    if(err){
      console.log('Unable to append to server.log');
    }
  }) ;
  next();
});
// Middleware -- enter maintenance mode
// app.use((req,res,next)=>{
//   res.render('maintenance.hbs');
// });

app.get('/',(req,res) => {
  //res.send('<h1>Hello Express!</h1>') ;
  res.render('index.hbs',{
    pageTitle: 'Home Page' ,
    welcomeMessage: 'Welcome to My Website'
  });
});

//Middleware, to render static files to server
app.use(express.static(__dirname+'/public'));


app.get('/about',(req,res) =>{
  res.render('about.hbs',{
    pageTitle: 'About page'
  });
});

app.get('/bad', (req, res)=>{
  res.send({
    errorMessage: 'Unable to handle request'
  })
})


app.listen(port, ()=>{
  console.log(`Server is up on Port ${port} at `);
}) ;
