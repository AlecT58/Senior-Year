function getMessages() {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Your browser does not like AJAX!');
        return false;
    }

    httpRequest.onreadystatechange = function () {
        handlePoll(httpRequest);
    };
    httpRequest.open("GET", "/get_messages");
    httpRequest.send();
}

function handlePoll(httpRequest) {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            console.log(httpRequest.responseText);
            if(httpRequest.responseText === 'GTFO of this chatroom now please and thank you very kindly time to go') {
                window.location.href = '/join_chatroom'
            }
            else {
                const messages = JSON.parse(httpRequest.responseText);
                const table = document.getElementById('tblChatLog').getElementsByTagName('tbody')[0];
                const postedTime = new Date(Date.now() - 1000);
                const postedTimeString =  (postedTime.getMonth()+1) + "/" +  postedTime.getDate() + "/" + postedTime.getFullYear() + " " + postedTime.getHours() + ":" + postedTime.getMinutes() + ":" + postedTime.getSeconds();    
            
                for(var i = 0; i < messages.length; i++) {
                        let newRow = table.insertRow(table.rows.length);  
                        let messageCell = newRow.insertCell(0).appendChild(document.createTextNode(messages[i][1]));
                        let timeCell = newRow.insertCell(1).appendChild(document.createTextNode(postedTimeString));
                        let posterCell = newRow.insertCell(2).appendChild(document.createTextNode(messages[i][0]));     
                }
            }           
        } else {
            document.getElementById('ajaxError').style.display = 'block';
        }
    }
}