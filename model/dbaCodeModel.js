const dbaAccessModel = require('./dbAccessModel').DbModel;


class DbaCode{

    static async getUserByUsername(username) {
        return dbaAccessModel.get("SELECT * FROM users WHERE Username =?", [username]);
    }

    static async getUserById(id) {
        return dbaAccessModel.get('SELECT * FROM users WHERE UserId = ?', [id]);
    }

    static async insertUser(name,username,password,designation){
        try{
           return await dbaAccessModel.run('INSERT INTO users(Name,Username,Password,Designation) VALUES(?,?,?,?)', [name, username, password,designation]);
        }
        finally{
            console.log("New User added");
        }   
    }

    static async updatePassword(password,username){
        try{
           return await dbaAccessModel.run('UPDATE users SET Password = ? WHERE Username = ?',[password, username]);
        }
        finally{
            console.log("Password Reset done!!");
        }   
    }

    static async insertQuizDetails(coursename,userid,status){
        try{
           return await dbaAccessModel.run('INSERT INTO quizes(CourseName,UserId,Status) VALUES(?,?,?)', [coursename, userid,status]);
        }
        finally{
            console.log("quiz details added");
        }   
    }
    static async getQuizByCourseName(coursename){
        try{
           return dbaAccessModel.get("SELECT * FROM quizes WHERE CourseName =?", [coursename]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('quiz selected');
        }   
    }


    static async getQuizByQuizId(quizid){
        try{
           return dbaAccessModel.get("SELECT * FROM quizes WHERE QuizId =?", [quizid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('quiz selected');
        }   
    }

    static async insertQuestion(question,option1,option2,option3,option4,answer,QuizId){
        try{
           return await dbaAccessModel.run(`INSERT INTO question_ans(question,option1,option2,option3,option4,answer,QuizId) VALUES(?,?,?,?,?,?,?)`, [question,option1,option2,option3,option4,answer,QuizId]);
        }
        finally{
            console.log("question added");
        }   
    }

    static async getQuiz(quizid){
        try{
           return await dbaAccessModel.all("SELECT * FROM question_ans WHERE QuizId =?", [quizid] );
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log("quiz selected");
        }   
    }

    static async deleteQuiz(quizid){
        try{
            await dbaAccessModel.run('DELETE from quizes WHERE QuizId = ?',[quizid])
            await dbaAccessModel.run('DELETE from responses WHERE QuizId = ?',[quizid])
           return await dbaAccessModel.run('DELETE FROM question_ans WHERE QuizId = ?',[quizid]);
        }
        catch(err){
            return err;
        }
        finally{
            console.log("quiz deleted");
        }   
    }

    static async getAllQuizes(userid){
        try{
           return dbaAccessModel.all("SELECT * FROM quizes WHERE UserId =?", [userid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('all quizes selected');
        }   
    }

    static async updateStatusQuiz(status,quizid){
        try{ 
           return dbaAccessModel.all("UPDATE quizes SET Status = ? WHERE QuizId = ?", [status,quizid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('all quizes selected');
        }

    }
    static async getAllEnabledQuizes(){
        try{
            var Status = "enabled";
           return dbaAccessModel.all("SELECT * FROM quizes WHERE Status =?", [Status]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('all enabled quizes selected');
        }   
    }

    static async addAresponse(questionValue,quizid,optionValue,userid){
        try{
           return dbaAccessModel.all("INSERT INTO responses(QuestionId,QuizId,Response,UserId) VALUES(?,?,?,?)", [questionValue,quizid,optionValue,userid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('Single Response Added');
        }   
    }

    static async checkResponseTable(quizid,userid){
        try{
           return dbaAccessModel.all("SELECT * FROM responses WHERE QuizId = ? AND UserId = ?", [quizid,userid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('existance of response checked');
        }   
    }

    static async calculateScore(quizid,userid){
        try{
           return dbaAccessModel.all(`SELECT Response FROM responses INNER JOIN question_ans ON responses.Response = question_ans.answer WHERE responses.QuizId=? AND responses.UserId=?`,[quizid,userid]);      
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('existance of response checked');
        }   
    }

    static async insertScore(userid,quizid,score,status){
        try{
           return dbaAccessModel.all("INSERT INTO results(UserId,QuizId,Score,Status) VALUES(?,?,?,?)", [userid,quizid,score,status]);
           
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('existance of response checked');
        }   
    }


    static async getStudentsResultForQuiz(quizid){
        try{

           return dbaAccessModel.all("SELECT * FROM results WHERE QuizId =?", [quizid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('all Student Results for this quiz selected');
        }   
    }


    static async getQuizesforStudentResult(userid){
        try{
            
           return dbaAccessModel.all("SELECT * FROM results WHERE UserId =?", [userid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('all quizes for student results selected');
        }   
    }

    static async searchQuizForStudent(userid,quizid){
        try{
            
           return dbaAccessModel.get("SELECT * FROM results WHERE UserId =? AND QuizId=?", [userid,quizid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('particular quiz for student result selected');
        }   
    }

    static async updateUserEmail(email,userid){
        try{
            
           return dbaAccessModel.get("UPDATE users SET Username = ? WHERE UserId = ? ", [email,userid]);
        }
        catch(err){
            console.log(err);
        }
        finally{
            console.log('Email Updated');
        }   
    }
    
}



module.exports = {DbaCode};