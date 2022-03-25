const express = require('express');
const ejs = require('ejs');
const routes = require('./routes');
const dbConstruct = require('./model/dbAccessModel');

dbConstruct.DbModel.setupDbForDev();

const app = express();

app.set('view engine', 'ejs');

app.use('/', routes);

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}
app.listen(port, () => 
    console.log(`server started at http://localhost:${port}`
));
