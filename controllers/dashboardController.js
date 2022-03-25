const db = require('../model/dbAccessModel').db;
const dbCode = require('../model/dbaCodeModel').DbaCode;
const dbaAccessModel = require('../model//dbAccessModel').DbModel;

const dashboardView = async (req,res) => {
    var user = await req.user;
    return await res.render('dashboard',{username:user.Name,userid:user.UserId,designation:user.Designation});
}

const myaccountView = async (req,res) => {
    var user = await req.user;
    return await res.render('myaccount',{csrfToken: req.csrfToken(),username:user.Name,email:user.Username,designation:user.Designation});
}



const updatedemailView = async (req,res) => {
    var user = await req.user;
    var userid = user.UserId
    var updtEmail = req.body.updateemail;
    console.log(updtEmail);
    await dbCode.updateUserEmail(updtEmail,userid);
    
    return await res.send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">Email Updated Successfully</h1></body>')

}

module.exports = {dashboardView,myaccountView,updatedemailView}