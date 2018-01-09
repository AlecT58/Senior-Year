function postMessage(message) {
	var httpRequest = new XMLHttpRequest();
    
        if (!httpRequest) {
            alert('Your browser does not like AJAX!');
            return false;
        }
             
        httpRequest.open("POST", "/post_message");
        httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        let user = "{{session['user_id']}}";


        let data = JSON.stringify(
            {
                message: message
            }
        );

        //console.log(data);
        httpRequest.send(data);
}