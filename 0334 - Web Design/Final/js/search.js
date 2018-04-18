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
        to_send = {music: JSON.stringify(item)};
    } 
    else if (type === 'tv') {
        to_send = {tv: JSON.stringify(item)};
    }
    else if (type === 'movie') {
        to_send = {movie: JSON.stringify(item)};
    }
    else {
        return false;
    }

    console.log(to_send);

    $.ajax({
        type: "POST",
        url: 'http://www.alectrievel.com/schoolwork/CS0334/final/php/saveItem.php',
        data: to_send,
        success: function(data) {
            console.log(data);
            
            if(data === 'ok') {
                swal({
                    type: 'success',
                    title: 'Great!',
                    text: 'The selected item was saved to your cart',
                    footer: "<a href='cart.html'>View your cart here</a>"
                })
            }
            else {
                swal({
                    type: 'error',
                    title: 'Oh no!',
                    text: 'Something went wrong. Please try again.',
                })
            }
        }
    });
}