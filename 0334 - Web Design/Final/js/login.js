function logUserIn(username, password) {
    $.ajax({
        type: "POST",
        url: "http://www.alectrievel.com/schoolwork/CS0334/final/login.php",
        dataType: "application/json; charset=utf-8",
        data: "{username: " + username + ", password: " + password + "}",
        success: function (data) {

        },
        error: function(data) {

        },
        complete: function (data) {

        }
    });
}

function isLoggedIn() {
    if (window.localStorage.getItem('logged_in')) {
        return true;
    }
    else {
        return false;
    }
}

function redirectIfNotLoggedIn() {
    if (window.localStorage.getItem('logged_in')) {
        return true;
    }
    else {
        window.location.href = 'login.html';
    }
}