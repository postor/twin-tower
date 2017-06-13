const exec = require('child_process').exec

module.exports = doJob

var last = {}

/**
 * 做任务
 * 
 * @param {any} job 
 * @param {any} cmd 
 * @param {any} mailer 
 */
function doJob(jobKey,job,mailer,ip){
  var now = new Date().getTime()
  if(last[jobKey]){
    var wait = last[jobKey] + job.frequency - now
    console.log({wait,now})
    if(wait>0){
      return wait
    }else{
      last[jobKey] = now
    }
  }else{    
    last[jobKey] = now
  }

  exec(job.cmd,job.options,(error,stdout)=>{
    mailer.jobResult(ip,jobKey,error,stdout)
  })
  return 0
}