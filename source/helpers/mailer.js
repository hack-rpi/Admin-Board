var nodemailer = require('nodemailer'),
	jade = require('jade'),
	juice = require('juice'),
	fs = require('fs'),
	config = require('../config');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: config.email.address,
		pass: config.email.password
	}
});

/**
 * 
 */
function send(recipients, subject, content, callback) {
	var mailOptions = {
		from: config.email.from,
		to: recipients,
		replyTo: config.email.replyTo,
		subject: subject,
		html: content
	}
	transporter.sendMail(mailOptions, callback);
}

/**
 * 
 */
exports.confirmRegistration = function(req, res, email) {
	var template = __dirname + '/../views/email/register.jade';
	fs.readFile(template, 'utf8', function(err, file) {
		if (err) {
			return res.send('error');
		}
		var fn = jade.compile(file, { filename: template }),
			context = {
				name: 'Registrant',
				url: 'https://google.com'
			},
			html = fn(context),
			juiceOptions = {};
		juice.juiceResources(html, juiceOptions, function(err, html) {
			if (err) {
				return res.send('error');
			}
			send(email, 'Confirmation Email', html, function(err, info) {
				if (err) {
					req.flash('error', 'Failed to send verification email.');
				}
				req.flash('success', 'Verification email sent.');
			});
		});
	});
}