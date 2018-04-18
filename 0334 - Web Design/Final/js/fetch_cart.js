function getSongsInCart() {
    $.ajax({
        type: "GET",
        url: "http://www.alectrievel.com/schoolwork/CS0334/final/php/loadCart.php?type=music&user_id=" + localStorage['logged_in'],
        dataType: "application/json; charset=UTF8;",
        cache: true,
        success: function (data) {
            resetTable($('#tblMusic'));
        },
        complete: function (data) {
            resetTable($('#tblMusic'));
            JSON.parse(data.responseText).forEach(e => {
                displayCartResults('music', e);
            });
            setupDataTables([$('#tblMusic')]);
        }
    });
}

function getMoviesInCart() {
    $.ajax({
        type: "GET",
        url: "http://www.alectrievel.com/schoolwork/CS0334/final/php/loadCart.php?type=movie&user_id=" + localStorage['logged_in'],
        dataType: "application/json; charset=UTF8;",
        cache: true,
        success: function (data) {
            resetTable($('#tblMovie'));
        },
        complete: function (data) {
            resetTable($('#tblMovie'));
            JSON.parse(data.responseText).forEach(e => {
                displayCartResults('movie', e);
            });
            setupDataTables([$('#tblMovie')]);
        }
    });
}

function getTVInCart() {
    $.ajax({
        type: "GET",
        url: "http://www.alectrievel.com/schoolwork/CS0334/final/php/loadCart.php?type=tv&user_id=" + localStorage['logged_in'],
        dataType: "application/json; charset=UTF8;",
        cache: true,
        success: function (data) {
            resetTable($('#tblTV'));
        },
        complete: function (data) {
            resetTable($('#tblTV'));
            JSON.parse(data.responseText).forEach(e => {
                displayCartResults('tv', e);
            });
            setupDataTables([$('#tblTV')]);
        }
    });
}

function displayCartResults(table, unparsed_item) {
    const item = JSON.parse(unparsed_item);

    if (item !== null) {
        if (table === 'music') {
            $('#tblMusic tbody').append("<tr style='rgba(212, 212, 255, 0.035);'><td>" + item.name + "</td><td> " + item.artist + "</td><td>" + item.album + "</td><td>$" + item.price + "</td></tr>");
        } else if (table === 'tv') {
            $('#tblTV tbody').append("<tr style='rgba(212, 212, 255, 0.035);'><td>" + item.name + "</td><td>" + item.episode + "</td><td>" + item.genre + "</td><td>$" + item.price + "</td></tr>");
        } else if (table === 'movie') {
            $('#tblMovie tbody').append("<tr style='rgba(212, 212, 255, 0.035);'><td>" + item.name + "</td><td>" + item.director + "</td><td>" + item.genre + "</td><td>$" + item.price + "</td></tr>");
        }
    }
}