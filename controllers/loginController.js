const passport = require('passport');



const {initializePassport} = require('../authStrategy');
initializePassport(passport);


const loginView = async (req,res) => {
   
   return await res.render('login', {csrfToken: req.csrfToken()});
}


const loggedinView = 
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: 'login',
        failureFlash : true 
    })

const logoutView = (req,res)=>{
    req.logout();
    res.redirect('/login');
}


            
    

module.exports = {
    loginView, 
    loggedinView,
    logoutView
}