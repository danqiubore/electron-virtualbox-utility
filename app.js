const createError=require('http-errors');
const express=require('express');
const path=require('path');
const logger = require('morgan');

let ejs=require('ejs')

var app=new express()

app.engine('html',ejs.__express)
app.use(logger('dev'))
const pathtmp=path.join(__dirname,'resources')
app.use(express.static(path.join(__dirname,'resources')))

app.use(function(req,res,next){
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  module.exports = app;
