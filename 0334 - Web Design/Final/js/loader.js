function startLoader() {
    setTimeout(function () {
        $('#loader').fadeOut(250);
        $('#wrapper').fadeIn(250);
    }, 1500);
}

function toggleLoader() {
    $('#loader').fadeToggle();
    $('#wrapper').fadeToggle();
}

function loadMenuOptions() {
    if (isLoggedIn()) {
        $('#btnLogin').toggle();
        $('#btnRegister').toggle();
    }
    else {
        $('#btnViewCart').toggle();
        $('#btnLogout').toggle();
    }
}