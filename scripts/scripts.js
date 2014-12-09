var URL_ADVERTISEMENTS = "https://api.parse.com/1/classes/Advertisement/";
var URL_POSTS = "https://api.parse.com/1/classes/Post/";
var URL_SECTIONS = "https://api.parse.com/1/classes/Section/";
var URL_TOPICS = "https://api.parse.com/1/classes/Topic/";

var HEADERS = {
	'X-Parse-Application-Id': 'NShcyWno2Uj50blkpsekNdhALQQHsj1tEn3S8FNM',
	'X-Parse-REST-API-Key': 'KejEFjfrcFil5R7i9Brk0hm07MC8i6nNmyyfnPmM'
}

var REGISTER_HTML_ADDRESSS = "http://files.parsetfss.com/8da9deb0-d635-4765-9fb1-67e0a9ce75bd/tfss-08b65838-0a8e-4fa9-839c-8b93175dfda9-register.html";
var LOGIN_HTML_ADDRES = "http://files.parsetfss.com/8da9deb0-d635-4765-9fb1-67e0a9ce75bd/tfss-10a28de7-7bcd-4828-8908-332538b37ca2-login.html";
var NEW_TOPIC_ADDRESS = "http://files.parsetfss.com/8da9deb0-d635-4765-9fb1-67e0a9ce75bd/tfss-2ad44d61-d3b2-4b81-9df8-2a07474d2442-newTopic.html";

var CONTENT;
var SECTION_CONTAINER;
var SECTIONS = [];

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
		CONTENT = $('#content');
		drawNavigation();
		//loadAdvertisement();

		function drawNavigation(){
			var navigation = $('#navigation');
			navigation.html('');
			drawHomePage();

			var home = $("<li class='active'><a href='#' id='home'><span>Home</span></a></li>");
			home.on('click',function () {
				$('.active').removeAttr('class');
				$(this).attr('class','active');
				drawHomePage();
				sessionStorage.setItem('currentPage','home');
			})
			navigation.append(home);

			if(!document.cookie){

				var login = $("<li><a href='#'><span>Login</span></a></li>");
				login.on('click',function () {
					drawLoginForm();
					$('.active').removeAttr('class');
					$(this).attr('class','active');
					sessionStorage.setItem('currentPage','login');
				})

				var register = $("<li><a href='#'><span>Register</span></a></li>");
				register.on('click',function () {
					drawRegisterForm();
					$('.active').removeAttr('class');
					$(this).attr('class','active');
					sessionStorage.setItem('currentPage','register');
				});

				navigation.append(login);
				navigation.append(register);
			}else{
				var post = $("<li><a href='#'><span>New topic</span></a></li>");
				post.on('click',function(){
					drawNewTopic();
					$('.active').removeAttr('class');
					$(this).attr('class','active');
					sessionStorage.setItem('currentPage','newTopic');
				});
				navigation.append(post);

				var profile = $("<li><a href='#'><span>Profile</span></a></li>");
				profile.on('click',function(){
					drawProfile();
					$('.active').removeAttr('class');
					$(this).attr('class','active');
					sessionStorage.setItem('currentPage','profile');
				});
				navigation.append(profile);

				var logout = $("<li><a href='#' class='logout'><span>Logout</span></a></li>");
				logout.on('click',function(){
					logOut();
				});
				navigation.append(logout);
			}
		}

		function drawHomePage(){
			if(!SECTION_CONTAINER){
				loadSections(true);
			}else{
				CONTENT.empty();
				SECTION_CONTAINER.appendTo(CONTENT);

				$('.topic-link').on('click',function(){
					var nameAndId = $(this).attr('id').split('-');

					drawPostFormsFromTopic(nameAndId[0],nameAndId[1]);
				});
			}
		}

		function logOut () {
			$.removeCookie('sessionToken');
			$.removeCookie("objectId");
			drawNavigation();
		}

		function drawNewTopic() {
			if(!sessionStorage.newTopic){
				$.get(NEW_TOPIC_ADDRESS, function(data) {
					CONTENT.html(data);
					$('#add-topic').on('click',addNewTopic);

					var topicCategorySelect = $('#topic-category');

					$.each(SECTIONS,function(__,section){
						var currentOption = $('<option>');
						currentOption.attr('value',section.objectId);
						currentOption.text(section.name);
						currentOption.appendTo(topicCategorySelect);
					});
				});
			}else{
				CONTENT.html(sessionStorage.newTopic);
				$('#add-topic').on('click',addNewTopic);
				var topicCategorySelect = $('#topic-category');

				$.each(SECTIONS,function(__,section){
					var currentOption = $('<option>');
					currentOption.attr('value',section.objectId);
					currentOption.text(section.name);
					currentOption.appendTo(topicCategorySelect);
				});
			}
		}

		function addNewTopic(){
			var topicName = $('#topic-name').val();
			var topicText = $('#topic-text').val();
			var topicCategoryId = $('#topic-category').val();

			var isCategoryExist = SECTIONS
			.map(function(s){return s.objectId})
			.indexOf(topicCategoryId) > -1;

			if (topicName.length < 8) {
				notify('error','The topic must have at least 8 symbols');
			}else if(topicText.length < 40){
				notify('error','The topic text must have at least 40 symbols');
			}else if(!isCategoryExist){
				notify('error','This category dont exists');
			}else{
				$.ajax({
					url: URL_TOPICS,
					type: "POST",
					headers: HEADERS,
					contentType:"application/json",
					data: JSON.stringify({
						name: topicName,
						section: {
							__type: "Pointer",
							className: "Section",
							objectId: topicCategoryId
						},
						fromUser: {
							__type: "Pointer",
							className: "_User",
							objectId: $.cookie('objectId')
						}
					}),
					success: function(data){
						addPost(data.objectId,topicText, function(){
							notify('success','Thank you for your post :)');
							loadSections(false);
							$('.active').removeAttr('class');
							$('#home').attr('class','active');
							drawHomePage();
						});
					},
					error: function(error){
						notify('error','I couldn\'t create new topic :(');
					}
				})
			}
		}

		function addPost(topicId,text,successFunction){
			$.ajax({
				url:URL_POSTS,
				type:"POST",
				headers:HEADERS,
				contentType:"application/json",
				data:JSON.stringify({
					text:text,
					fromUser:{
						__type:"Pointer",
						className:"_User",
						objectId: $.cookie('objectId')
					},
					topic:{
						__type:"Pointer",
						className:"Topic",
						objectId:topicId,
					}
				}),
				success:function(data){
					successFunction();
				},
				error:function(error){
					notify('error','I couldn\'t create your post :(');
				}
			})
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
				notify('error','Username or password is too short.');
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
						$.cookie("sessionToken",data.sessionToken, { expires: 1 });
						$.cookie("objectId",data.objectId);
						$('.active').removeAttr('class');
						$(this).attr('class','active');
						drawNavigation();
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
						drawNavigation();
					},
					error: function(eror){
						notify('error', 'I couldn\'t register you (You may be you need to pick another username)');
					}
				});
			}
		}

		function loadSections (async) {		
			$.ajax({
				url: URL_SECTIONS,
				type: 'GET',
				headers: HEADERS,
				async:async,
				success: function (data) {
					var sections = data.results;

					SECTION_CONTAINER = $('<div class="section-container">')
					SECTION_CONTAINER.appendTo(CONTENT);        			    			
					SECTIONS = [];

					$.each(sections, function (index, section) {
						var currentFeldSet = $('<fieldset class="section"></fieldset>');
						currentFeldSet.appendTo(SECTION_CONTAINER);

						var currentLegend = $('<legend>');
						currentLegend.text(section.name);
						currentLegend.appendTo(currentFeldSet);
						loadAndAppendTopicsToSection(currentFeldSet,section.objectId);
						SECTIONS.push(section);
					});        			
				},
				error: function (err) {
					notify('error', "Error occurred when loading sections :(");
				}
			});
		}

		function loadAndAppendTopicsToSection (parent,sectionId) { 
			$.ajax({
				url: URL_TOPICS,
				type: 'GET',
				headers: HEADERS,
				data: {
					'where':JSON.stringify({
						section:{
							__type:"Pointer",
							className: "Section",
							objectId: sectionId
						}
					}),
					'include':'fromUser',
					'order': 'createdAt'
				},
				success: function (data) {
					topics = data.results;

					$.each(topics, function (index, topic) {
						var nextTopic = $('<div class="topic"> </div>');
						nextTopic.appendTo(parent);

						var topicLink = $('<a href="#" class="topic-link">')
						.text(topic.name + '  ');
						topicLink.appendTo(nextTopic);
						topicLink.attr('id',topic.objectId + '-' + topic.name);
						topicLink.on('click',function(){
							drawPostFormsFromTopic(topic.objectId,topic.name);
						});

						var topicDetails = $('<p class="details"></p>');
						topicDetails.appendTo(nextTopic);

						var fromUser = $('<span>From: </span>');

						var spanFromUser = $('<span class="from-user"></span>');
						spanFromUser.text(topic.fromUser.username);
						spanFromUser.appendTo(fromUser);

						fromUser.appendTo(topicDetails);
						var createdAt = $('<span class="created-at">');

						var createdDate = getDateTimeForPrint(new Date(topic.createdAt));

						createdAt.text(' CreatedAt: ' + createdDate);
						createdAt.appendTo(topicDetails);

					});
				},
				error: function (err) {
					notify('error', 'Error occured when loading topics :(');
				}
			});
}

function loadAdvertisement() {	
	$.ajax({
		url: URL_ADVERTISEMENTS,
		type: 'GET',
		headers: HEADERS,
		success: function (data) {        			    			
			var adverts = data.results;
			var randomIndex = Math.floor((Math.random() * adverts.length)); 
			var currentAdvertLink = $('<a class="advertLink" href="'+ adverts[randomIndex].href +'" target="_blank"></a>');
			var currentAdvertImage = $('<img>').addClass('advert').attr('src', adverts[randomIndex].file.url).attr('height', '300');				
			currentAdvertImage.appendTo(currentAdvertLink);
			currentAdvertLink.appendTo(CONTENT);
			var hideAdvertButton = $('<button id="hideAdvertBtn"></button>').on('click', function() {				
				$('.advertLink').remove();
				$(this).remove();
			});
			hideAdvertButton.appendTo(CONTENT);				       			
		},
		error: function (err) {
			notify('error', "Error occurred while loading advertisement :(");
		}
	});
}

function getDateTimeForPrint(inputDate){
	var hours = inputDate.getHours();
	var minutes = inputDate.getMinutes();
	var seconds = inputDate.getSeconds();
	var date = inputDate.getDay();
	var month = inputDate.getMonth();
	var year = inputDate.getFullYear();

	var result =
	date + '.' + month + '.' + year + ' ' + 
	hours + ':' + minutes + ':' + seconds;

	return result;
}

function drawPostFormsFromTopic(topicId,topicName){
	$.ajax({
		url:URL_POSTS,
		type:"GET",
		headers:HEADERS,
		data: {
			'where':JSON.stringify({
				topic:{
					__type:"Pointer",
					className: "Topic",
					objectId: topicId
				}
			}),
			'include':'fromUser',
			'order': 'createdAt'
		},
		success: function (data){
			CONTENT.html('');
			var posts = data.results;

			var postContainer = $('<div class="post-container">');
			postContainer.appendTo(CONTENT);

			var headerTopic = $('<h1 class="topic-header">');
			headerTopic.text(topicName);
			headerTopic.appendTo(postContainer);

			$.each(posts, function(index, post) {
				var nextPost = $('<div class="post">');
				nextPost.text(post.text);
				nextPost.appendTo(postContainer);

				var postDetails = $('<p class="details"></p>');
				postDetails.appendTo(nextPost);

				var fromUser = $('<span>From: </span>');

				var spanFromUser = $('<span class="from-user"></span>');
				spanFromUser.text(post.fromUser.username);
				spanFromUser.appendTo(fromUser);

				fromUser.appendTo(postDetails);
				var createdAt = $('<span class="created-at">');

				var createdDate = getDateTimeForPrint(new Date(post.createdAt));

				createdAt.text(' CreatedAt: ' + createdDate);
				createdAt.appendTo(postDetails);

				var drawPostFormButtonContainer = $('<div class="add-post-container">');
				drawPostFormButtonContainer.appendTo(postDetails);

				if(document.cookie){
					var drawPostFormBtn = $('<a class="add-post">Add post</a>');
					drawPostFormBtn.on('click',function(){
						drawPostForm(topicId,topicName);
					});
					drawPostFormBtn.appendTo(drawPostFormButtonContainer);
				}

			});
		},
		error: function (){
			notify('error','Error occurred while loading posts in topic.')
		}
	})
}

		function drawPostForm(topicId,topicName){
			CONTENT.hide();

			var newPostContainer = $('<div class="new-post-container">');
			newPostContainer.appendTo($('.wrapper'));

			var closeButton = $('<a id="close-new-post-container">X</a>');
			closeButton.on('click',function(){
				newPostContainer.remove();
				CONTENT.show();
			})
			closeButton.appendTo(newPostContainer);

			var textArea = $('<textarea id="new-post-text" cols="30" rows="15"></textarea>');
			textArea.appendTo(newPostContainer);

			var addPostBtn = $('<a id="add-new-post">Post</a>');
			addPostBtn.on('click',function(){
				
				addPost(topicId,textArea.val(),function(){
					drawPostFormsFromTopic(topicId,topicName);
					notify('success','Thank you for your post :)');
					newPostContainer.remove();
					CONTENT.show();
				})
			});
			addPostBtn.appendTo(newPostContainer);

		}

	});

});