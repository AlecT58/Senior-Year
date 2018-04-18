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

    if(isset($_POST['music'])) {
        if(saveSongToCart($conn, json_decode($_POST['music'], true))) {
            echo "ok";
        }
        else {
            echo "error";
        }
    }
    elseif(isset($_POST['tv'])) {
        if(saveTVToCart($conn, json_decode($_POST['tv'], true))) {
            echo "ok";
        }
        else {
            echo "error";
        }
    }
    elseif(isset($_POST['movie'])) {
        if(saveMovieToCart($conn, json_decode($_POST['movie'], true))) {
            echo "ok";
        }
        else {
            echo "error";
        }
    }

    function saveSongToCart($conn, $song) {
        $id = 0;

        if ($stmt = $conn->prepare("INSERT INTO Music (`id`, `song_name`, `artist`, `album`, `price`) VALUES (?,?,?,?,?)")) {
            $price = floatval(str_replace("$", "", $song['price']));
            $stmt->bind_param("ssssd", $id, $song['name'], $song['artist'], $song['album'], $price);
            $stmt->execute();
            $last_row = mysqli_insert_id($conn);
            $stmt->close();   
            
            if ($stmt2 = $conn->prepare("INSERT INTO Owned_Music (`id`, `user_id`, `music_id`) VALUES (?,?,?)")) {
                $stmt2->bind_param("ddd", $id, $song['user_id'], $last_row);
                $stmt2->execute();
                $stmt2->close(); 
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    function saveMovieToCart($conn, $movie) {
        $id = 0;

        if ($stmt = $conn->prepare("INSERT INTO Movie (`id`, `movie_name`, `director`, `genre`, `price`) VALUES (?,?,?,?,?)")) {
            $price = floatval(str_replace("$", "", $movie['price']));
            $stmt->bind_param("ssssd", $id, $movie['title'], $movie['director'], $movie['genre'], $price);
            $stmt->execute();
            $last_row = mysqli_insert_id($conn);
            $stmt->close();   

            if ($stmt2 = $conn->prepare("INSERT INTO Owned_Movies (`id`, `user_id`, `movie_id`) VALUES (?,?,?)")) {
                $stmt2->bind_param("ddd", $id, $movie['user_id'], $last_row);
                $stmt2->execute();
                $stmt2->close(); 
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    function saveTVToCart($conn, $show) {
        $id = 0;

        if ($stmt = $conn->prepare("INSERT INTO TV (`id`, `show_name`, `episode`, `genre`, `price`) VALUES (?,?,?,?,?)")) {
            $price = floatval(str_replace("$", "", $show['price']));
            $stmt->bind_param("ssssd", $id, $show['show'], $show['episode'], $show['genre'], $price);
            $stmt->execute();
            $last_row = mysqli_insert_id($conn);
            $stmt->close();   
            
            if ($stmt2 = $conn->prepare("INSERT INTO Owned_TV (`id`, `user_id`, `tv_id`) VALUES (?,?,?)")) {
                $stmt2->bind_param("ddd", $id, $show['user_id'], $last_row);
                $stmt2->execute();
                $stmt2->close(); 
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
?>