<?php
    header('Access-Control-Allow-Origin: *');
    
    if(isset($_POST)) {
        //get the data from the user and store in array
        $guest_data = Array (
            trim(str_replace(",", "", stripslashes($_POST['first_name']))), 
            trim(str_replace(",", "", stripslashes($_POST['last_name']))), 
            trim(str_replace(",", "", stripslashes($_POST['address']))), 
            trim(str_replace(",", "", stripslashes($_POST['school']))), 
            trim(str_replace(",", "", stripslashes($_POST['email']))), 
            trim(str_replace(",", "", stripslashes($_POST['phone']))),
            trim(str_replace(",", "", stripslashes($_POST['birthday']))), 
            trim(str_replace(",", "", stripslashes($_POST['color']))), 
            trim(str_replace(",", "", stripslashes($_POST['comment'])))
        );

        $csv = generateCSV($guest_data);
        echo $csv; //return to AJAX
    }

    //generate a csv line for each entry, write to file, and return the latest entry as JSON
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