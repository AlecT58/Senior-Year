<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="author" content="Alec Trievel">
    <title>Average Test Scores</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
</head>
<body>
    <div class="container text-center">
        <h2 class='display-3'>Average Score Calculator</h2>
        <form method="POST" action="part2.php">
            <div class="form-group">
                <div class="row my-3">
                    <div class="col-4 text-center">
                        <label for="score1">Enter the first score</label>
                        <input type="number" min="0.0" max="100.0" step="any" class="form-control" name="score1" id="score1" required>
                    </div>
                    <div class="col-4 text-center">
                        <label for="score2">Enter the second score</label>
                        <input type="number" min="0.0" max="100.0" step="any" class="form-control" name="score2" id="score2" required>
                    </div>
                    <div class="col-4 text-center">
                        <label for="score1">Enter the third score</label>
                        <input type="number" min="0.0" max="100.0" step="any" class="form-control" name="score3" id="score3" required>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6 text-center">
                        <label for="score1">Enter the fourth score</label>
                        <input type="number" min="0.0" max="100.0" step="any" class="form-control" name="score4" id="score4"required>
                    </div>
                    <div class="col-6 text-center">
                        <label for="score2">Enter the fifth score</label>
                        <input type="number" min="0.0" max="100.0" step="any" class="form-control" name="score5" id="score5" required>
                    </div>
                </div>
                <div class="form-row text-center mb-5">
                    <div class="col-12">
                        <input type="submit" class="btn btn-lg btn-primary" name="submit" value="Find Averages" style="cursor: pointer">
                    </div>
                </div> 
            </div>
        </form>

        <?php
            //run this code if we execute a POST request
            if(isset($_POST['submit'])) {
                //add all elements of the form into an array
                $scores = array (
                    1 => $_POST['score1'],
                    2 => $_POST['score2'],
                    3 => $_POST['score3'],
                    4 => $_POST['score4'],
                    5 => $_POST['score5']
                );

                //calculate the sum and divide by the array size to find the average
                $amount = count($scores);
                $sum = array_sum($scores);
                $average =  $sum / $amount;

                //display the average and sum on a new line
                echo "<h2 class='display-4'>The sum of the ".$amount." scores is: ".$sum."</h2>";
                echo "<h2 class='display-4'>The average of the ".$amount." scores is: ".$average."</h2>";
            }
        ?>

        <a class="btn btn-md btn-info my-3" href="http://www.alectrievel.com/schoolwork/CS0334/project7/part2/part2.txt" download>Download PHP as Text</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
</body>
</html>