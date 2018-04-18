function isLoggedIn() {
    if (localStorage['logged_in']) {
        return true;
    } else {
        return false;
    }
}

function redirectIfNotLoggedIn() {
    if (localStorage['logged_in'] !== undefined && localStorage['logged_in'] !== null) {
        return true;
    } else {
        localStorage['logged_in'] = getParameterByName('id');

        if (localStorage['logged_in'] !== undefined && localStorage['logged_in'] !== null) {
            return true;
        } else {
            window.location.href = 'login.html';
        }
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}