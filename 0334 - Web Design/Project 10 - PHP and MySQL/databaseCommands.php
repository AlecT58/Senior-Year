<?php
    header('Access-Control-Allow-Origin: *');

    //set up the database connection
    $servername = "localhost";
    $username = "alect58_alect58";
    $password = "@lecDatabase@5649";
    $dbname = "alect58_Lab9";
    $conn = new mysqli($servername, $username, $password, $dbname);

    //kill the conection if an error occurs
    if ($conn->connect_error) {
        echo -1;    
        die("Connection failed: " . $conn->connect_error);
    } 
    
    //used to get all the customers in the database
    if(isset($_GET)) {
        $query = "SELECT user_id, first_name, last_name, address_1, address_2, city, 'state', 
                  zip_code, country, email, home_phone, cell_phone FROM Customer";
        $result = $conn->query($query);

        $json = Array();    //return the result as JSON

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                array_push($json, "{'id': '{$row["user_id"]}', 
                                    'first_name': '{$row["first_name"]}', 
                                    'last_name': '{$row["last_name"]}',
                                    'address_1': '{$row["address_1"]}',
                                    'address_2': '{$row["address_2"]}',
                                    'city': '{$row["city"]}',
                                    'state': '{$row["state"]}',
                                    'zip': '{$row["zip_code"]}',
                                    'country': '{$row["country"]}',
                                    'email': '{$row["email"]}',
                                    'home_phone': '{$row["home_phone"]}',
                                    'cell_phone': '{$row["cell_phone"]}'
                                }");
            }
        } else {
            echo null;
        }

        echo $json;
    }
   
    //used to add a new customer in the database
    if(isset($_POST)) {
        $query = $conn->prepare("INSERT INTO Customer VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $query->bind_param("sssssssssssss", null, $_POST["password"], $_POST["first_name"], $_POST["last_name"], $_POST["first_name"],
                                                  $_POST["address_1"], $_POST["address_2"], $_POST["city"], $_POST["state"],
                                                  $_POST["zip_code"], $_POST["country"], $_POST["email"], $_POST["home_phone"], $_POST["cell_phone"]
                            );
        $query->execute();
    }

    //used to update a customer in the database
    if(isset($_PUT)) {
        $query = $conn->prepare("UPDATE Customer SET first_name=?, last_name=?, address_1=?, address_2=?, city=?, 'state'=?, zip_code=?,
                                                     country=?, email=?, home_phone=?, cell_phone=? WHERE user_id=?
                                ");
        $query->bind_param("ssssssssssss", $_PUT["first_name"], $_PUT["last_name"], $_PUT["address_1"], $_PUT["address_2"], $_PUT["city"], 
                                           $_PUT["state"], $_PUT["zip_code"], $_PUT["country"], $_PUT["email"], $_PUT["home_phone"], 
                                           $_PUT["cell_phone"], $_PUT["user_id"]
                            );
        if ($conn->query($query) === TRUE) {
            echo "{'updated': true}";
        }
        else {
            echo "{'updated': true}";
        }
    }

    //close the database connection after the method is complete
    $conn->close();
?>