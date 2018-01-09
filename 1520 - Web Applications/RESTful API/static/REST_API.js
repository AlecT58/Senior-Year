/* Main REST API AJAX calls for /cats */
function getAllCategories() {
    var httpRequest = new XMLHttpRequest();
    
    if (!httpRequest) {
        alert('Your browser does not like AJAX!');
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {            
            logHttpResult(this.responseText, this.status, "Executed GET request to retrive all category data with the following response: ");
            console.log('--------------------------------------------------------------------------------');
            clearTableContent();
            clearDropdownContent();
            fillTableContent(this.responseText);
            fillDropdownContent(this.responseText);
        }
    };

    httpRequest.open("GET", "/cats");
    httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    httpRequest.send();
}

function getSpecificCategory(catID) {
    var httpRequest = new XMLHttpRequest();
    
    if (!httpRequest) {
        alert('Your browser does not like AJAX!');
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {            
            logHttpResult(this.responseText, this.status, "Executed GET request to retrive specific category data with the following response: ");
        }
        else if (this.readyState == 4 && this.status == 404) {
            logHttpResult(this.responseText, this.status, "There was an error preforming the GET request. There respource does not exist!.");
        }
        // else {
        //     logHttpResult(this.responseText, this.status, "There was an error preforming the GET request.");
        // }
    };

    httpRequest.open("GET", "/cats");
    httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    httpRequest.send();
}

function postNewCategory(name, spendingLimit) {
    var httpRequest = new XMLHttpRequest();
   
        if (!httpRequest) {
            alert('Your browser does not like AJAX!');
            return false;
        }

        httpRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {            
                logHttpResult(this.responseText, this.status, "POSTed new category with the following details: ");
                displayStatusAlert('categoryHttpSuccess', 'categoryHttpSuccessMessage', 'New category was posted');
                getAllPurchases();
                getAllCategories();
            }
            else if (this.readyState == 4 && this.status == 409) {
                logHttpResult(this.responseText, this.status, "There was a conflict in POSTing the new request the following details: ");
                displayStatusAlert('categoryHttpError', 'categoryHttpErrorMessage', JSON.parse(this.responseText).error);  
                getAllPurchases();
                getAllCategories();            
            }
            // else {
            //     logHttpResult(this.responseText, this.status, "There was an error executing the POST request.");
            // }
        }
             
        httpRequest.open("POST", "/cats");
        httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        const newCategory = JSON.stringify(
            {
                type: name,
                limit: spendingLimit
            }
        );

        httpRequest.send(newCategory);  
}

function deleteCategory(catID, catName) {
    var httpRequest = new XMLHttpRequest();
    
    if (!httpRequest) {
        alert('Your browser does not like AJAX!');
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            logHttpResult(this.responseText, this.status, "DELETEed category with the following details: ");
            displayStatusAlert('categoryHttpDelete', 'categoryDeleteMessage', "Category: '" + JSON.parse(this.responseText).deleted + "' was deleted");
            getAllPurchases();
            getAllCategories();
        }
    }
             
    httpRequest.open("DELETE", "/cats/" + catID);
    httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    httpRequest.send();
}

/* Main REST API AJAX calls for /purchases */
function postNewPurchase(description, amount, catID, datePurchased) {
    var httpRequest = new XMLHttpRequest();
    
         if (!httpRequest) {
             alert('Your browser does not like AJAX!');
             return false;
         }
 
         httpRequest.onreadystatechange = function() {
             if (this.readyState == 4 && this.status == 201) {            
                 logHttpResult(this.responseText, this.status, "POSTed new purchase with the following details: ");
                 displayStatusAlert('purchaseRecorded', 'purchaseRecordedMessage', 'New purchase was posted');
                 document.getElementById('lblForPurchaseCategory').innerText = '';
                 getAllPurchases();
                 getAllCategories();
             }
             else if (this.readyState == 4 && this.status == 404) {
                 logHttpResult(this.responseText, this.status, "There was a conflict in POSTing the new purchase the following details: ");
                 getAllPurchases();
                 getAllCategories();              
             }
         }
              
         httpRequest.open("POST", "/purchases");
         httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
 
         const newPurchase = JSON.stringify(
             {
                 category_id: catID,
                 description: description,
                 date: datePurchased,
                 amount_spent: amount
             }
         );
 
         httpRequest.send(newPurchase); 
}

function getAllPurchases() {
    var httpRequest = new XMLHttpRequest();
    
    if (!httpRequest) {
        alert('Your browser does not like AJAX!');
        return false;
    }

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {            
            logHttpResult(this.responseText, this.status, "Executed GET request to retrive all purchase data with the following response: ");
        }
    };

    httpRequest.open("GET", "/purchases");
    httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    httpRequest.send();
}

/* Helper functions */
function determineCategoryToDelete() {
    document.getElementById('lblForPurchaseCategory').innerText = '';
    deleteCategory(this.id.match(/\d+/), this.innerText);
    this.style.display = 'none';
    document.getElementById('to_assign: ' + this.id.match(/\d+/)).style.display = 'none';
}

function determineCategegoryToAssign() {
    document.getElementById('lblForPurchaseCategory').innerText = "You selected: " + this.innerText;
    sessionStorage.setItem('categoryID', this.id.match(/\d+/));
}

function displayStatusAlert(alertID, alertTextID, text) {
    document.getElementById(alertID).style.display = 'block';
    document.getElementById(alertTextID).innerText = text;

    window.setTimeout(function () { 
        document.getElementById(alertID).style.display = 'none'; 
    }, 5000); 
}

function logHttpResult(response, statusCode, message) {
    console.log("\nHTTP Status Code: " + statusCode);
    console.log(message);
    console.log(response);
}

function clearTableContent() {
    let newTbody = document.createElement('tbody');
    let oldTbody = document.getElementById('tblBudgetStats').getElementsByTagName('tbody')[0];
    document.getElementById('tblBudgetStats').replaceChild(newTbody, oldTbody);
}

function fillTableContent(response) {
    let dataToFill = JSON.parse(response);
    let tbody = document.getElementById('tblBudgetStats').getElementsByTagName('tbody')[0];

    for (let category in dataToFill['categories']) {
        let newRow = tbody.insertRow(tbody.rows.length)

        let catNameCell = newRow.insertCell(0).appendChild(document.createTextNode(dataToFill['categories'][category].type));

        if(dataToFill['categories'][category].type !== 'Uncategorized') {
            let spendingLimitCell = newRow.insertCell(1).appendChild(document.createTextNode('$' + dataToFill['categories'][category].limit.toFixed(2)));
            let amountSpentCell = newRow.insertCell(2).appendChild(document.createTextNode('$' +  dataToFill['categories'][category].amount_spent.toFixed(2)));
            let amountRemainingCell = newRow.insertCell(3).appendChild(document.createTextNode('$' + (dataToFill['categories'][category].limit.toFixed(2) - dataToFill['categories'][category].amount_spent.toFixed(2))));
        }
        else {
            let spendingLimitCell = newRow.insertCell(1).appendChild(document.createTextNode('N/A'));
            let amountSpentCell = newRow.insertCell(2).appendChild(document.createTextNode('$' +  dataToFill['categories'][category].amount_spent.toFixed(2)));
            let amountRemainingCell = newRow.insertCell(3).appendChild(document.createTextNode('N/A'));
        }
        

        if(dataToFill['categories'][category].amount_spent > dataToFill['categories'][category].limit 
            && dataToFill['categories'][category].type !== 'Uncategorized') {
            newRow.classList = "alert-danger";
        }
    }
}

function clearDropdownContent() {
    let deleteDropdown = document.getElementById('ddlDeleteCategories');
    let purchaseDropdown = document.getElementById('ddlSelectPurchaseCategory');

    while(deleteDropdown.firstChild) {
        deleteDropdown.removeChild(deleteDropdown.firstChild);
    }

    while(purchaseDropdown.firstChild) {
        purchaseDropdown.removeChild(purchaseDropdown.firstChild);
    }
}

function fillDropdownContent(response) {
    const dataToFill = JSON.parse(response);

    for (let category in dataToFill['categories']) {
        if(dataToFill['categories'][category].type !== 'Uncategorized') {
            document.getElementById('ddlDeleteCategories').appendChild(createDeleteNode(dataToFill['categories'][category]));
        }
        document.getElementById('ddlSelectPurchaseCategory').appendChild(createSelectNode(dataToFill['categories'][category]));
    }
}

function createDeleteNode(parsedJSON) {
    let deleteElement = document.createElement('a');
    deleteElement.setAttribute('id', "to_delete: " + parsedJSON.id);
    deleteElement.innerText = parsedJSON.type;
    deleteElement.className = 'dropdown-item';
    deleteElement.style.cursor = 'pointer';
    deleteElement.addEventListener('click', determineCategoryToDelete, true);

    return deleteElement;
}

function createSelectNode(parsedJSON) {
    let selectElement = document.createElement('a');
    selectElement.setAttribute('id', "to_assign: " + parsedJSON.id);
    selectElement.innerText = parsedJSON.type;
    selectElement.className = 'dropdown-item';
    selectElement.style.cursor = 'pointer';
    selectElement.addEventListener('click', determineCategegoryToAssign, true);

    return selectElement;
}

/* Event listeners */
window.onload = function() {
    getAllPurchases();
    getAllCategories();
}

document.getElementById('btnAddNewCategory').addEventListener('click', function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    
    let catName = document.getElementById('categoryName');
    let catLimit = document.getElementById('categoryLimit');

    //check if blank, post alert if so and do not post
    postNewCategory(catName.value, catLimit.value);

    catName.value = "";
    catLimit.value = "";
});

document.getElementById('btnAddNewPurchase').addEventListener('click', function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    let purDescription = document.getElementById('purchaseDescription');
    let purAmount = document.getElementById('purchaseAmountSpent');
    let purCategory = sessionStorage.getItem('categoryID');
    let purDate = document.getElementById('datePurchased');

    //check if blank, post alert if so and do not post
    postNewPurchase(purDescription.value, purAmount.value, purCategory, purDate.value);

    purDescription.value = "";
    purAmount.value = "";
    purDate.value = "";
    sessionStorage.removeItem("categoryID");
});