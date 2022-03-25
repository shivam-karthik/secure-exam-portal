require('dotenv').config()
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session);
const csrf = require('csurf');
const cookieParser = require('cookie-parser');




const {loginView, loggedinView, logoutView} = require('./controllers/loginController');
const {signupView, signedupView, resetView, postResetView} = require('./controllers/signupController');
const {indexView, aboutView} = require('./controllers/indexController');
const {dashboardView,myaccountView,updatedemailView} = require('./controllers/dashboardController')
const {checkAuthenticated, preventAlreadyAuthenticated,checkIsTeacher,blogDeletionCredibility,preventOtherStudentAccess,preventOtherStudentAccessbyName} = require('./authStrategy')
const {setquizdetailsView,setquizView,addquestionView,deletequizView,seeallquizesView,changestatusquizView} = require('./controllers/setquizController');
const {quizteacherView,quizstudentView,seeallenabledquizesView,quizresponseView  } = require('./controllers/quizController');
const { resultteacherView,resultstudentView,quizresultteacherView,quizresultstudentView} = require('./controllers/resultController');
const { contactView,contactedView} = require('./controllers/contactController');
 
router.use(express.static("public"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));



router.use(flash());
router.use(session({
    secret: process.env.SESSION_SECRET,
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
    store: new SQLiteStore({ db: 'sessions.db', dir: './database' })
}));

// csrf middlewares
router.use(cookieParser(process.env.CSRF_SECRET));
router.use(csrf({cookie: true}));


router.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    // handle CSRF token errors here
    res.status(403)
    res.send('Regrets!!Form Tampered With')
  })


router.use(passport.initialize());
router.use(passport.session());







// all the routes

router.get("/",preventAlreadyAuthenticated,indexView );

router.get("/about", aboutView);

router.get("/signup",preventAlreadyAuthenticated ,signupView);

router.post("/signup",preventAlreadyAuthenticated, signedupView);

router.get("/login",preventAlreadyAuthenticated,loginView );

router.post("/login",preventAlreadyAuthenticated, loggedinView);

router.get('/dashboard',checkAuthenticated, dashboardView )

router.get('/logout',checkAuthenticated, logoutView);

router.get('/reset-password', resetView)

router.post('/reset-password', postResetView)



router.get('/setquiz',checkAuthenticated,checkIsTeacher, setquizView)

router.post('/setquiz/',checkAuthenticated,checkIsTeacher, setquizdetailsView)

router.post('/addquestion/',checkAuthenticated,checkIsTeacher, addquestionView)

router.get('/quiz/:QuizId/delete',checkAuthenticated,checkIsTeacher,blogDeletionCredibility, deletequizView)

router.get('/quiz/:QuizId/updateStatus',checkAuthenticated,checkIsTeacher,blogDeletionCredibility, changestatusquizView)

router.get('/quizes',checkAuthenticated,checkIsTeacher,seeallquizesView )

router.get('/quiz/:QuizId',checkAuthenticated,checkIsTeacher,blogDeletionCredibility,quizteacherView )

router.get('/quizes/:StudentName',checkAuthenticated,preventOtherStudentAccessbyName, seeallenabledquizesView );

router.get('/quiz/:QuizId/:randomNumber',checkAuthenticated,quizstudentView )

router.post('/response/quizid/:QuizId/userid/:UserId',checkAuthenticated,quizresponseView )

router.get('/results',checkAuthenticated,checkIsTeacher,resultteacherView)

router.get('/results/:QuizId',checkAuthenticated,checkIsTeacher,blogDeletionCredibility,quizresultteacherView)

router.get('/result/:Student',checkAuthenticated,resultstudentView)

router.get('/result/user/:UserId/quiz/:QuizId',checkAuthenticated,preventOtherStudentAccess,quizresultstudentView)

router.get('/myaccount/user/:UserId',checkAuthenticated,preventOtherStudentAccess,myaccountView)


router.post('/updateuseremail',checkAuthenticated,updatedemailView)



router.get("/contact",checkAuthenticated,contactView);

router.post("/contact",checkAuthenticated,contactedView);



module.exports = router;
