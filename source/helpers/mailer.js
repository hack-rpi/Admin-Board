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
exports.confirmRegistration = function(doc, callback) {
	var template = __dirname + '/../views/email/register.jade',
		email = doc.email.address;
	fs.readFile(template, 'utf8', function(err, file) {
		if (err) {
			return callback(err, false);
		}
		var fn = jade.compile(file, { filename: template }),
			context = {
				name: 'Registrant',
				url: config.root_url + '/verify?id=' + doc._id + '&token=' + doc.token.token
			},
			html = fn(context),
			juiceOptions = {};
		juice.juiceResources(html, juiceOptions, function(err, html) {
			if (err) {
				return callback(err, false);
			}
			send(email, 'Confirmation Email', html, function(err, info) {
				if (err) {
					return callback(err, false);
				}
				return callback(null, true);
			});
		});
	});
}