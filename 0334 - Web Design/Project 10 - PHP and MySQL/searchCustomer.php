<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta author="Alec Trievel">
    <title>Search Customer</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>
<body class=bg-dark>
    <div class="container">
        <div class="jumbotron text-center my-5">
            <h3 class="display-3">Search for a Customer</h3>
            <form method="POST">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="h5" for="txtFirstName">First Name</label>
                        <input type="text" class="form-control" id="txtFirstName" name="fname">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="h5" for="txtLastName">Last Name</label>
                        <input type="text" class="form-control" id="txtLastName" name="lname">
                    </div>
                </div>
                <input type="submit" name="submit" class="btn btn-lg btn-primary" style="cursor:pointer" value="Search">
            </form>
        </div>
        <?php
            if(isset($_POST['submit'])) {
                //set up the database connection
                $servername = "localhost";
                $username = "alect58_alect58";
                $password = "@lecDatabase@5649";
                $dbname = "alect58_Lab9";
                $conn = new mysqli($servername, $username, $password, $dbname);

                $first_name = $_POST["fname"];
                $last_name = $_POST["lname"];

                if ($stmt = $conn->prepare("SELECT * FROM Customer WHERE first_name=? AND last_name=?")) {
                    $stmt->bind_param("ss", $first_name, $last_name);
                    $stmt->execute();
                    $stmt->bind_result($user_id, $password, $first_name, $last_name, $address_1, $address_2, $city, $state, $zip, $country, $email, $home_phone, $cell_phone);
                    $stmt->fetch();      
                    $stmt->close();

                    if($user_id == null) {
                        echo "<div class='alert alert-info'><strong>Note: </strong>No information was found for that name</div>";
                    }
                    else {
                        echo "<div class='alert alert-info'><h4 class='alert-heading'>Here's the information we found about $first_name $last_name:</h4>
                                <div class='row'><div class='col-md-8 mb-2'><strong>Address: </strong>$address_1 $address_2, $city, $state, $country</div></div>
                                <div class='row'><div class='col-md-8 mb-2'><strong>Email: </strong>$email</div></div>
                                <div class='row'><div class='col-md-8 mb-2'><strong>Home Phone: </strong>$home_phone</div></div>
                                <div class='row'><div class='col-md-8 mb-2'><strong>Cell Phone: </strong>$cell_phone</div></div>
                              </div>";
                    }
                }

                $conn->close();
            }
        ?>
    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>