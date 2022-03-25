const express = require('express');
const db = require('./model/dbAccessModel').db;
const dbCode = require('./model/dbaCodeModel').DbaCode;
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const Logger = require('nodemon/lib/utils/log');


// auth stratagy
function initializePassport(passport) {

   const authenticateUser = async (username, password, done) => {
       const user = await dbCode.getUserByUsername(username.toLowerCase());
       

       try{
            if(user == undefined){
                return done(null,false, {message: 'No user with that email'})
            }
            bcrypt.compare(password,user.Password, (err,match) =>{
            if (err) {
                return done(null, false);
            }
            if(!match){
                return done(null, false, {message: "wrong password"});
            }
            if(match){
                return done(null,user)
            }
        })
       } 
       catch (err) {
           return done(err)
       }
   }

    passport.use(new LocalStrategy(authenticateUser))
    
    passport.serializeUser(function(user,cb){
        cb(null,user.UserId);
        
    });
    
    
    passport.deserializeUser((UserId, cb)=>{
        var user=  dbCode.getUserById(UserId);
        cb(null,user);
    });
    
}

const checkAuthenticated = async function (req,res,next){
    if(await req.isAuthenticated()){
        return next()
    }
    res.redirect('/login');
}

const preventAlreadyAuthenticated = async function (req,res,next){
    if(await req.isAuthenticated()){
       return res.redirect('/dashboard');
    }
    next();
}

const checkIsTeacher = async function (req,res,next){
    var user = await req.user;
    if(user.Designation === "Teacher"){
        return next()
    }
    res.redirect('/dashboard');
}

const blogDeletionCredibility = async function (req,res,next){
    var user = await req.user;
    var quizes = await dbCode.getAllQuizes(user.UserId);
    var quizid = await req.params.QuizId;
    let quizInDb = await dbCode.getQuizByQuizId(quizid);
    var quizBelongsToUser;
    var iterCount = 0;
    var length = quizes.length;

    if(quizInDb !== 'undefined'){
        quizes.forEach(quz => {
            if(quz.QuizId == quizid){
                quizBelongsToUser = true;
                return next();
            }else{
                quizBelongsToUser = false;
                if(iterCount+1 === length){
                    res.send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">403 Forbidden!!</h1></body>');
                }
            }
            iterCount++;
        });
    }

    if(quizInDb === 'undefined' ){
        res.send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">403 Forbidden!!</h1></body>');
    }
    
}

const preventOtherStudentAccess = async (req,res,next) => {
    const user = await req.user;
    const userid = user.UserId;
    const requestedUserId = await req.params.UserId;
    if (userid == requestedUserId){
        return next();
        
    }
    
     res.status(403).send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">403 Forbidden!!</h1></body>');
}

const preventOtherStudentAccessbyName = async (req,res,next) => {
    const user = await req.user;
    const username = user.Name;
    console.log(user.Name);
    const requestedUsername = await req.params.StudentName;
    console.log(requestedUsername);
    if (username == requestedUsername){
        return next();
        
    }  
     res.status(403).send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">403 Forbidden!!</h1></body>');
}



module.exports = {
    initializePassport,
    checkAuthenticated,
    preventAlreadyAuthenticated,
    checkIsTeacher,
    blogDeletionCredibility,
    preventOtherStudentAccess,
    preventOtherStudentAccessbyName
};
