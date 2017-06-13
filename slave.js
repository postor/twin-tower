require("babel-register");
var express = require('express')
var bodyParser = require('body-parser')
var config = require('./slave-config')
var twintower = require('./index')

var app = express()

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use('/twintower',twintower(config))
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world')
});

app.listen(config.port,(err)=>{
  if(!err){
    console.log(`service started on port: ${config.port}`)
  }else{
    console.log(err)
    throw err
  }
})