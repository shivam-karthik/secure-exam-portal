const db = require('../model/dbAccessModel').db;
const dbCode = require('../model/dbaCodeModel').DbaCode;
const dbaAccessModel = require('../model//dbAccessModel').DbModel;



const resultteacherView = async (req,res) => {
   try{
      var userId = await req.session.passport.user;
      var user = await req.user;
      const quizes = await dbCode.getAllQuizes(userId);
      res.render('result',{quizes:quizes,designation:user.Designation});
   }
   catch(err){
       console.log(err);
   }
}

const quizresultteacherView = async (req,res) => {
  
   var quizid = await req.params.QuizId;
   var user = await req.user;
   var results = await dbCode.getStudentsResultForQuiz(quizid);
   res.render('quizresult',{results:results,designation:user.Designation});

}


const resultstudentView = async (req,res) => {
   const user = await req.user;
   const enabledQuizes = await dbCode.getQuizesforStudentResult(user.UserId);
   return await res.render('result',{csrfToken: await req.csrfToken(),quizes:enabledQuizes,designation:user.Designation,userid:user.UserId,message:""});

}

const quizresultstudentView = async (req,res) => {
   const userid = await req.params.UserId;
   const quizid = await req.params.QuizId;
   const user = await req.user;

   const quizResult = await dbCode.searchQuizForStudent(userid,quizid);
   const quiz = await dbCode.getQuizByQuizId(quizid);

   const quizForLength = await dbCode.checkResponseTable(quizid,userid);
   const quizLength = quizForLength.length;
   
   const quizName = quiz.CourseName;

   return await res.render('quizresult',{csrfToken: await req.csrfToken(),quizes:quizResult,designation:user.Designation,quizname:quizName,totalmarks:quizLength});

}

module.exports = {resultteacherView,resultstudentView,quizresultteacherView,quizresultstudentView}