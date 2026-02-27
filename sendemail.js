const nodemailer = require('nodemailer');

// create and export a transporter instance that can be reused
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER || 'consultmindora@gmail.com',
    pass: process.env.EMAIL_PASS || 'dtjb lnzg bfex fwcp'
  }
});

// optional helper function to send mail using this transporter
async function sendMail({ from, to, subject, text, html }) {
  const mailOptions = { from, to, subject, text, html };
  return transporter.sendMail(mailOptions);
}

module.exports = {
  transporter,
  sendMail
};

// Example usage (uncomment to run):
(async () => {
  try {
    const info = await sendMail({
      from: 'consultmindora@gmail.com',
      to: 'hellorblend@gmail.com',
      subject: 'hi',
      text: 'hello',
      html: '<p>This is a <strong>sample</strong> HTML message.</p>'
    });
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  }
})();
