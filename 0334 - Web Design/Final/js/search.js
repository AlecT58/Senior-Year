function toggleLoader() {
    $('#loader').fadeToggle();
    $('#wrapper').fadeToggle();
}

function setupDataTables(table_list) {
    table_list.forEach(e => {
        e.DataTable({
            paging: false
        });
});
}

function resetTable(table) {
    table.DataTable().destroy();
    table.children('tbody').empty();
    table.fadeIn();
}

function search(media, term, entity, attribute, table) {
    const media_sanitized = "?media=" + sanitizeString(media);
    const term_sanitized = "&term=" + sanitizeString(term);
    const entity_sanitized = "&entity=" + sanitizeString(entity);
    const attribute_sanitized = "&attribute=" + sanitizeString(attribute);
    const limit = "&limit=200";
    const url = "https://itunes.apple.com/search" + media_sanitized + limit + entity_sanitized + attribute_sanitized + term_sanitized;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        cache: true,
        success: function(data) {
            resetTable(table);
        },
        complete: function (data) {
            JSON.parse(data.responseText).results.forEach(e => {
                displayResults(media, e);
            });
            setupDataTables([table]);
            toggleLoader();
        }
    });
}

function sanitizeString(value) {
    return value.replace(/[&?=]/g, '').replace(' ', '+').trim();
}

function displayResults(table, item) {
    if (table === 'music' && item.trackPrice >= 0) {
        $('#tblMusic tbody').append("<tr style='rgba(212, 212, 255, 0.035);'><td>" + item.trackName + "</td><td>" + item.artistName + "</td><td> " + item.collectionName + "</td><td>" + item.primaryGenreName + "</td><td>$" + item.trackPrice + "</td><td><audio controls><source src='" + item.previewUrl + "'></audio></td><td><i class='fa fa-shopping-cart'></i></td></tr>");
    }
    else if (table === 'tvShow' && item.trackPrice >= 0) {
        $('#tblTV tbody').append("<tr style='rgba(212, 212, 255, 0.035);'><td>" + item.trackName + "</td><td>" + item.collectionName + "</td><td>" + item.primaryGenreName + "</td><td>$" + item.trackPrice + "</td><td><video width='100' height='100' controls><source src='" + item.previewUrl + "'></video></td><td><i class='fa fa-shopping-cart'></i></td></tr>");
    }
    else if (table === 'movie' && item.trackPrice >= 0) {
        $('#tblMovie tbody').append("<tr style='rgba(212, 212, 255, 0.035);'><td>" + item.trackName + "</td><td>" + item.artistName + "</td><td>" + item.primaryGenreName + "</td><td>$" + item.trackPrice + "</td><td><video width='100' height='100' controls><source src='" + item.previewUrl + "'></video></td><td><i class='fa fa-shopping-cart'></i></td></tr>");
    }
}

function saveItemToDatabase(item, type) {
    let to_send = {};

    if (type === 'music') {
        to_send = {music: item};
    } 
    else if (type === 'tv') {
        to_send = {tv: item};
    }
    else if (type === 'movie') {
        to_send = {movie: item};
    }
    else {
        return false;
    }

    console.log(to_send);

    //$.ajax({
    //    type: "POST",
    //    url: 'http://www.alectrievel.com/schoolwork/CS0334/final/saveItem.php',
    //    dataType: "json",
    //    data: to_send,
    //    success: function(data) {
    //        console.log(data);
    //    }
    //});
}

$("#tblMusic").on('click', 'td i', function() {
    redirectIfNotLoggedIn();

    const row = $(this).parent().parent()[0];
    const music_data = {
        name: row.children[0].innerText,
        artist: row.children[1].innerText,
        album: row.children[2].innerText,
        genre: row.children[3].innerText,
        price: row.children[4].innerText,
        user_id: parseInt(window.localStorage.getItem('user_id'))
    }

    console.log(music_data);
    saveItemToDatabase(music_data, 'music');
});

$("#tblTV").on('click', 'td i', function() {
    redirectIfNotLoggedIn();

    const row = $(this).parent().parent()[0];
    const tv_data = {
        episode: row.children[0].innerText,
        show: row.children[1].innerText,
        genre: row.children[2].innerText,
        price: row.children[3].innerText,
        user_id: parseInt(window.localStorage.getItem('user_id'))
    }

    console.log(tv_data);
    saveItemToDatabase(tv_data, 'tv');
});

$("#tblMovie").on('click', 'td i', function() {
    redirectIfNotLoggedIn();

    const row = $(this).parent().parent()[0];
    const movie_data = {
        title: row.children[0].innerText,
        director: row.children[1].innerText,
        genre: row.children[2].innerText,
        price: row.children[3].innerText,
        user_id: parseInt(window.localStorage.getItem('user_id'))
    }

    console.log(movie_data);
    saveItemToDatabase(movie_data, 'movie');
});
