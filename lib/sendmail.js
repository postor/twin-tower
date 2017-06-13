const nodemailer = require('nodemailer')


module.exports = function(transportConfig, to){
  let transporter = nodemailer.createTransport(transportConfig);
  var from = `"TwinTower" <${transportConfig.auth.user}>`
  var date = new Date();
  /**
   * 发送邮件
   * @param {Object} opt 
   * @param {String} opt.from
   * @param {String} opt.to
   * @param {String} opt.subject 
   * @param {String} opt.text 
   * @param {String} opt.html 
   */
  return {
    serverDown: function(ip){
      transporter.sendMail({
        from,
        to,
        subject: `Server Down !!! [${ip}][${date}]`,
        text: `Server ip=[${ip}] is not responsing, please check the server!`
      })
    },
    jobResult: function(ip,job,error,stdout){      
      var subject = error?`Task Fail !!! [${job}][${ip}][${date}]`:`Task Finished ! [${job}][${ip}][${date}]`
      transporter.sendMail({
        from,
        to,
        subject,
        text: stdout+`------------------`+(error?error.toString():'')
      })
    }
  }
}
