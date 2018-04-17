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

$("#tblMusic").on('click', 'td i', function() {
    redirectIfNotLoggedIn();

    const row = $(this).parent().parent()[0];
    const music_data = {
        name: row.children[0].innerText,
        artist: row.children[1].innerText,
        album: row.children[2].innerText,
        genre: row.children[3].innerText,
        price: row.children[4].innerText,
        user_id: parseInt(localStorage['logged_in'])
    }

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
        user_id: parseInt(localStorage['logged_in'])
    }

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
        user_id: parseInt(localStorage['logged_in'])
    }

    saveItemToDatabase(movie_data, 'movie');
});