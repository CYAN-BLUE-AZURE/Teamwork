var HEADERS = {
	'X-Parse-Application-Id': 'NShcyWno2Uj50blkpsekNdhALQQHsj1tEn3S8FNM',
	'X-Parse-REST-API-Key': 'KejEFjfrcFil5R7i9Brk0hm07MC8i6nNmyyfnPmM'
}
var CONTENT;

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

	var REGISTER_HTML_ADDRESSS = "http://files.parsetfss.com/8da9deb0-d635-4765-9fb1-67e0a9ce75bd/tfss-08b65838-0a8e-4fa9-839c-8b93175dfda9-register.html";
	var LOGIN_HTML_ADDRES = "http://files.parsetfss.com/8da9deb0-d635-4765-9fb1-67e0a9ce75bd/tfss-10a28de7-7bcd-4828-8908-332538b37ca2-login.html";

	jQuery(document).ready(function($) {
		CONTENT = $('#content');
		drawNavigation();

		function drawNavigation(){
			var navigation = $('#navigation');

			var home = $("<li class='active'><a href='#'><span>Home</span></a></li>");
			home.on('click',function () {
				$('.active').removeAttr('class');
				$(this).attr('class','active');
				location.reload();
			})
			navigation.append(home);

			if(!document.cookie){

				var login = $("<li><a href='#'><span>Login</span></a></li>");
				login.on('click',function () {
					drawLoginForm();
					$('.active').removeAttr('class');
					$(this).attr('class','active');
				})

				var register = $("<li><a href='#'><span>Register</span></a></li>");
				register.on('click',function () {
					drawRegisterForm();
					$('.active').removeAttr('class');
					$(this).attr('class','active');
				});

				navigation.append(login);
				navigation.append(register);
			}else{
				var post = $("<li><a href='#'><span>Post</span></a></li>");
				post.on('click',function(){
					drawPost();
					$('.active').removeAttr('class');
					$(this).attr('class','active');
				});
				navigation.append(post);

				var profile = $("<li><a href='#'><span>Profile</span></a></li>");
				profile.on('click',function(){
					drawProfile();
					$('.active').removeAttr('class');
					$(this).attr('class','active');
				});
				navigation.append(profile);

				var logout = $("<li><a href='#' class='logout'><span>Logout</span></a></li>");
				logout.on('click',function(){
					logOut();
				});
				navigation.append(logout);
			}
		}

		function logOut () {
			$.removeCookie('sessionToken');
			location.reload();
		}

		function drawPost () {
			//TODO:
			console.log('Post')
		}

		function drawProfile () {
			//TODO:
			console.log('Profile');
		}

		function drawLoginForm(){
			if(!sessionStorage.loginHtml){
				$.get(LOGIN_HTML_ADDRES, function(data) {
					CONTENT.html(data);
					$('#submit-login').on('click',tryLoginUser);
					sessionStorage.setItem('loginHtml',data);
				});
			}else{
				CONTENT.html(sessionStorage.loginHtml);
				$('#submit-login').on('click',tryLoginUser);
			}
		}

		function tryLoginUser (argument) {
			var username = $('#login-username').val();
			var password = $('#login-password').val();

			if(username.length < 3 || password.length < 5){
				notify('error','Invalid username or password');
			}else{
				$.ajax({
					url: "https://api.parse.com/1/login",
					type: "GET",
					headers: HEADERS,
					data:
					{
						"username":username,
						"password":password
					},
					success: function(data){
						console.log(data)
						$.cookie("sessionToken",data.sessionToken, { expires: 1 })
						location.reload();
					},
					error: function(error){
						notify('error','Invalid username or password');
					}
				})
			}
		}

		function drawRegisterForm(){
			if(!sessionStorage.registerHtml){
				$.get(REGISTER_HTML_ADDRESSS, function(data) {
					CONTENT.html(data);
					$('#submit-register').on('click',registerNewUser);
					sessionStorage.setItem('registerHtml',data);
				});
			}else{
				CONTENT.html(sessionStorage.registerHtml);
				$('#submit-register').on('click',registerNewUser);
			}
		}

		function registerNewUser(){
			var rgxEmail = /([\w])+([\_\-\.\d\w])*@+([\w])+([\_\-\.\d\w])*(\.)+([\w]{2,})+/g;

			var username = $('#username').val();
			var email = $('#email').val();
			var password = $('#password').val();
			var rePassword = $('#re-password').val();
			var firstName = $('#first-name').val();
			var lastName = $('#last-name').val();

			if (!username || username.length < 3) {
				notify('error','The username must have at least 3 symbols');
			}else if(!email || !email.match(rgxEmail)){
				notify('error','Invalid email address. (The email must be a valid email address)');
			}else if(!password || !rePassword || password.length < 5 || password != rePassword){
				notify('error','Invalid password (The password must have at least 5 symbols.)')
			}else{
				$.ajax({
					url: "https://api.parse.com/1/users",
					type: "POST",
					headers: HEADERS,
					data: JSON.stringify(
					{
						username: username,
						password: password,
						email: email,
						firstName: firstName,
						lastName: lastName
					}),
					success: function(data){
						$.cookie("sessionToken",data.sessionToken, { expires: 1 });
						notify('success', 'You have successfully signed up');
						location.reload();
					},
					error: function(eror){
						notify('error', 'I couldn\'t register you (You may be you need to pick another username)');
					}
				});
			}
		}
	});

});