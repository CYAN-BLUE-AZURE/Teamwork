$(function () {
	var urlAdvertisements = "https://api.parse.com/1/classes/Advertisement/";
	var urlPosts = "https://api.parse.com/1/classes/Post/";
	var urlSections = "https://api.parse.com/1/classes/Section/";
	var urlTopics = "https://api.parse.com/1/classes/Topic/";

	jQuery(document).ready(function($) {
		// var posts = [],
		// sections = [],
		// topics = [];

		function errorMessage (err, message) {
			alert(message + ': ' + err);
		}

		function successMessage (message) {
			alert(message);
		}

		function loadSections () {		
			$.ajax({
				url: urlSections,
				type: 'GET',
				headers: HEADERS,
				success: function (data) {        			    			
					var sections = data.results;

					$.each(sections, function (index, section) {
						var currentFeldSet = $('<fieldset class="section"></fieldset>');
						currentFeldSet.appendTo(CONTENT);

						var currentLegend = $('<legend>');
						currentLegend.text(section.name);
						currentLegend.appendTo(currentFeldSet);
						loadAndAppendTopicsToSection(currentFeldSet,section.objectId);
					});        			
				},
				error: function (err) {
					errorMessage(err.responseText, "Error occurred when loading sections");
				}
			});
		}

		function loadAndAppendTopicsToSection (parent,sectionId) { 
			$.ajax({
				url: urlTopics,
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

						var topicLink = $("<a href=\"#\">").text(topic.name + '  ');
						topicLink.appendTo(nextTopic);
						topicLink.on('click',function(){
							drawPostsFromTopic(topic.objectId,topic.name);
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
					errorMessage(err, 'Error occured when loading topics');
				}
			});
}

function loadAdvertisement() {	
	$.ajax({
		url: urlAdvertisements,
		type: 'GET',
		headers: HEADERS,
		success: function (data) {        			    			
			var adverts = data.results;
			var randomIndex = Math.floor((Math.random() * adverts.length)); 
			var currentAdvertLink = $('<a class="addvertLink" href="#"></a>');
			currentAdvertLink.appendTo(CONTENT);
			var currentAdvertImage = $('<img>').addClass('advert').attr('src', adverts[randomIndex].file.url).attr('height', '300');				
			currentAdvertImage.appendTo(currentAdvertLink);
			console.log(adverts[randomIndex].file.url);			       			
		},
		error: function (err) {
			errorMessage(err.responseText, "Error occurred while loading advertisement.");
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

function drawPostsFromTopic(topicId,topicName){
	$.ajax({
		url:urlPosts,
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
			'order': '-createdAt'
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

				var addPostButtonContainer = $('<div class="add-post-container">');
				addPostButtonContainer.appendTo(postDetails);

				var addPostBtn = $('<a href="#" class="add-post">Add post</a>');
				addPostBtn.on('click',function(){
					addPost(topicId);
				});
				addPostBtn.appendTo(addPostButtonContainer);
			});
		},
		error: function (){

		}
	})
}

function addPost(topicId){
	//TODO:
	console.log(topicId);
}

		// function getSectionsById (sectionId) {        	
		// 	return sections.filter(function (sections) {
		// 		return sectionId == sections.objectId
		// 	});        	
		// }

		// $('#categories').on('click', 'li a', function (e) {
		// 	loadTopics($(this).data('sectionId'));				             
		// });

    //ADD FUNCTIONS
 //    $('#addCategoryBtn').on('click', function () {
 //    	var $categoryName = $('#addCategory').val();
 //    	if (/^\s*$/.test($categoryName)) {

	//        //TODO validation

	//        return;
	//    }
	//    addCategory($categoryName);
	//    $('#addCategory').val('');
	// });

    // function addCategory(category) {
    // 	var categoryName = formatString(category);

    // 	$.ajax({
    // 		method: "POST",
    // 		headers: HEADERS,
    // 		url: urlSections,
    // 		data: JSON.stringify({
    // 			"name": categoryName
    // 		}),
    // 		contentType: "application/json",
    // 		success: [sectionCleaned(),loadSections()],
    // 		error: function (err) {
    // 			errorMessage(err, 'Error occured while loading sections');
    // 		}
    // 	});
    // }

    // $('#addTopicBtn').on('click', function () {
    // 	var $topicName = $('#addTopic').val();
    // 	if (/^\s*$/.test($topicName)) {
	   //      //addEmptyItemError();
    //         //TODO validation
    //         return;
    //     }
    //     addTopic($topicName);
    //     $('#addTopic').val('');
    // });

    // function addTopic(topic) {
    // 	var topicName = formatString(topic);
    // 	var section = $('#topics h2').data('section');

    // 	$.ajax({
    // 		method: "POST",
    // 		headers: HEADERS,
    // 		url: urlTopics,
    // 		data: JSON.stringify({
    // 			"name": topicName,
    // 			'section': {
    // 				"__type": "Pointer",
    // 				"className": "Section",
    // 				"objectId": section.objectId
    // 			}
    // 		}),
    // 		contentType: "application/json",
    // 		success: [topicCleaned(), loadTopics()],
    // 		error: function (err) {
    // 			errorMessage(err, 'Error occured while loading topics');
    // 		}
    // 	});
    // }

    // function sectionClicked() {
    // 	var topic = $(this).data('section');
    // 	$("#posts").hide();
    // 	$("#topicsMain").show();

    // }

    //Functions for cleaning and refreshing
    // function sectionCleaned() {
    // 	$("#sections").empty();
    // }
    // function topicCleaned() {
    // 	$("#topics").empty();
    // }

    // function topicClicked() {
    // 	var topic = $(this).data('topic');
    // 	$("#posts").hide();
    // 	$("#topicsMain").hide();
    // 	$("#posts h2").text(topic.name);
    // 	$("#posts h2").data('country', topic);
    // 	var topicId = topic.objectId;
    // 	$.ajax({
    // 		method: "GET",
    // 		headers: HEADERS,
    // 		url: 'https://api.parse.com/1/classes/Post?where={"topic":{"__type":"Pointer","className":"Topic","objectId":"' + topicId + '"}}',
    // 		success: postsLoaded,
    // 		error: function (err) {
    // 			errorMessage(err, 'Error occured while loading posts');
    // 		}
    // 	});
    // }

    // function postsLoaded(data) {
    // 	$("#posts div").html('');
    // 	for (var a in data.results) {
    // 		var post = data.results[a];

	   //      //showing the username

    //         //showing the text of the post
    //         var postItem = $('<p>');
    //         postItem.text(post.text + ' ');

	   //      //showing the date of update
	   //      var postDate = $('<p>');
	   //      var currentDate = post.createdAt;
	   //      var date = $.format.prettyDate(currentDate);
	   //      postDate.text(date + ' ');

	   //      postItem.appendTo($("#posts div"));
	   //      postDate.appendTo($("#posts div"));
	   //  }

    //     //date, text, username
    //     $('#posts').show();
    // }

    // function formatString(string) {
    // 	var trimmed = string.trim();
    // 	return trimmed.charAt(0).toUpperCase() + string.slice(1);
    // }

    loadSections();
	//loadAdvertisement();
});
});