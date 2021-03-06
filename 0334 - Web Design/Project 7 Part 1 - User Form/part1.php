<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="author" content="Alec Trievel">
    <title>What Day Was I Born?</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
    <link rel="stylesheet" href="jsCalendar.min.css"
</head>
<body>
    <div class="container text-center">
        <h2 class='display-3 mb-3'>What day were you born?</h2>

        <?php
            $days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            echo "<h5 display-3 mb-2>The days of the week in sequence are: <br>";

            foreach($days_of_week as $key=>$value) {
                echo ($key+1).". ".$value."<br>";
            }

            echo "</h5>";
        ?>

        <form method="POST" action="part1.php">
            <div class="form-group">
                <label for="ddlMonth">Select your birth month</label>
                <select class="form-control" name="month" id="ddlMonth">
                    <option value="11">January</option>
                    <option value="12">February</option>
                    <option value="1">March</option>
                    <option value="2">April</option>
                    <option value="3">May</option>
                    <option value="4">June</option>
                    <option value="5">July</option>
                    <option value="6">August</option>
                    <option value="7">September</option>
                    <option value="8">October</option>
                    <option value="9">November</option>
                    <option value="10">December</option>
                </select>
            </div>
            <div class="form-group">
                <label for="txtDay">Enter the day (numeric) you were born</label>
                <input type="number" name="day" class="form-control" id="txtDay" min="1" max="31" required>
            </div>
            <div class="form-group">
                <label for="txtYear">Enter your birth year</label>
                <input type="number" name="year" class="form-control" id="txtYear" min="1753" max="9999" required>
            </div>
            <div class="form-row text-center mb-5">
                <div class="col-12">
                    <input type="submit" class="btn btn-lg btn-primary" name="submit" value="Submit Form" style="cursor: pointer">
                </div>
            </div>   
        </form>   

        <?php    
             if(isset($_POST['submit'])) {
                 //source for the formula used in this project: http://mathforum.org/dr.math/faq/faq.calendar.html
                 //hash of the days of the week used for the Zeller Formula
                $zeller_days_of_week = array (
                    0 => "Sunday",
                    1 => "Monday",
                    2 => "Tuesday",
                    3 => "Wednesday",
                    4 => "Thursday",
                    5 => "Friday",
                    6 => "Saturday"
                );

                $zeller_months = array (
                    11 => "January",
                    12 => "February",
                    1 => "March",
                    2 => "April",
                    3 => "May",
                    4 => "June",
                    5 => "July",
                    6 => "August",
                    7 => "September",
                    8 => "October",
                    9 => "November",
                    10 => "December"
                );

                $month = (int)$_POST['month'];
                $day = $_POST['day'];
                $year = $_POST['year'];

                $js_date = "{$zeller_months[$month]} {$day}, {$year}";

                if($month >= 11 && $month <= 12) {  //if the month is January or February, subtract one (see source)
                    $year--;
                }

                $decade = $year % 100;      //find the decade by taking the last two digits
                $century = (int)($year / 100) % 100;        //find the century by taking the first two digits                        
                $month_value = floor((13 * $month - 1) / 5);        //find the month value for the Zeller formula (see source)
                $decade_value = floor($decade / 4);     //find the decade value for the Zeller formula (see source)
                $century_value = floor($century / 4);       //find the centruy value for the Zeller formula (see source)
                $zeller_value = $day + (int)$month_value + $decade + (int)$decade_value + (int)$century_value - (2 * $century);     //calculate the Zeller formula (see source)

                //find the remainder which coresponds to the day of the week
                //if negative, run special formula
                //else, just find the remainder when dividing by 7
                if($zeller_value < 0) {
                    $zeller_remainder = ($zeller_value % - 7) + 7;
                }
                else {
                    $zeller_remainder = $zeller_value % 7;
                }

                //display the day of the week
                echo "<h2 class='display-4'>You were born on a ".$zeller_days_of_week[$zeller_remainder]."</h2>";
            }
        ?>

            <div class="container-fluid text-center my-3" style="display:none" id="showBirthDate">
                <h2 class='display-4'>Here is a calendar of your birth month:</h2>
                <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4">
                        <div id="calBirthdate"></div>
                    </div>
                    <div class="col-4"></div>
                </div>
            </div>

        <a class="btn btn-md btn-info my-3" href="http://www.alectrievel.com/schoolwork/CS0334/project7/part1/part1.txt" download>Download PHP as Text</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
    <script src="jsCalendar.min.js"></script>
    <script type="text/javascript">
        const birthdate = "<?php echo $js_date ?>";

        if(birthdate !== null && birthdate !== undefined && birthdate !== '') {
            const birthdate_as_date = new Date(birthdate);
            const cal = document.getElementById('calBirthdate');    
            document.getElementById('showBirthDate').style.display = 'block';

            jsCalendar.new(cal, birthdate_as_date, {
                navigator : true,
                navigatorPosition : "left",
                zeroFill : false,
                monthFormat : "month YYYY",
                dayFormat : "DDD",
                language : "en"
            });
        }     
    </script>
</body>
</html>