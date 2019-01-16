const express = require('express');
const hbs = require('hbs');
const fs = require('fs') ;
const gitAPI = require('./gitAPI/gitAPI.js');
const port = process.env.PORT || 3000 ;

var app = express();
// Set expression view enginer to hbs
app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials/')

hbs.registerHelper({
  'getCurrentYear': () =>{
    return new Date().getFullYear() ;
   },
  'screamIt': (text)=>{
      return text.toUpperCase() ;
  }
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


//Project Route

app.get('/projects', (req, res) => {
  var namesOfRepos  = [];
  var numberRepos = 0 ;

  gitAPI.getListOfRepos(gitAPI.gitUsername).then((response)=>{
    // console.log(response) ;

    for(let i = 0; i < response.data.length ; i ++){
      console.log(response.data[i]);
      namesOfRepos.push(response.data[i].name) ;
    }
    //console.log(JSON.stringify(response.data,undefined,2)) ;
  //   fs.writeFile('reposResponse.log',response.data, (err) =>{
  //   if(err){
  //     console.log('Unable to append to log');
  //   }
  // });
    //console.log(namesOfRepos.toString()) ;
    var numberRepos = namesOfRepos.length ;

    if(numberRepos === 0){
      throw new Error('No projects found') ;
    }
    console.log("From ./GitApi: "+namesOfRepos.toString()+numberRepos) ;

    //Render Webpage with all projects found from github API
    res.render('projectPage.hbs',
    {
      Projects: 'Projects' ,
      numberProjects: numberRepos ,
      projectList: namesOfRepos
    }) ;
  }).catch((e)=>{
    res.render('projectPage.hbs',
    {
      Projects: 'Projects' ,
      numberProjects: 'No project found on github :(' ,
      projectList: namesOfRepos
    }) ;
    console.log(e.message)
  });



//  var numProjects = listProjects.length ; // Lets assume 3, (*Ideal we could retrieve # from github)

  //console.log("From ./GitApi: "+listProjects.toString()+numProjects.toString()) ;


});

app.get('/bad', (req, res)=>{
  res.send({
    errorMessage: 'Unable to handle request'
  })
})




app.listen(port, ()=>{
  console.log(`Server is up on Port ${port} at `);
}) ;
