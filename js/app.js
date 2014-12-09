(function() {
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
    var PROFILE_HTML_ADDRES = "http://files.parsetfss.com/8da9deb0-d635-4765-9fb1-67e0a9ce75bd/tfss-cd3d54ca-352c-41be-bb04-bd25eb9c07b5-profile.html";
    var CONTENT;

    jQuery(document).ready(function($) {
        CONTENT = $('#content');
        showNavigationView();
        loadAdvertisement();
        //Sammy Navigation
        var app = $.sammy('#navigation', function() {
            this.get('#/', function() {
                showHomeView();
                $('.active').removeAttr('class');
                $('#nav-home').attr('class', 'active');
            })
            this.get('#/login', function() {
                showLoginView();
                $('.active').removeAttr('class');
                $('#nav-login').attr('class', 'active');
            })
            this.get('#/register', function() {
                showRegisterView();
                $('.active').removeAttr('class');
                $('#nav-register').attr('class', 'active');
            })
            this.get('#/newTopic', function() {
                showNewTopicView();
                $('.active').removeAttr('class');
                $('#nav-new-topic').attr('class', 'active');
            })
            this.get('#/profile', function() {
                showProfileView();
                $('.active').removeAttr('class');
                $('#nav-profile').attr('class', 'active');
            })
            this.get('#/logout', function() {
                logOut();
                showNavigationView();
                $(location).attr('href', '#/');
            })
            this.get('#/topics/:topicId', function(topicId) {
                $('.active').removeAttr('class');

                var path = decodeURIComponent(topicId.path);

                var arr1 = path.split('_');
                var arr2 = arr1[0].split('/');

                var name = arr1[1];
                var id = arr2[arr2.length - 1];
                showPostsFromTopicView(id, name);

            })
            this.get('', function() {
                showNotFoundView();
            })
        })
        app.run('#/');

        function showNavigationView() {
                var navigation = $('#navigation');
                navigation.html('');
                var home = $("<li id='nav-home'><a href='#/' id='nav-home'><span>Home</span></a></li>");
                navigation.append(home);

                if (!document.cookie) {
                    var login = $("<li id='nav-login'><a href='#/login' id='nav-login'><span>Login</span></a></li>");
                    var register = $("<li id='nav-register'><a href='#/register' id='nav-register'><span>Register</span></a></li>");
                    navigation.append(login);
                    navigation.append(register);
                } else {
                    var newTopic = $("<li id='nav-new-topic'><a href='#/newTopic'><span>New topic</span></a></li>");
                    var profile = $("<li id='nav-profile'><a href='#/profile'><span>Profile</span></a></li>");
                    var logout = $("<li><a href='#/logout' class='logout'><span>Logout</span></a></li>");
                    navigation.append(profile);
                    navigation.append(newTopic);
                    navigation.append(logout);
                }
            }
            //VIEWS
        function showHomeView() {
            CONTENT.empty();
            $.ajax({
                url: URL_SECTIONS,
                type: 'GET',
                headers: HEADERS,
                success: function(data) {
                    var sections = data.results;
                    sessionStorage.setItem('sections', JSON.stringify(sections));

                    $.each(sections, function(index, section) {
                        var currentFeldSet = $('<fieldset class="section"></fieldset>');
                        currentFeldSet.appendTo(CONTENT);

                        var currentLegend = $('<legend>');
                        currentLegend.text(section.name);
                        currentLegend.appendTo(currentFeldSet);
                        appendTopicsToSection(currentFeldSet, section.objectId);
                    });
                },
                error: function(err) {
                    notify('error', "Error occurred when loading sections :(");
                }
            });
        }

        function showPostsFromTopicView(topicId, topicName) {
            $.ajax({
                url: URL_POSTS,
                type: "GET",
                headers: HEADERS,
                data: {
                    'where': JSON.stringify({
                        topic: {
                            __type: "Pointer",
                            className: "Topic",
                            objectId: topicId
                        }
                    }),
                    'include': 'fromUser',
                    'order': 'createdAt'
                },
                success: function(data) {
                    CONTENT.empty();
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

                        if (document.cookie) {
                            var drawPostFormBtn = $('<a class="add-post">Add post</a>');
                            drawPostFormBtn.attr('href', '#/topics/' + topicId + '_' + topicName);
                            drawPostFormBtn.on('click', function() {
                                showNewPostView(topicId, topicName);
                            });
                            drawPostFormBtn.appendTo(drawPostFormButtonContainer);
                        }
                    });
                },
                error: function() {
                    notify('error', 'Error occurred while loading posts in topic.')
                }
            })
        }

        function showNotFoundView(){
            var notFound = $('<div class="notFound"><p>Page Not Found</p><p>No page could be found at this address.</p><p><a href="#/">Back to Home page</a></p></div>');
            CONTENT.empty();
            notFound.appendTo(CONTENT);
        }

        function showLoginView() {
            $.get(LOGIN_HTML_ADDRES, function(data) {
                CONTENT.html(data);
                $('#submit-login').on('click', tryLoginUser);
            });
        }

        function showRegisterView() {
            $.get(REGISTER_HTML_ADDRESSS, function(data) {
                CONTENT.html(data);
                $('#submit-register').on('click', registerNewUser);
            });
        }

        function showNewTopicView() {
            $.get(NEW_TOPIC_ADDRESS, function(data) {
                CONTENT.html(data);
                $('#add-topic').on('click', addNewTopic);
                var topicCategorySelect = $('#topic-category');
                var sections = JSON.parse(sessionStorage.sections);

                $.each(sections, function(__, section) {
                    var currentOption = $('<option>');
                    currentOption.attr('value', section.objectId);
                    currentOption.text(section.name);
                    currentOption.appendTo(topicCategorySelect);
                });
            });
        }

        function showNewPostView(topicId, topicName) {
            CONTENT.children().hide();

            var newPostContainer = $('<div class="new-post-container">');
            newPostContainer.appendTo(CONTENT);

            var closeButton = $('<a href="#" id="close-new-post-container">X</a>');
            closeButton.attr('href', '#/topics/' + topicId + '_' + topicName);
            closeButton.on('click', function() {
                newPostContainer.remove();
                CONTENT.children().show();
            })
            closeButton.appendTo(newPostContainer);

            var textArea = $('<textarea id="new-post-text" cols="30" rows="15"></textarea>');
            textArea.appendTo(newPostContainer);

            var addPostBtn = $('<a id="add-new-post">Post</a>');
            addPostBtn.attr('href', '#/topics/' + topicId + '_' + topicName);
            addPostBtn.on('click', function() {
                addPost(topicId, textArea.val(), function() {
                    showPostsFromTopicView(topicId, topicName);
                    notify('success', 'Thank you for your post :)');
                    newPostContainer.remove();
                    $(location).attr('href', '#/topics/' + topicId + '_' + topicName);
                    CONTENT.show();
                })
            });
            addPostBtn.appendTo(newPostContainer);
        }

        function showProfileView() {
            $.ajax({
                url: "https://api.parse.com/1/users/" + $.cookie('objectId'),
                type: "GET",
                headers: HEADERS,
                success: function(userInfo) {

                    $.get(PROFILE_HTML_ADDRES, function(data) {
                        CONTENT.html(data);
                        $('#profile-username').val(userInfo.username);
                        $('#profile-email').val(userInfo.email);
                        $('#profile-fname').val(userInfo.firstName);
                        $('#profile-lname').val(userInfo.lastName);
                        $('#profile-password-btn').on('click', function() {
                            if ($(this).text() == 'Change password') {
                                $(this).text('Don\'t change password');
                            } else {
                                $(this).text('Change password');
                            }

                            if ($('#change-password-container').css('display') == 'block') {
                                $('#change-password-container').hide();
                            } else {
                                $('#change-password-container').show();
                            }
                        });
                        $('#profile-update-submit').on('click', updateUserInfo);
                    })
                },
                error: function(error) {

                }
            })
        }

        function showNotFound() {}
            //REQUESTS
        function tryLoginUser() {
            var username = $('#login-username').val();
            var password = $('#login-password').val();
            if (username.length < 3 || password.length < 5) {
                notify('error', 'Invalid username or password');
            } else {
                $.ajax({
                    url: "https://api.parse.com/1/login",
                    type: "GET",
                    headers: HEADERS,
                    data: {
                        "username": username,
                        "password": password
                    },
                    success: function(data) {
                        $.cookie("sessionToken", data.sessionToken, {
                            expires: 1
                        });
                        $.cookie("objectId", data.objectId, {
                            expires: 1
                        });
                        $.cookie("password", password, {
                            expires: 1
                        });
                        showNavigationView();
                        $(location).attr('href', '#/');
                    },
                    error: function(error) {
                        notify('error', 'Invalid username or password');
                    }
                })
            }
        }

        function logOut() {
            $.removeCookie('sessionToken');
            $.removeCookie('objectId');
            $.removeCookie('password');
        }

        function registerNewUser() {
            var username = $('#username').val();
            var email = $('#email').val();
            var password = $('#password').val();
            var rePassword = $('#re-password').val();
            var firstName = $('#first-name').val();
            var lastName = $('#last-name').val();

            if (!username || username.length < 3) {
                notify('error', 'The username must have at least 3 symbols');
            } else if (!email || !isValidEmail(email)) {
                notify('error', 'Invalid email address. (The email must be a valid email address)');
            } else if (!password || !rePassword || password.length < 5 || password != rePassword) {
                notify('error', 'Invalid password (The password must have at least 5 symbols.)')
            } else {
                $.ajax({
                    url: "https://api.parse.com/1/users",
                    type: "POST",
                    headers: HEADERS,
                    data: JSON.stringify({
                        username: username,
                        password: password,
                        email: email,
                        firstName: firstName,
                        lastName: lastName
                    }),
                    success: function(data) {
                        $.cookie("sessionToken", data.sessionToken, {
                            expires: 1
                        });
                        $.cookie("objectId", data.objectId, {
                            expires: 1
                        });
                        $.cookie("password", password, {
                            expires: 1
                        });
                        notify('success', 'You have successfully signed up');
                        showNavigationView();
                        $(location).attr('href', '#/');
                    },
                    error: function(eror) {
                        notify('error', 'I couldn\'t register you (You may be you need to pick another username)');
                    }
                });
            }
        }

        function updateUserInfo() {
            var email = $('#profile-email').val();
            var isValidEmailAddres = isValidEmail(email)

            var username = $('#profile-username').val();
            var firstName = $('#profile-fname').val();
            var lastName = $('#profile-lname').val();

            var updateAndPassword = $('#change-password-container').css('display') == 'block';

            if (!username || username.length < 3) {
                notify('error', 'The username must have at least 3 symbols');
            } else if (!email || !isValidEmailAddres) {
                notify('error', 'Invalid email address. (The email must be a valid email address)');
            } else {
                var noErrors = true;

                if (updateAndPassword) {
                    var newPassword = $('#profile-new-password').val();
                    var newPasswordRetype = $('#profile-new-password-retype').val();

                    if (!newPassword || !newPasswordRetype || newPassword.length < 5 || newPassword != newPasswordRetype) {
                        notify('error', 'Invalid password (Passwords not mathc)');
                        noErrors = false;
                    } else {
                        updateUserPassword(newPassword);
                    }
                }

                if (noErrors) {
                    $.ajax({
                        url: "https://api.parse.com/1/users/" + $.cookie('objectId'),
                        type: "PUT",
                        headers: {
                            'X-Parse-Application-Id': 'NShcyWno2Uj50blkpsekNdhALQQHsj1tEn3S8FNM',
                            'X-Parse-REST-API-Key': 'KejEFjfrcFil5R7i9Brk0hm07MC8i6nNmyyfnPmM',
                            "X-Parse-Session-Token": $.cookie('sessionToken'),
                        },
                        contentType: "application/json",
                        data: JSON.stringify({
                            username: username,
                            email: email,
                            firstName: firstName,
                            lastName: lastName
                        }),
                    });
                }
            }
        }

        function updateUserPassword(newPassword) {
            $.ajax({
                url: "https://api.parse.com/1/users/" + $.cookie('objectId'),
                type: "PUT",
                headers: {
                    'X-Parse-Application-Id': 'NShcyWno2Uj50blkpsekNdhALQQHsj1tEn3S8FNM',
                    'X-Parse-REST-API-Key': 'KejEFjfrcFil5R7i9Brk0hm07MC8i6nNmyyfnPmM',
                    "X-Parse-Session-Token": $.cookie('sessionToken'),
                },
                contentType: "application/json",
                data: JSON.stringify({
                    password: newPassword
                }),
                success: function(feedback) {
                    notify('success', 'You have successfully updated your profile :)');
                },
                error: function() {
                    notify('error', 'I could not update your profile :( (may be this username is already taken from other user.)');
                }
            });
        }

        function appendTopicsToSection(parent, sectionId) {
            $.ajax({
                url: URL_TOPICS,
                type: 'GET',
                headers: HEADERS,
                data: {
                    'where': JSON.stringify({
                        section: {
                            __type: "Pointer",
                            className: "Section",
                            objectId: sectionId
                        }
                    }),
                    'include': 'fromUser',
                    'order': 'createdAt'
                },
                success: function(data) {
                    topics = data.results;
                    $.each(topics, function(index, topic) {
                        var nextTopic = $('<div class="topic"> </div>');
                        nextTopic.appendTo(parent);

                        var topicLink = $('<a class="topic-link">').text(topic.name + '  ');
                        topicLink.appendTo(nextTopic);
                        topicLink.attr('href', '#/topics/' + topic.objectId + '_' + encodeURI(topic.name));

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
                error: function(err) {
                    notify('error', 'Error occured when loading topics :(');
                }
            });
        }

        function addNewTopic() {
            var topicName = $('#topic-name').val();
            var topicText = $('#topic-text').val();
            var topicCategoryId = $('#topic-category').val();
            var sections = JSON.parse(sessionStorage.sections);
            var isCategoryExist = sections.map(function(s) {
                return s.objectId
            }).indexOf(topicCategoryId) > -1;
            if (topicName.length < 8) {
                notify('error', 'The topic must have at least 8 symbols');
            } else if (topicText.length < 40) {
                notify('error', 'The topic text must have at least 40 symbols');
            } else if (!isCategoryExist) {
                notify('error', 'This category dont exists');
            } else {
                $.ajax({
                    url: URL_TOPICS,
                    type: "POST",
                    headers: HEADERS,
                    contentType: "application/json",
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
                    success: function(data) {
                        addPost(data.objectId, topicText, function() {
                            notify('success', 'Thank you for your post :)');
                            $(location).attr('href', '#/');
                        });
                    },
                    error: function(error) {
                        notify('error', 'I couldn\'t create new topic :(');
                    }
                })
            }
        }

        function addPost(topicId, text, successFunction) {
            if (text.length < 40) {
                notify('error', 'The topic text must have at least 40 symbols');
            } else {
                $.ajax({
                    url: URL_POSTS,
                    type: "POST",
                    headers: HEADERS,
                    contentType: "application/json",
                    data: JSON.stringify({
                        text: text,
                        fromUser: {
                            __type: "Pointer",
                            className: "_User",
                            objectId: $.cookie('objectId')
                        },
                        topic: {
                            __type: "Pointer",
                            className: "Topic",
                            objectId: topicId,
                        }
                    }),
                    success: function(data) {
                        successFunction();
                    },
                    error: function(error) {
                        notify('error', 'I couldn\'t create your post :(');
                    }
                })
            }
        }

        function loadAdvertisement() {
            $.ajax({
                url: URL_ADVERTISEMENTS,
                type: 'GET',
                headers: HEADERS,
                success: function(data) {
                    var adverts = data.results;
                    var randomIndex = Math.floor((Math.random() * adverts.length));
                    var currentAdvertLink = $('<a class="advertLink" href="' + adverts[randomIndex].href + '" target="_blank"></a>');
                    var currentAdvertImage = $('<img>').addClass('advert').attr('src', adverts[randomIndex].file.url).attr('height', '300');
                    currentAdvertImage.appendTo(currentAdvertLink);
                    currentAdvertLink.appendTo(CONTENT);
                    var hideAdvertButton = $('<button id="hideAdvertBtn"></button>').on('click', function() {
                        $('.advertLink').remove();
                        $(this).remove();
                    });
                    hideAdvertButton.appendTo(CONTENT);
                },
                error: function(err) {
                    notify('error', "Error occurred while loading advertisement :(");
                }
            });
        }
    });

    function isValidEmail(email) {
        var rgxEmail = /([\w])+([\_\-\.\d\w])*@+([\w])+([\_\-\.\d\w])*(\.)+([\w]{2,})+/g;
        return email.match(rgxEmail);
    }

    function getDateTimeForPrint(inputDate) {
        var hours = inputDate.getHours();
        var minutes = inputDate.getMinutes();
        var seconds = inputDate.getSeconds();
        var date = inputDate.getDay();
        var month = inputDate.getMonth();
        var year = inputDate.getFullYear();
        var result = date + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
        return result;
    }

    function notify(type, message) {
        var sudoNotify = $('div#notificationContainer').sudoNotify({
            autoHide: true,
            showCloseButton: true,
            duration: 4,
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
            animation: {
                type: 'scroll-left-fade', //fade, scroll-left, scroll-left-fade, scroll-right, scroll-right-fade, slide, slide-fade or none, expand
                showSpeed: 600,
                hideSpeed: 1000
            },
            onClose: function() {
                $('div#notificationContainer').html('');
            },
        });
        switch (type) {
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
})();