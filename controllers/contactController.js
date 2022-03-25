require('dotenv').config()

const nodemailer = require('nodemailer')

const contactView = function(req, res){
    let contactVarMail = " ";
    res.render("contact",{csrfToken: req.csrfToken()});
  }




// s1 for smtp connection
const transporter = nodemailer.createTransport({
    //this is the authentication for sending email.
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  //create a .env file and define the process.env variables
    // with your credentials.
  auth: {
    user: process.env.SMTP_TO_EMAIL,
    pass: process.env.SMTP_TO_PASSWORD,
  }
  });

const contactedView = function(req,res, next){
const mail = {
from: process.env.SMTP_FROM_EMAIL,
to: process.env.SMTP_TO_EMAIL,
subject: 'New Contact Form Submission',
text: `
    from:
    ${req.body.name}

    contact details
    email: ${req.body.email}
    phone: ${req.body.tel}

    message:
    ${req.body.message}`,
    }
    transporter.sendMail(mail, (err, data) => {

    if (err) {
        let contactVarMail = "Could not send message! Try again!";
        res.render("contact", {messageSent: contactVarMail,csrfToken: req.csrfToken()});
    } else {
    let contactVarMail = "Message sent successfully";
    res.render("contact", {messageSent: contactVarMail,csrfToken: req.csrfToken()});
    }
})
}


module.exports = {contactView,contactedView};