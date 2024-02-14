import nodemailer from "nodemailer";
// the main thing in this file is trasporterInfo and mailInfo
//neglet other part

//transporterInof gives form information while mailInof gives to info
let transporterInfo = {
  // host: emailHost,
  host: "smtp.gmail.com",
  // if from is gmail use gmail smtp
  port: 587,
  secure: false,
  //   auth user and pass play the role from
  auth: {
    // note user and pass most be genuine
    //it is the email through which email is send
    user: "basantjoshi6363@gmail.com",
    pass: "tmpznezevdhnqmpp",
    // to send email form server first you have to =>
    //use 2-step verification and generate app password
    //instead of using your password use app password of gmail
    //for this go to the => manage your account => security setting and=>enable 2-step verifiction =>crete app pssword (select other option)
  },
};

export let sendMail = async (mailInfo) => {
  try {
    let transporter = nodemailer.createTransport(transporterInfo); //transporter gives from information
    let info = await transporter.sendMail(mailInfo);
  } catch (error) {
    console.log("error has occurred", error.message);
  }
};

// How to call mail
// await sendMail({
// from: '"Unique" <uniquekc425@gmail.com>',
//   to: ["abc@gmail.com", "nitanthapa425@gmail.com"],
//   subject: "My first system email",
//   html: `<h1>Hello world</h1>`,
// });

// the from part is responsible  to show

// if you want to attach file use below code

//to sendMail just call
// try {
//   await sendMail({
//     from: '"Fred Foo" <nitanthapa425@gmail.com>',
//     to: ["nitanthapa123@gmail.com", "sandeshbca5@arunima.edu.np"],
//     cc: ["ram@gmail.com"],
//     bcc: ["hari@gmail.com"],
////bcc is blind carbon copy
//     attachments: [
//   {
//     filename: 'example.pdf', // Replace with your desired filename
//     path: '/path/to/example.pdf' // Replace with the actual file path on your server
//   }
// ]
//     subject: "this is subject",
//     html: `<h1>Hello World<h1>`,
//   });
//   console.log("email is sent successfully");
// } catch (error) {}

// note from : is only  use to show the from information (ie not used to point the sender email sender email is point by the auth part)

// point to note

//   it is recommend to use  backtick

// login
//email
//password => app password

// to
// subject
//body