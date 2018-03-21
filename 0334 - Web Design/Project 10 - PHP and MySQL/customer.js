//execute pseudo-PUT for update or POST for insert
function createOrUpdateCustomer(customer_as_json) {
    $.ajax({
        url: "http://www.alectrievel.com/schoolwork/CS0334/project10/databaseCommands.php",
        type: 'POST',
        dataType: "applcation/json; charset=utf-8",
        data: customer_as_json
    })
    .always(function (data, textStatus) {
        if (textStatus !== 'success') {
            //error
        }
        else {
            if(data.responseText.contains("{'updated': 'true'}")) {
                alert('Customer information was updated');
            }
            else {
                alert('New customer was added');
            }
        }
    });
}

//get all the customers from the database
function getCustomerData() {
    $.ajax({
        url: "http://www.alectrievel.com/schoolwork/CS0334/project10/databaseCommands.php",
        type: "GET",
        contentType: "applcation/json; charset=utf-8"
    })
    .always(function (data, textStatus) {
        if (textStatus !== 'success') {
            //error
        }
        else {
            //add each JSON row to the table
            JSON.parse(data).forEach(element => updateTable(JSON.parse(element)));
        }
    });
}

//insert the given JSON string into the table
function updateTable(customer_json) {
    $('#tblCustomers tbody').append("<tr><td><input type='text' id='txtFirstName" + customer_json.id + "' class='form-control' value='" + customer_json.first_name + "'>" + 
                                    "<td><input type='text' id='txtLastName" + customer_json.id + "' class='form-control' value='" + customer_json.last_name + "'>" +
                                    "<td><input type='text' id='txt1Address" + customer_json.id + "' class='form-control' value='" + customer_json.address_1 + "'>" +
                                    "<td><input type='text' id='txt2Address" + customer_json.id + "' class='form-control' value='" + customer_json.address_2 + "'>" +
                                    "<td><input type='text' id='txtCity" + customer_json.id + "' class='form-control' value='" + customer_json.city + "'>" +
                                    "<td><input type='text' id='txtState" + customer_json.id + "' class='form-control' value='" + customer_json.state + "'>" +
                                    "<td><input type='number' id='txtZip" + customer_json.id + "' class='form-control' value='" + customer_json.zip_code + "'>" +
                                    "<td><input type='text' id='txtCountry" + customer_json.id + "' class='form-control' value='" + customer_json.country + "'>" +
                                    "<td><input type='email' id='txtEmail" + customer_json.id + "' class='form-control' value='" + customer_json.email + "'>" +
                                    "<td><input type='number' id='txtHomePhone" + customer_json.id + "' class='form-control' value='" + customer_json.home_phone + "'>" +
                                    "<td><input type='number' id='txtCellPhone" + customer_json.id + "' class='form-control' value='" + customer_json.cell_phone + "'>" +
                                    "<td><input type='button' id='btnUpdate" + customer_json.id + "' class='btn btn-primary update' value='Update Customer' onClick='updateCustomer(this)'>" +
                                    "</td></tr>");
}