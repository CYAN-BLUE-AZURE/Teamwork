(function(){

	jQuery(document).ready(function($) {
		addEvents();

		function addEvents(){
			$('#submit').on('click',registerNewUser);
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
					method: "POST",
					headers: HEADERS,
					data: JSON.stringify(
					{
						username: username,
						password: password,
						email: email,
						firstName: firstName,
						lastName: lastName
					}),
					url: "https://api.parse.com/1/users"
				}).success(function(data){
					notify('success', 'You have successfully signed up');
				}).error(function() {
					notify('error', 'I couldn\'t register you (You may be you need to pick another username))');
				});

			}
		}
	});
})();