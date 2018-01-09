let today = new Date();

function showGreeting(name) {
    const timeOfDay = today.getHours();
    let greeting = document.getElementById('displayGreeting');

    if (timeOfDay >= 4 && timeOfDay < 11) {
        greeting.innerText = "Good morning, " + name + "!";
    } else if (timeOfDay >= 11 && timeOfDay < 16) {
        greeting.innerText = "Good afternoon, " + name + "!";
    } else {
        greeting.innerText = "Good evening, " + name + "!";
    }
}

function showDate() {
    document.getElementById('displayDate').innerText = "Today's date is: " + (today.getMonth()+1) + '/' + today.getDate() + '/' +
        today.getFullYear();
}