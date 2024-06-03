const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
require('dotenv').config()

// middleware
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
// session config
app.use(session({
    secret: 'seCreTKey99',
    resave: true,
    saveUninitialized:true,
    cookie: {
        maxAge:20000,
        httpOnly:true,
        // secure:true
    }
}))

app.get('/',userLogin,function(req,res){
    // res.locals.emailId = req.body.emailId;
    // res.locals.password = process.body.password;
    res.render(path.join(__dirname+'/public/home/index.ejs'),{emailId:req.session.emailId,password:req.session.password});
})

app.get('/login', preventAutoLogout, function(req, res) {
  if (req.session.status) {
    res.redirect('/');
  } else {
    res.setHeader('Cache-Control', 'no-store');
    res.render(path.join(__dirname + '/public/login/index.ejs'));
  }
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(!(err)){
             res.redirect('/')
        }else{
            res.send("error logging out");
        }
    })
})

app.post('/auth',auth,function(req,res){
    req.session.emailId = req.body.emailId;
    req.session.password = req.body.password;
    req.session.status = true;
    res.redirect('/');
})

function userLogin(req,res,next){
    //session
    if(!(req.session.status)){
        res.redirect(307,'/login');
    }else{
        return next();
    }
}

function auth(req,res,next){
  if(!(req.body.emailId === process.env.EMAIL&&req.body.password===process.env.PASSWORD)){
     res.status(401)
     .send('invalid email or password');
  }else{
     return next();
  }
}


function preventAutoLogout(req,res,next){
        if(req.session && req.session.emailId){
            res.redirect(307,'/');
        }else{
            return next()
        }     
}

app.listen(process.env.PORT||8080);
