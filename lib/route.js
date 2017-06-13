var express = require('express')
var rp = require('request-promise')

var sendmail = require('./sendmail')
var dojob = require('./job')

module.exports = function(opt){
  var mailer = sendmail(opt.smtpConfig,opt.mailto)

  var router = express.Router()

  var slaves = {}

  //从塔直接注册
  if(opt.slave){
      regist(opt.mainIp,opt.mainUrl)
  }

  //处理post
  router.post('/',function(req,res){
    var rtn = {
        ip: req.ip
    }

    if(!slaves[req.ip] && !opt.slave){
        regist(req.ip,req.body.url)
    }

    res.json(rtn)
  })

  //处理job
  router.post('/job',function(req,res){
    var job = req.body.job
    var jobDetail = opt.jobs[job]
    var rtn = {
        job,
        date: new Date(),
    }
    
    if(jobDetail){
      rtn.frequency = jobDetail.frequency      
      rtn.frequencyLimit = dojob(job,jobDetail,mailer,opt.myUrl)  
    }

    res.json(rtn)
  })

  return router

  // functions 

  /**
   * 注册一个机器
   * 
   * @param {any} ip 
   * @param {any} url 
   */
  function regist(ip,url){
    slaves[ip] = {
      url,
      fail: 0,    
      interval: setInterval(()=>{
        detect(ip)
      },opt.interval)    
    }
    console.log(`${ip} registed`)
  }

  /**
   * 检测一个机器
   * 
   * @param {any} ip 
   */
  function detect(ip){
    if(!slaves[ip]) return

    rp.post({
        url:slaves[ip].url,
        timeout:opt.timeout,
        form: {
          url:opt.myUrl
        }
    })
    .then(()=>{
      console.log(`ip ${ip} still alive`)
      if(!slaves[ip]) return
      slaves[ip].fail = 0
    })
    .catch((e)=>{
      console.log(e)
      if(!slaves[ip]) return
      slaves[ip].fail++
      console.log(`ip ${ip} fail to response, fail count ${slaves[ip].fail}`)
      if(slaves[ip].fail>opt.maxFail){
        clearInterval(slaves[ip].interval)
        mailer.serverDown(ip+'|'+slaves[ip].url)
        slaves[ip] = false
      }
    })
  }
}