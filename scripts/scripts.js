var HEADERS = {
	'X-Parse-Application-Id': 'NShcyWno2Uj50blkpsekNdhALQQHsj1tEn3S8FNM',
	'X-Parse-REST-API-Key': 'KejEFjfrcFil5R7i9Brk0hm07MC8i6nNmyyfnPmM'
}

function notify(type,message){

	var sudoNotify = $('div#notificationContainer').sudoNotify(
	{
		autoHide: true,
		showCloseButton: true,
		duration: 6,
		position: 'top',
		positionType: 'absolute',
		verticalMargin: '0px',
		log: true,
		opacity: 0.95,
		defaultStyle: {
			maxWidth: '1200px',
			fontSize: '18px'
		},
		errorStyle: {
			color: '#000000',
			backgroundColor: '#FF5050'
		},
		warningStyle: {
			color: '#000000',
			backgroundColor: '#FFFF96'
		},
		successStyle: {
			color: '#000000',
			backgroundColor: '#B8FF6D'
		},
		animation: 
		{
		    type: 'scroll-left-fade', //fade, scroll-left, scroll-left-fade, scroll-right, scroll-right-fade, slide, slide-fade or none, expand
			showSpeed: 600 ,
			hideSpeed: 1000
		},
			onClose: function() {
			$('div#notificationContainer').html('');
		},
	});
	switch(type){
		case 'success':
		sudoNotify.success(message);
		break;
		case 'warning':
		sudoNotify.warning(message);
		break;
		case 'error':
		sudoNotify.error(message);
		break;
	}
}

$(function () {

	jQuery(document).ready(function($) {
		drawNavigation();

		function drawNavigation(){

			if(!document.cookie){
				var navigation = $('.navigation');
				var home = $('<li><a href="index.html">Home</a></li>');
				var login = $('<li><a href="login.html">Login</a></li>');
				var register = $('<li><a class="register-tag" href="register.html">Register</a></li>');

				navigation.append(home);
				navigation.append(login);
				navigation.append(register);
			}else{
				//TODO:
			}
		}
	});

});