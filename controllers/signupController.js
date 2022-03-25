const dbCode = require('../model/dbaCodeModel').DbaCode;
const bcrypt = require('bcrypt');



const signupView = async (req,res) => {
    return await res.render('signup', {csrfToken: await req.csrfToken()});
}



const signedupView = async (req,res) => {
    try{   
        var { fullname, username, password, passwordConfirm ,designation} = req.body;
        var message;

        const userInDB = await dbCode.getUserByUsername(username);

  
        if(password !== passwordConfirm){
           message= "Unmatching enteries";
           return await res.render('signup',{alertMessage: message,csrfToken: await req.csrfToken()});  
        }
        else if(userInDB !== undefined && userInDB.Username == username ){
           message= "User already exist, Login-Instead";
           return await res.render('signup',{alertMessage: message,csrfToken: await req.csrfToken()});
        }
        else if(!fullname  || !username || !password || !passwordConfirm || designation === "Select"){
            message= "all enteries required";
           return await res.render('signup',{alertMessage: message,csrfToken: await req.csrfToken()});
        } 
        else if(userInDB === undefined && password === passwordConfirm && designation !== "Select"){
            var salt = bcrypt.genSaltSync(10);
            var data = {
                Name: fullname,
                Username: username.toLowerCase(),
                Password: bcrypt.hashSync(password, salt),
                Designation : designation
            }
            await dbCode.insertUser(data.Name,data.Username, data.Password, data.Designation);
            message= "Successfully Signed up please login to continue!";
            return await res.render('signup',{alertMessage: message,csrfToken: await req.csrfToken()});
        }
      }
      catch (err) {
         console.log(err);
       }
}





const resetView = async (req,res) => {
       return await res.render('reset',{csrfToken: await req.csrfToken()});
}

const postResetView = async (req,res) => {
    try {
        var username = req.body.username.toLowerCase()
       var { newPassword, confirmNewPassword, oldPassword} = req.body;
       const userInDB = await dbCode.getUserByUsername(username);

       console.log();
       
       

       if(!username  || !oldPassword || !newPassword || !confirmNewPassword){
            message= "all enteries required";
            return await res.render('reset',{alertMessage: message,csrfToken: await req.csrfToken()});
        }
        else if(newPassword !== confirmNewPassword){
            message= "Unmatching enteries";
            return await res.render('reset',{alertMessage: message,csrfToken: await req.csrfToken()});  
        }
        else if(userInDB === undefined ){
            message= "Invalid credentials";
            return await res.render('reset',{alertMessage: message,csrfToken: await req.csrfToken()});  
        }

        else if((await bcrypt.compare(oldPassword,userInDB.Password))=== false){
            message= "Invalid credentials";
            return await res.render('reset',{alertMessage: message,csrfToken: await req.csrfToken()});  
        }
        else if(userInDB !== undefined && newPassword === confirmNewPassword && ((await bcrypt.compare(oldPassword,userInDB.Password))=== true)){
            var salt = bcrypt.genSaltSync(10);
            newPassword = bcrypt.hashSync(newPassword, salt);

            await dbCode.updatePassword(newPassword,username);
            message= "Password updated successfully!!";
            return await res.render('reset',{alertMessage: message,csrfToken: await req.csrfToken()});
        }
        
    }
    catch(err){
        return err;
    }
}


module.exports = {
    signedupView,
    signupView,
    resetView,
    postResetView
    }
