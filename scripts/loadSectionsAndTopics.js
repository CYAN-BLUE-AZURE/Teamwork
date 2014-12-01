$(function () {
	var urlAdvertisements = "https://api.parse.com/1/classes/Advertisement/";
	var urlPosts = "https://api.parse.com/1/classes/Post/";
	var urlSections = "https://api.parse.com/1/classes/Section/";
	var urlTopics = "https://api.parse.com/1/classes/Topic/";
	var headers = {
		'X-Parse-Application-Id': 'NShcyWno2Uj50blkpsekNdhALQQHsj1tEn3S8FNM',
		'X-Parse-REST-API-Key': 'KejEFjfrcFil5R7i9Brk0hm07MC8i6nNmyyfnPmM'
	},
        posts = [],
        sections = [],
		topics = [];

		errorMessage = function (err, message) {
			alert(message + ': ' + err);
		},

        successMessage = function (message) {
        	alert(message);
        },

        loadSections = function () {		
        	$.ajax({
        		url: urlSections,
        		type: 'GET',
        		headers: headers,
        		success: function (data) {
        			var categoriesNav = $('#categories');        			    			
        			sections = data.results;

        			$.each(sections, function (index, section) {
        				var currentListItem = $('<li/>').addClass('section');
        				var currentLink = $('<a>').addClass('sectionLink').attr('href', '#').html(section.name).appendTo(currentListItem);
        				currentLink.data('sectionId', section.objectId);
        				currentListItem.appendTo(categoriesNav);        				
        			});        			
        		},
        		error: function (err) {
        			errorMessage(err.responseText, "Error occurred when loading sections");
        		}
        	});
        },

	    loadTopics = function (sectionId) { 
	    	$.ajax({
	    		url: urlTopics,
	    		type: 'GET',
	    		headers: headers,
	    		success: function (data) {
	    			topics = data.results;	    			
	    			var topicsDiv = $('#topics');
	    			topicsDiv.html('');

	    			$.each(topics, function (index, topic) {
	    				if (topic.section.objectId == sectionId) {	    					
	    				    var nextTopic = $('<div class="topic"> </div>');
	    				    var topicLink = $("<a href=\"#\">").text(topic.name + '  ');
	    				    $(topicLink).data('topic', topic);
	    				    topicLink.append(nextTopic);
	    				    $(topicLink).click(topicClicked);
	    				    topicsDiv.append(topicLink);

	    				}	    				
	    			});
	    		},
	    		error: function (err) {
	    			errorMessage(err, 'Error occured when loading topics');
	    		}
	    	});
	    },

        getSectionsById = function (sectionId) {        	
        	return sections.filter(function (sections) {
        		return sectionId == sections.objectId
        	});        	
        }

	$('#categories').on('click', 'li a', function (e) {
		loadTopics($(this).data('sectionId'));				             
	});

	function topicClicked() {
	    var topic = $(this).data('topic');
	    $("#posts").hide();
	    $("#topics").hide();
	    $("#posts h2").text(topic.name);
	    $("#posts h2").data('country', topic);
	    var topicId = topic.objectId;
	    $.ajax({
	        method: "GET",
	        headers: headers,
	        url: 'https://api.parse.com/1/classes/Post?where={"topic":{"__type":"Pointer","className":"Topic","objectId":"' + topicId + '"}}',
	        success: postsLoaded,
	        error: function (err) {
	            errorMessage(err, 'Error occured when loading posts');
	        }
	    });
	}

	function postsLoaded(data) {
	    $("#posts ul").html('');
	    for (var a in data.results) {
	        var post = data.results[a];
	        var postItem = $('<p>');
	        postItem.text(post.text + ' ');
	        postItem.appendTo($("#posts div"));
	    }
	    $('#posts').show();
	}


	loadSections();
});