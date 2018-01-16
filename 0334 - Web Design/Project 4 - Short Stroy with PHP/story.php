<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>A Short PHP Story</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
</head>
<body>
    <div class="jumbotron">
        <?php
            // Collect form data and save in variables 
            $proper_name = $_GET["proper_name"];
            $adjective_a = $_GET["adjective_a"];
            $adjective_b = $_GET["adjective_b"];
            $noun = $_GET["noun"];
            $occupation = $_GET["occupation"];
            $occupation_tool = $_GET["occupation_tool"];
            $amount = $_GET["amount"];

            // Now display the story in paragraphs, with text formatting on the input values
            echo "<h1 class='display-2 text-center mb-4'>Old King " . $proper_name . "</h1>";
            echo "<p class='text-center'>Old King <span class='font-weight-bold'>" .  $proper_name . "</span> was a <span class='text-primary'>" . $adjective_a . " " . $adjective_b . "</span> soul, and a <span class='text-primary'>" . $adjective_a . " " . $adjective_b . "</span> soul was he.</p>";
            echo "<p class='text-center'>He called for his <span class='text-danger'>" . $noun . "</span> in the middle of the night</p>";
            echo "<p class='text-center'>And he called for his <span class='text-success'>" . $occupation . "</span> <span class='text-warning'>" . $amount . "</span></p>";
            echo "<p class='text-center'>Every <span class='text-success'>". $occupation . "</span> had a fine <span class='text-info'>" . $occupation_tool . "</span>, and a very fine <span class='text-info'>" . $occupation_tool . "</span> had he;</p>";
            echo "<p class='text-center'>Oh there's none so rare as can compare</p>";
            echo "<p class='text-center'>With King <span class='font-weight-bold'>" . $proper_name . "</span> and his <span class='text-success'>" . $occupation . "</span> <span class='text-warning'>" . $amount . "</span>.</p>";
        ?>
    </div>

    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
</body>
</html>