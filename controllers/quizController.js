const db = require('../model/dbAccessModel').db;
const dbCode = require('../model/dbaCodeModel').DbaCode;
const dbaAccessModel = require('../model//dbAccessModel').DbModel;


const quizteacherView = async (req,res) => {
    var requestedQuizId = req.params.QuizId
    
    var quiz = await dbCode.getQuiz(requestedQuizId);
    
    return await res.render('teacherquiz',{csrfToken: await req.csrfToken(),quiz:quiz});
 
 }
 






 const quizstudentView = async (req,res) => {
   var requestedQuizId = req.params.QuizId
   var userid =  await req.session.passport.user;
   var isResponseExist = await dbCode.checkResponseTable(requestedQuizId,userid);
   
   
   if(isResponseExist[0] !== undefined){
      return await res.send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">Response Submitted Already</h1></body>');
   }
    else{    
      //  quiz selected from question_ans table
      var quiz = await dbCode.getQuiz(requestedQuizId);
      //  quiz selected from quizes table
      var quizStatus = await dbCode.getQuizByQuizId(requestedQuizId);

      var user = await req.user;
      
      if( quizStatus != undefined && quizStatus.Status == 'enabled'){
         return await res.render('studentquiz',{csrfToken: await req.csrfToken(),quiz:quiz,user:user})
      }
      else{
         return await res.send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">403 Forbidden!!</h1></body>')
      } 
    }
   
 }






 
 const seeallenabledquizesView = async (req,res) => {
    
    const enabledQuizes = await dbCode.getAllEnabledQuizes();  
    return await res.render('studentquizes',{csrfToken: await req.csrfToken(),quizes:enabledQuizes,message:""});
 
 }





 const quizresponseView  = async (req,res) => {
   var quizid =req.params.QuizId;
   var userid = req.params.UserId;
   var isResponseExist = await dbCode.checkResponseTable(quizid,userid);
   
   if(isResponseExist[0] !== undefined){
      return await res.send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">Response Submitted Already</h1></body>');
   }


   var quiz = await dbCode.getQuiz(quizid);
   var i=1;

   var responseObject =  await req.body;
   for(i;i<=Object.keys(quiz).length;i++){
      var questionid = `questionid${i}`;
      var optionid =  `option${i}`;
      var questionValue = responseObject[questionid] ;
      var optionValue = responseObject[optionid] ;
      await dbCode.addAresponse(questionValue,quizid,optionValue,userid);
   }
   
   var result = await dbCode.calculateScore(quizid,userid);
   console.log(result);
   var score = result.length;
   var status = "disabled";

   await dbCode.insertScore(userid,quizid,score,status);
   
   return await res.send('<body style="background-color:#FFE162;"><h1 style="text-align:center; margin-top:0%;font-family:sans-serif; color:teal;">Response Submitted Successfully</h1></body>');

}

 module.exports = {quizteacherView,quizstudentView,seeallenabledquizesView,seeallenabledquizesView ,quizresponseView}