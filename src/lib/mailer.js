const nodemailer = require('nodemailer')


module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ed0ecd7c73e4c5",
    pass: "cceb3871141e86"
  }
})
