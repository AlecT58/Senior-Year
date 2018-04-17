<?php
    header("Content-Type: application/json; charset=UTF-8");

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

    if(isset($_GET['user_id']) && isset($_GET['type'])) {
        if($_GET['type'] == 'music') {
            var_dump(getAllSongs($conn, $_GET['user_id']));
        }
        elseif($_GET['type'] == 'movie') {
            var_dump(getAllMovies($conn, $_GET['user_id']));
        }
        elseif ($_GET['type'] == 'tv') {
            var_dump(getAllShows($conn, $_GET['user_id']));
        }
        $conn->close();
    }

    function getAllSongs($conn, $id) {
        $result = $conn->query("SELECT * FROM Owned_Music_List WHERE user_id=".$id);

        $json = Array();    
        $song = (object)array();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $song->name = $row["song_name"];
                $song->artist = $row["artist"];
                $song->album = $row["album"];
                $song->price = $row["price"];
                
                array_push($json, json_encode($song));
            }
        } 
        else {
            array_push($json, null);
        }

        return $json;
    }

    function getAllMovies($conn, $id) {
        $result = $conn->query("SELECT * FROM Owned_Movie_List WHERE user_id=".$id);

        $json = Array();    
        $movie = (object)array();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $movie->name = $row["movie_name"];
                $movie->artist = $row["director"];
                $movie->album = $row["genre"];
                $movie->price = $row["price"];
                
                array_push($json, json_encode($song));
            }
        } 
        else {
            array_push($json, null);
        }

        return $json;
    }

    function getAllShows($conn, $id) {
        $result = $conn->query("SELECT * FROM Owned_TV_List WHERE user_id=".$id);

        $json = Array();    
        $tv = (object)array();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $tv->name = $row["movie_name"];
                $tv->artist = $row["director"];
                $tv->album = $row["genre"];
                $tv->price = $row["price"];
                
                array_push($json, json_encode($song));
            }
        } 
        else {
            array_push($json, null);
        }

        return $json;
    }
?>