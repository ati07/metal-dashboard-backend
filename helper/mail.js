"use strict";
// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer"
// async..await is not allowed in global scope, must use a wrapper
export async function mail(data) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });
const transporter = nodemailer.createTransport({
    // host: 'gmail',
    // port: 587,
    service : 'gmail',
    auth: {
        user: 'atiurrahman.ansari@gmail.com',
        pass: 'zkrsdjspbtnbnlvd'
    }
});

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'atiurrahman.ansari@gmail.com', // sender address
    to: "atiurrahman.ansari@gmail.com,andrew@chargebackprolatam.com", // list of receivers
    subject: "New Merchant account has been added", // Subject line
    text: "New Merchant account has been added", // plain text body
    html: `<b>New Merchant account has been added</b>
          <p>Merchant : ${data.merchant}</p>`, // html body

    priority:'high'
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);
