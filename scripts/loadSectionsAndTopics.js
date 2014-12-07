// $(function () {
// 	var urlAdvertisements = "https://api.parse.com/1/classes/Advertisement/";
// 	var urlPosts = "https://api.parse.com/1/classes/Post/";
// 	var urlSections = "https://api.parse.com/1/classes/Section/";
// 	var urlTopics = "https://api.parse.com/1/classes/Topic/";

// 	jQuery(document).ready(function($) {
// 		// var posts = [],
// 		// sections = [],
// 		// topics = [];

// 		function errorMessage (err, message) {
// 			alert(message + ': ' + err);
// 		}

// 		function successMessage (message) {
// 			alert(message);
// 		}

// 		function loadSections () {		
// 			$.ajax({
// 				url: urlSections,
// 				type: 'GET',
// 				headers: HEADERS,
// 				success: function (data) {        			    			
// 					var sections = data.results;

// 					$.each(sections, function (index, section) {
// 						var currentFeldSet = $('<fieldset class="section"></fieldset>');
// 						currentFeldSet.appendTo(CONTENT);

// 						var currentLegend = $('<legend>');
// 						currentLegend.text(section.name);
// 						currentLegend.appendTo(currentFeldSet);
// 						loadAndAppendTopicsToSection(currentFeldSet,section.objectId);
// 					});        			
// 				},
// 				error: function (err) {
// 					notify('error', "Error occurred when loading sections");
// 				}
// 			});
// 		}

// 		function loadAndAppendTopicsToSection (parent,sectionId) { 
// 			$.ajax({
// 				url: urlTopics,
// 				type: 'GET',
// 				headers: HEADERS,
// 				data: {
// 					'where':JSON.stringify({
// 						section:{
// 							__type:"Pointer",
// 							className: "Section",
// 							objectId: sectionId
// 						}
// 					}),
// 					'include':'fromUser',
// 					'order': 'createdAt'
// 				},
// 				success: function (data) {
// 					topics = data.results;

// 					$.each(topics, function (index, topic) {
// 						var nextTopic = $('<div class="topic"> </div>');
// 						nextTopic.appendTo(parent);

// 						var topicLink = $("<a href=\"#\">").text(topic.name + '  ');
// 						topicLink.appendTo(nextTopic);
// 						topicLink.on('click',function(){
// 							drawPostsFromTopic(topic.objectId,topic.name);
// 						});

// 						var topicDetails = $('<p class="details"></p>');
// 						topicDetails.appendTo(nextTopic);

// 						var fromUser = $('<span>From: </span>');

// 						var spanFromUser = $('<span class="from-user"></span>');
// 						spanFromUser.text(topic.fromUser.username);
// 						spanFromUser.appendTo(fromUser);

// 						fromUser.appendTo(topicDetails);
// 						var createdAt = $('<span class="created-at">');

// 						var createdDate = getDateTimeForPrint(new Date(topic.createdAt));

// 						createdAt.text(' CreatedAt: ' + createdDate);
// 						createdAt.appendTo(topicDetails);

// 					});
// 				},
// 				error: function (err) {
// 					notify('error', 'Error occured when loading topics');
// 				}
// 			});
// 		}

// 		function loadAdvertisement() {	
// 			$.ajax({
// 				url: urlAdvertisements,
// 				type: 'GET',
// 				headers: HEADERS,
// 				success: function (data) {        			    			
// 					var adverts = data.results;
// 					var randomIndex = Math.floor((Math.random() * adverts.length)); 
// 					var currentAdvertLink = $('<a class="advertLink" href="'+ adverts[randomIndex].href +'" target="_blank"></a>');
// 					var currentAdvertImage = $('<img>').addClass('advert').attr('src', adverts[randomIndex].file.url).attr('height', '300');				
// 					currentAdvertImage.appendTo(currentAdvertLink);
// 					currentAdvertLink.appendTo(CONTENT);
// 					var hideAdvertButton = $('<button id="hideAdvertBtn"></button>').on('click', function() {				
// 						$('.advertLink').remove();
// 						$(this).remove();
// 					});
// 					hideAdvertButton.appendTo(CONTENT);				       			
// 				},
// 				error: function (err) {
// 					notify('error', "Error occurred while loading advertisement.");
// 				}
// 			});
// 		}

// 		function getDateTimeForPrint(inputDate){
// 			var hours = inputDate.getHours();
// 			var minutes = inputDate.getMinutes();
// 			var seconds = inputDate.getSeconds();
// 			var date = inputDate.getDay();
// 			var month = inputDate.getMonth();
// 			var year = inputDate.getFullYear();

// 			var result =
// 			date + '.' + month + '.' + year + ' ' + 
// 			hours + ':' + minutes + ':' + seconds;

// 			return result;
// 		}

// 		function drawPostsFromTopic(topicId,topicName){
// 			$.ajax({
// 				url:urlPosts,
// 				type:"GET",
// 				headers:HEADERS,
// 				data: {
// 					'where':JSON.stringify({
// 						topic:{
// 							__type:"Pointer",
// 							className: "Topic",
// 							objectId: topicId
// 						}
// 					}),
// 					'include':'fromUser',
// 					'order': '-createdAt'
// 				},
// 				success: function (data){
// 					CONTENT.html('');
// 					var posts = data.results;

// 					var postContainer = $('<div class="post-container">');
// 					postContainer.appendTo(CONTENT);

// 					var headerTopic = $('<h1 class="topic-header">');
// 					headerTopic.text(topicName);
// 					headerTopic.appendTo(postContainer);

// 					$.each(posts, function(index, post) {
// 						var nextPost = $('<div class="post">');
// 						nextPost.text(post.text);
// 						nextPost.appendTo(postContainer);

// 						var postDetails = $('<p class="details"></p>');
// 						postDetails.appendTo(nextPost);

// 						var fromUser = $('<span>From: </span>');

// 						var spanFromUser = $('<span class="from-user"></span>');
// 						spanFromUser.text(post.fromUser.username);
// 						spanFromUser.appendTo(fromUser);

// 						fromUser.appendTo(postDetails);
// 						var createdAt = $('<span class="created-at">');

// 						var createdDate = getDateTimeForPrint(new Date(post.createdAt));

// 						createdAt.text(' CreatedAt: ' + createdDate);
// 						createdAt.appendTo(postDetails);

// 						var addPostButtonContainer = $('<div class="add-post-container">');
// 						addPostButtonContainer.appendTo(postDetails);

// 						var addPostBtn = $('<a href="#" class="add-post">Add post</a>');
// 						addPostBtn.on('click',function(){
// 							addPost(topicId);
// 						});
// 						addPostBtn.appendTo(addPostButtonContainer);
// 					});
// 				},
// 				error: function (){
// 					notify('error','Error occurred while loading posts in topic.')
// 				}
// 			})
// 		}

// 		function addPost(topicId){
// 			//TODO:
// 			console.log(topicId);
// 		}

// 		loadSections();
// 		//loadAdvertisement();

// 	});
// });

