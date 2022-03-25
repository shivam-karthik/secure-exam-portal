require('dotenv').config()
// requiring sqlite3 for database operations
const sqlite3 = require('sqlite3').verbose();

const url = process.env.DATABASE_URL || './database/oxap.db' ;

const db = new sqlite3.Database(url)

class DbModel{
  static setupDbForDev() {
    db.serialize(() =>{
      const createUsersTable = "CREATE TABLE IF NOT EXISTS users(UserId integer primary key, Name text , Username text, Password text, Designation text)";
      const createQuizesTable = "CREATE TABLE IF NOT EXISTS quizes(QuizId integer primary key,CourseName text,Status text,UserId Integer,FOREIGN KEY(UserId) REFERENCES users(UserId))";
      const createQuestionAnsTable ="CREATE TABLE IF NOT EXISTS question_ans(QuestionId integer primary key, question text , option1 text, option2 text,option3 text, option4 text,answer text,QuizId integer,FOREIGN KEY(QuizId) REFERENCES quizes(QuizId))"
      const createResponseTable="CREATE TABLE IF NOT EXISTS responses(QuestionId integer, QuizId integer,Response text,UserId integer,FOREIGN KEY(QuestionId) REFERENCES question_ans(QuestionId))"
      const createScoreTable = "CREATE TABLE IF NOT EXISTS results(UserId integer, QuizId integer,Score integer,Status text,FOREIGN KEY(UserId) REFERENCES users(UserId))"
      db.run(createUsersTable);
      db.run(createQuizesTable);
      db.run(createQuestionAnsTable);
      db.run(createResponseTable);
      db.run(createScoreTable);
    });
  }


  static all(sqlCommand, params){
    return new Promise((resolve,reject)=>{
      db.all(sqlCommand,params,(error,result)=>{
        if (error){
          return reject(error)
        }
        return resolve(result);
      });
    });
  }

  static get(sqlCommand, params){
    return new Promise((resolve,reject)=>{
      db.get(sqlCommand,params,(error,result)=>{
        if (error){
          return reject(error)
        }
        return resolve(result);
      });
    });
  }

  static run(sqlCommand, params){
    return new Promise((resolve,reject)=>{
      db.run(sqlCommand,params,(error,result)=>{
        if (error){
          return reject(error)
        }
        return resolve(result);
      });
    });
  }

  static each(sqlCommand, params){
    return new Promise((resolve,reject)=>{
      db.each(sqlCommand,params,(error,result)=>{
        if (error){
          return reject(error)
        }
        return resolve(result);
      });
    });
  }

}

module.exports = {DbModel, db};



