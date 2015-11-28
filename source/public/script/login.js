var $;
var Forms;

// $('form.login').on('submit', function(event) {
// 	event.preventDefault();
// 	var $form = $('form.login'),
// 		username = $form.find('input[name="username"]').val(),
// 		password = Forms.hashPassword( $form.find('input[name="password"]').val() );
// 	$.post('/login?username=' + username + '&password' + password)
// 	  .always(function() {
// 		console.log('request sent.');
// 	}).fail(function(e) {
// 		console.log('error');
// 		console.log(e);
// 	}).success(function(res) {
// 		console.log('success');
// 		console.log(res);
// 	});
// });