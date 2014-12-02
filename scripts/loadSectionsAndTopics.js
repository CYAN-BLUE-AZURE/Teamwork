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
        			var categoriesNav = $('#sections');        			    			
        			sections = data.results;

        			$.each(sections, function (index, section) {
        				var currentListItem = $('<li/>').addClass('section');
        				var currentLink = $('<a>').addClass('sectionLink').attr('href', '#').html(section.name).appendTo(currentListItem);
        				currentLink.data('sectionId', section.objectId);
        				$(currentLink).click(sectionClicked);
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

    //ADD FUNCTIONS
	$('#addCategoryBtn').on('click', function () {
	    var $categoryName = $('#addCategory').val();
	    if (/^\s*$/.test($categoryName)) {
	        
	       //TODO validation
	        
	        return;
	    }
	    addCategory($categoryName);
	    $('#addCategory').val('');
	});

	function addCategory(category) {
	    var categoryName = formatString(category);

	    $.ajax({
	        method: "POST",
	        headers: headers,
	        url: urlSections,
	        data: JSON.stringify({
	            "name": categoryName
	        }),
	        contentType: "application/json",
	        success: [sectionCleaned(),loadSections()],
	        error: function (err) {
	            errorMessage(err, 'Error occured when loading sections');
	        }
	    });
	}

	$('#addTopicBtn').on('click', function () {
	    var $topicName = $('#addTopic').val();
	    if (/^\s*$/.test($topicName)) {
	        //addEmptyItemError();
            //TODO validation
	        return;
	    }
	    addTopic($topicName);
	    $('#addTopic').val('');
	});

	function addTopic(topic) {
	    var topicName = formatString(topic);
	    var section = $('#topics h2').data('section');

	    $.ajax({
	        method: "POST",
	        headers: headers,
	        url: urlTopics,
	        data: JSON.stringify({
	            "name": topicName,
	            'section': {
	                "__type": "Pointer",
	                "className": "Section",
	                "objectId": section.objectId
	            }
	        }),
	        contentType: "application/json",
	        success: [topicCleaned(), loadTopics()],
	        error: function (err) {
	            errorMessage(err, 'Error occured when loading topics');
	        }
	    });
	}

	function sectionClicked() {
	    var topic = $(this).data('section');
	    $("#posts").hide();
	    $("#topicsMain").show();
	    
	}

    //Functions for cleaning and refreshing
	function sectionCleaned() {
	    $("#sections").empty();
	}
	function topicCleaned() {
	    $("#topics").empty();
	}

	function topicClicked() {
	    var topic = $(this).data('topic');
	    $("#posts").hide();
	    $("#topicsMain").hide();
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
	    $("#posts div").html('');
	    for (var a in data.results) {
	        var post = data.results[a];

	        //showing the username

            //showing the text of the post
	        var postItem = $('<p>');
	        postItem.text(post.text + ' ');

	        //showing the date of update
	        var postDate = $('<p>');
	        var currentDate = post.createdAt;
	        var date = $.format.prettyDate(currentDate);
	        postDate.text(date + ' ');

	        postItem.appendTo($("#posts div"));
	        postDate.appendTo($("#posts div"));
	    }

        //date, text, username
	    $('#posts').show();
	}

	function formatString(string) {
	    var trimmed = string.trim();
	    return trimmed.charAt(0).toUpperCase() + string.slice(1);
	}

	loadSections();
});