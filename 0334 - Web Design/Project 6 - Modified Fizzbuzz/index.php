<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="author" content="Alec Trievel">
    <title>Go Pitt | Fizzbuzz</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
</head>
<body>
    <div class="container text-center">
    <h2 class='display-3'>"GoPitt" Fizzbuzz</h2>
    <a class="btn btn-md btn-info my-3" href="http://www.alectrievel.com/schoolwork/CS0334/project6/modified_fizzbuzz.txt" download>Download PHP as Text</a>
    <br>
    <?php
        /* loop 100 times
        *  if evenly divisable by 3, mark as 'fizzy'
        *  if evenly divisable by 3, mark as 'buzzy'
        *  if fizzy and buzzy, print 'GoPitt'
        *  if only fizzy, print 'Go'
        *  if only buzzy, print 'Pitt'
        *  else print the index of the loop
        */
        
        for ($i = 1; $i <= 100; $i++)
        {
            $fizzy = (bool)($i % 3 == 0);
            $buzzy = (bool)($i % 5 == 0);

            if($fizzy && $buzzy){
                echo "GoPitt<br />";
            }
            else if($fizzy){
                echo "Go<br />";
            }
            else if($buzzy){
                echo "Pitt<br />";
            }
            else {
                echo $i."<br />";
            }
        }
    ?>
    </div>

    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
</body>
</html>