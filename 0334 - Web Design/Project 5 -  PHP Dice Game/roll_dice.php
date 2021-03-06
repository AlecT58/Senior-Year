<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="author" content="Alec Trievel">
    <title>A PHP Dice Game | Results</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
    <link rel="stylesheet" href="dice.css">
</head>
<body>
    <div class="container text-center">
        <?php
            //Gather user input from the form
            $user_guess = $_GET["total_guess"];
            $num_dice = $_GET["num_dice"];

            //Setup the sum to be zero initially
            $sum = 0;

            /*
            * Show the user their dice roll(s)
            * Loop n times, where n is the number of dice the user requested
            * Generate a random value 1 to 6 each time to simulate a roll
            * Sum up the rolls and display the sum
            */           
            echo "<h2 class='display-3'>Here is your dice roll:</h2>";

            for($x = 0; $x < $num_dice; $x++) {
                $random_roll = rand(1, 6);
                $sum += $random_roll;
                $current = $x + 1;
                echo "<span class='dice dice-". $random_roll . "'></span>";
            }

            echo "<h3 class='display-3'>Sum: " . $sum . "</h3>";
            echo "<h3 class='display-3'>Your Guess: " . $user_guess . "</h3>";

            //If the user's guess is not the sum, tell them they lose, win otherwise
            if($user_guess != $sum) {
                echo "<h3 class='display-3 text-danger'>Sorry, you lose!</h3>";
            }
            else {
                echo "<h3 class='display-3 text-success'>Congratulations, you win!</h3>";
            }
        ?>

        <a class="btn btn-md btn-info mt-5" href="http://www.alectrievel.com/schoolwork/CS0334/project5/roll_dice.txt" download>Download PHP as Text</a>
    </div>
 
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>  
</body>