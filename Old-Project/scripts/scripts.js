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
        			var loginLink = $('#login-link');
        			//loginLink.css('background', '#99FF99');
        			//alert('I'm in load sections');
        			sections = data.results;

        			$.each(sections, function (index, section) {
        				var currentListItem = $('<li/>').addClass('section');
        				var currentLink = $('<a>').addClass('sectionLink').attr('href', '#').html(section.name).appendTo(currentListItem);
        				currentLink.data('sectionId', section.objectId);
        				currentListItem.insertBefore(loginLink);
        				//console.log(section.objectId);
        			});        			
        		},
        		error: function (err) {
        			errorMessage(err.responseText, "Error occurred when loading sections");
        		}
        	});
        },

	    loadTopics = function (sectionId) { // Doesn't work yet: TODO
	    	$.ajax({
	    		url: urlTopics,
	    		type: 'GET',
	    		headers: headers,
	    		success: function (data) {
	    			topics = data.results;
	    			var selectedTopics = topics.filter(function (section) {
	    				return section.objectId == sectionId;
	    			}),

	                postsList = $('.posts');
	    			postsList.html(''); // Delete previous posts

	    			$.each(selectedTopics, function (index, topic) {
	    				console.log(JSON.stringify(topic));	    				
	    			});
	    		},
	    		error: function (err) {
	    			errorMessage(err, 'Error occured when loading topics');
	    		}
	    	});
	    },


        getSectionsById = function (sectionId) {        	
        	return sections.filter(function (sections) {
        		return sectionId == sections.objectId;
        	});
        	
        }

	$('.navigation').on('click', 'li a', function (e) {
		loadTopics($(this).data('sectionId'));		
		console.log($(this).data('sectionId'));                
	});	

	loadSections();
});