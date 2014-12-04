
(function() {
    $(function() {
        var email = $('#email').val();
        var password = $('#password').val();
        var firstName = $('#first-name').val();
        var lastName = $('#last-name').val();

        // clear existing items and load new data
        $('#userInfo').remove();

        // get the user info which should be displayed form the data attribute 
        // of the user div heading 
        var country = $('#towns h1').data('country');
        $('#towns h1').text(country.name);

        var userID = country.objectId;

        $.ajax({
            method: "GET",
            headers: HEADERS,
            data: JSON.stringify(
            {
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName
            }),
            url: "https://api.parse.com/1/users"
        }).success(function(data){
            notify('success', 'You have successfully login');
            usersLoaded();
        }).error(function() {
            notify('error', 'Data is wrong, please check your credentials');
        });
    }

            // draw users on the page
    function usersLoaded(data) {
        for (var t in data.results) {
            var user = data.results[t];
            var userItem = $('<li>').attr('class', 'user-item');
            $(userItem).data('user', user);
            
            // apend town list item to the town list
            userItem.appendTo($("#usersInfo"));
        }
    }
    

}());