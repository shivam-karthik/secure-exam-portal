const db = require('../model/dbAccessModel').db;
const dbCode = require('../model/dbaCodeModel').DbaCode;
const dbaAccessModel = require('../model//dbAccessModel').DbModel;


const setquizView = async (req,res) => {
 
   return await res.render('setquiz',{csrfToken: await req.csrfToken()});

}

const setquizdetailsView = async (req,res) => {
   try{
         const newQuiz = await req.body.courseName;
         var UserId =  await req.session.passport.user;
         var status = "disabled"
         await dbCode.insertQuizDetails(newQuiz,UserId,status);

         
         var response = {
            status  : 200,
            success : 'Updated Successfully'
        }
        
        await res.end(JSON.stringify(response));
   }
   catch(err){
      console.log(err);
   }
    
}

const addquestionView = async (req,res) => {
   try{
      var {courseName,question,option1,option2,option3,option4,answer} = await req.body;
      const newQuiz = courseName;
  
      var Quiz = await dbCode.getQuizByCourseName(newQuiz);
      var QuizId = Quiz.QuizId;
  
      await dbCode.insertQuestion(question,option1,option2,option3,option4,answer,QuizId);
  
      var response = {
        status  : 200,
        success : 'Question Added Successfully'
     }
    
   await  res.end(JSON.stringify(response));
   }
   catch(err){
       console.log(err);
   }

}

const deletequizView = async (req,res) => {
   try{
      var quizId = await req.params.QuizId;
      await dbCode.deleteQuiz(quizId);

      var customTimeout = 1000;
      res.setTimeout(customTimeout, async function(){
         console.log("TIMED!");
            res.send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">Quiz Deleted Successfully</h1></body>');
      });
      
   }
   catch(err){
      console.log(err);
   }
}


const changestatusquizView = async (req,res) => {
   try{
      var quizId = await req.params.QuizId;
      var quiz = await dbCode.getQuizByQuizId(quizId);
      var currentStatus = quiz.Status;
      console.log(currentStatus);

      if (currentStatus == 'disabled'){
         currentStatus = 'enabled';
      }
      else{
         currentStatus ="disabled";
      } 
      await dbCode.updateStatusQuiz(currentStatus,quizId);

      var userId = await req.session.passport.user;
      const quizes = await dbCode.getAllQuizes(userId);

      return await res.render('quizes',{quizes:quizes,message:""})
      
   }
   catch(err){
      console.log(err);
   }
}

const seeallquizesView = async (req,res) => {
   var userId = await req.session.passport.user;

   const quizes = await dbCode.getAllQuizes(userId);
   
 
   return await res.render('quizes',{csrfToken: await req.csrfToken(),quizes:quizes,message:""});

}

module.exports = {setquizdetailsView, setquizView,addquestionView,deletequizView,seeallquizesView,changestatusquizView}