const nodemailer = require('nodemailer');

// Configure your email service (Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send reminder email
const sendReminderEmail = async (email, jobDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Follow-up reminder: ${jobDetails.company} - ${jobDetails.role}`,
      html: `
        <h2>Job Application Follow-up Reminder</h2>
        <p>Hi,</p>
        <p>It's been ${jobDetails.daysAgo} days since you applied to:</p>
        <h3>${jobDetails.company} - ${jobDetails.role}</h3>
        <p><strong>Location:</strong> ${jobDetails.location}</p>
        <p><strong>Applied on:</strong> ${new Date(jobDetails.appliedDate).toLocaleDateString()}</p>
        <p><strong>Current Status:</strong> ${jobDetails.status}</p>
        ${jobDetails.notes ? `<p><strong>Notes:</strong> ${jobDetails.notes}</p>` : ''}
        <p>Consider following up with the recruiter or checking your application status.</p>
        <p>Good luck! 🚀</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Send interview reminder
const sendInterviewReminder = async (email, interviewDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Interview Reminder: ${interviewDetails.company}`,
      html: `
        <h2>Interview Reminder ⏰</h2>
        <p>Hi,</p>
        <p>You have an interview coming up!</p>
        <h3>${interviewDetails.company}</h3>
        <p><strong>Position:</strong> ${interviewDetails.role}</p>
        <p><strong>Interview Type:</strong> ${interviewDetails.type}</p>
        <p><strong>Date:</strong> ${new Date(interviewDetails.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${interviewDetails.time}</p>
        ${interviewDetails.link ? `<p><strong>Meeting Link:</strong> <a href="${interviewDetails.link}">${interviewDetails.link}</a></p>` : ''}
        <p>Prepare well and give your best! 💪</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Interview reminder sent to ${email}`);
  } catch (error) {
    console.error('Error sending interview reminder:', error);
  }
};

module.exports = {
  sendReminderEmail,
  sendInterviewReminder
};
