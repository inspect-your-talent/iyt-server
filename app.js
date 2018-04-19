const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose')
const dbURL = 'mongodb://inspecta-db-user:Cl9EAyHVeuHZpp9c@inspecta-shard-00-00-jfzqf.mongodb.net:27017,inspecta-shard-00-01-jfzqf.mongodb.net:27017,inspecta-shard-00-02-jfzqf.mongodb.net:27017/inspecta-db?ssl=true&replicaSet=inspecta-shard-0&authSource=admin';

const index = require('./routes/index');
const users = require('./routes/users');
const uploadCV = require('./routes/uploadCv');
const github = require('./routes/github');
const twitter = require('./routes/twitter')

const app = express();

app.use(cors())

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/upload-cv', uploadCV);
app.use('/github', github);
app.use('/twitter', twitter);

mongoose.connect(dbURL, err => {
  if (!err)
    console.log('Connected to database');
  else
    console.log('Error Connect to database');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({ message: err.message })
});

module.exports = app;
