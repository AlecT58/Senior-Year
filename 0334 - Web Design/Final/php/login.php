<?php
    //set up the database connection
    $servername = "localhost";
    $username = "alect58_alect58";
    $password = "@lecDatabase@5649";
    $dbname = "alect58_Final";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if (mysqli_connect_errno()) {
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
    }

    //login functions
    if(isset($_POST['log_email'])) {
        $email = $_POST['log_email'];
        $password = $_POST['log_password'];

        verifyLogin($conn, $email, $password);
    }

    //assert email and password match the email and hash in the database
    //redirect to cart if ok, redirect to login if error
    function verifyLogin($conn, $email, $password) {
        if ($stmt = $conn->prepare("SELECT id, password_hash FROM Users WHERE email=?")) {
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $stmt->bind_result($id, $password_hash);
            $stmt->fetch();
            $stmt->close();

            if(password_verify($password, $password_hash)) {
                setcookie("logged_in_id", $id, time()+3600);
                echo "<script>window.location = 'http://www.alectrievel.com/schoolwork/CS0334/final/cart.html?id=".$id."'</script>";
                die();
            }
            else {
                echo "<script>window.location = 'http://www.alectrievel.com/schoolwork/CS0334/final/login.html'</script>";
                die();
            }  
        }
    }

    //register functions
    if(isset($_POST['reg_name'])) {
        $name = mysqli_real_escape_string($conn, trim($_POST['reg_name']));
        $email = mysqli_real_escape_string($conn, trim($_POST['reg_email']));
        $password = mysqli_real_escape_string($conn, trim($_POST['reg_password']));
        $verify_password = mysqli_real_escape_string($conn, trim($_POST['reg_verify_password']));

        if(verifyPasswords($password, $verify_password)) {
            registerNewUser($conn, $name, $email, $password);
        }
        else {
            echo "broken";
        }
    }

    //assert password > 8 chars and password match
    function verifyPasswords($pass, $verify) {
        if(strlen($pass) < 8) {
            echo "password < 8";
            return false;
        }

        if($pass != $verify) {
            echo "passwords do not match";
            return false;
        }

        return true;
    }

    //add new user to database with a hash instead of a plaintext password
    //redirect to login if ok, redirect to register if error
    function registerNewUser($conn, $name, $email, $password) {
        $id = 0;
        $hash = password_hash($password, PASSWORD_BCRYPT);

        if ($stmt = $conn->prepare("INSERT INTO Users (`id`, `name`, `email`, `password_hash`) VALUES (?,?,?,?)")) {
            $stmt->bind_param("ssss", $id, $name, $email, $hash);
            $stmt->execute();
            $stmt->close();

            echo "<script>window.location = 'http://www.alectrievel.com/schoolwork/CS0334/final/login.html'</script>";
            die();
        }
        else {
            echo "<script>window.location = 'http://www.alectrievel.com/schoolwork/CS0334/final/register.html'</script>";
            die();
        }
    }
?>