<?php
    header('Access-Control-Allow-Origin: *');
    
    if(isset($_POST)) {
        //get the data from the user and store in array
        $guest_data = Array (trim(stripslashes($_POST['first_name'])), trim(stripslashes($_POST['last_name'])), trim(stripslashes($_POST['address'])),
                             trim(stripslashes($_POST['school'])), trim(stripslashes($_POST['email'])), trim(stripslashes($_POST['phone'])),
                             trim(stripslashes($_POST['birthday'])), trim(stripslashes($_POST['color'])), trim(stripslashes($_POST['comment']))
        );

        $csv = generateCSV($guest_data);
        echo $csv; //return to AJAX
    }

    //generate a csv file for each entry and return the latest entry as JSON
    function generateCSV($data, $delimiter = ',', $enclosure = '"', $escape_char = "\n") {
        $handle = fopen('guests.mas', 'a+');
        fputcsv($handle, $data, $delimiter, $enclosure);
        rewind($handle);
        $json_list = Array();

        while(!feof($handle))
        {
            array_push($json_list, json_encode(fgetcsv($handle)));
        }
        fclose($handle);

        array_pop($json_list);
        return json_encode(array_pop($json_list));
    }
?>