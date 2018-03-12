<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="author" content="Alec Trievel">
    <title>Months Sorted</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
    <style type="text/css">
        .table {
            margin: 0 auto;
            width: 80%;
        }
</style>
</head>
<body>
    <div class="container text-center">
    <div class="table-responsive my-3">
        <table class="table table-striped table-bordered text-center">
            <thead>
                <tr>
                    <th>Month</th>
                    <th># of Days</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    $months = array(
                        "January" => 31,
                        "February" => 28,
                        "March" => 31,
                        "April" => 30,
                        "May" => 31,
                        "June" => 30,
                        "July" => 31,
                        "August" => 31,
                        "September" => 30,
                        "October" => 31,
                        "November" => 30,
                        "December" => 31
                    );

                    ksort($months);

                    foreach($months as $month => $days) {
                        echo "<tr><td>".$month."</td><td>".$days."</td></tr>";
                    }
                ?>
            </tbody>
        </table>
    </div>
        <a class="btn btn-md btn-info my-3" href="http://www.alectrievel.com/schoolwork/CS0334/midterm/months.txt" download>Download PHP as Text</a>
    </div>
<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
</body>
</html>