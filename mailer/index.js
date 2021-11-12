const nodemailer = require("nodemailer");

class MailerSend {

  constructor(message, of, pdf, res) {

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "edgar.edgarroman@gmail.com",
        pass: "usulyswwekwgmceu",
      },
    });

    var configurations = {
      from: "edgar.edgarroman@gmail.com",
      to: [       
        "karen.d@space.bar",
        "sgonzalez@americancotton.com.mx",
        "ecommerce@americancotton.com.mx",
        "amejia@americancotton.com.mx"
      ],
      subject: `PDF de ${of}`,
      text: message,
      html: `<div><span>Puedes descargar la carta porte en esta <a href="${pdf}">liga</a></span></div>`,
    };

    transporter.sendMail(configurations, (error, info) => {
      if (error) {
        res.json({ "message": error })
      } else {
        res.json({ "message": info })
      }
    });
  }
}

module.exports = MailerSend;
