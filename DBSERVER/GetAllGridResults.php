<?php
//DebugBreak();         // Local Debugging Function for phpEd application   
    header('Content-Type: application/json');       // HTTP Header JSON
    
    ### Configure DB ########################################################
    define("DBHost", "localhost");
    define("DBName", "climatedb");
    define("DBUser", "cdbGuest");
    define("DBPass", "climatechip");
    define("CLIMATETABLE", "cru");

    ### Connect to DB #######################################################
    /*
        Connect to database with earlier defined credentials 
    */
    function ConnectDB()
        {
            $mysqliConnection = @mysqli_connect(DBHost, DBUser, DBPass, DBName);        //@ before mysqli_connect suppresses PHP error output
               
            // check connection
            if (mysqli_connect_errno()) 
                {
                    reportError("Database error:" . mysqli_connect_error());
                }
            return $mysqliConnection;
        }
        
    ### Close DB/free memory ###############################################
    function CloseDB($mysqliConnection)
        {
            mysqli_close($mysqliConnection);
        }

    ### Round Longitude/Latitude ############################################
    /* 
    *   this function takes any global co-ordinate (degrees lat or long)
    *   and rounds it to the nearest grid-cell co-ordinate as used in the db
    */
    function gridCoordinate($prCoordIn){
        return (float)(round( ( ( ( ($prCoordIn + 0.25) * 2.00) / 2.00) - 0.25),2) );
    }
    
    ### Error Handling ######################################################
    function reportError($sError, $mysqliConnection=null){
        $aMasterArray['d'][0] = array(
            "__type"            => "GridResult:#",
            "ErrorStr"          => $sError
            
            /* unnecessary fields for error JSON? */
            /*
            "GridLat"           => (float) 0,
            "GridLng"           => (float) 0,
            "Year"              => (float) 0,
            "Month"             => (int)   0,
            "TemperatureMin"    => (float) 0,
            "TemperatureMean"   => (float) 0,
            "TemperatureMax"    => (float) 0,
            "DewPoint"          => (float) 0,
            "WBGTMax"           => (float) 0,
            "WBGT"              => (float) 0,
            "UTCIMax"           => (float) 0,
            "UTCI"              => (float) 0
            */            
        );
        
        print(json_encode($aMasterArray));
        if ($mysqliConnection != null && mysqli_ping($mysqliConnection)) {  // Check DB connection, close if still open
            CloseDB($mysqliConnection);
        }
        die();
    }
        
    ### EXECUTE #############################################################

    $aPOST = json_decode(file_get_contents('php://input'),true);                                                                // POST arrives as $HTTP_RAW_POST_DATA (JSON/XML...), decode into array ('true' parameter)
    $fLongitude = gridCoordinate(filter_var($aPOST['longitude'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION));    // Sanitize POST var to be float (prevent mysql injection) and apply custom rounding
    $fLatitude  = gridCoordinate(filter_var($aPOST['latitude'],  FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION));
    
    $aMasterArray['d'] = array();                                           // Array for returning climate data as JSON
    $mysqliConnection = ConnectDB();

    $sQuery        = "SELECT latitude/100 as Latitude, longitude/100 as Longitude, Month, Year,";
    $sQuery       .= " TempMin_C/100 as TempMin_C, TempMean_C/100 as TempMean_C, TempMax_C/100 as TempMax_C, DewPoint_C/100 as DewPoint_C,";
    $sQuery       .= " WBGTm/100 as WBGTm, WBGTa/100 as WBGTa, UTCIm/100 as UTCIm, UTCIa/100 as UTCIa,";
    $sQuery       .= " WBGTh/100 as WBGTh, UTCIh/100 as UTCIh";
    $sQuery       .= " FROM cru2";
    $sQuery       .= " WHERE (Longitude=" . $fLongitude*100 . ") AND (Latitude=" . $fLatitude*100 . ")";
    $sQuery       .= " ORDER BY Year, Month ASC;";

/*
    $sQuery        = " SELECT *";
    $sQuery       .= " FROM " . CLIMATETABLE;
    $sQuery       .= " WHERE (Longitude=" . $fLongitude . ") AND (Latitude=" . $fLatitude . ")";
    $sQuery       .= " ORDER BY Year, Month ASC;";
*/
    $result = @mysqli_query($mysqliConnection, $sQuery) or reportError(mysqli_error($mysqliConnection),$mysqliConnection);

    if(mysqli_num_rows($result) > 0) {                                      // If no results return error string
    
        while($row = mysqli_fetch_assoc($result)) {
            $aTemp = array(
                "__type"            => "GridResult:#",                      // Always this value?
                "GridLat"           => (float) $row['Latitude'],
                "GridLng"           => (float) $row['Longitude'],
                "Year"              => (int) $row['Year'],
                "Month"             => (int)   $row['Month'],
                "TemperatureMin"    => (float) $row['TempMin_C'],
                "TemperatureMean"   => (float) $row['TempMean_C'],
                "TemperatureMax"    => (float) $row['TempMax_C'],
                "DewPoint"          => (float) $row['DewPoint_C'],
                "WBGTMax"           => (float) $row['WBGTm'],
                "WBGT"              => (float) round ($row['WBGTa'],2),     //Correct field? round 2 decimals
                "UTCIMax"           => (float) $row['UTCIm'],
                "UTCI"              => (float) round ($row['UTCIa'],2),     //Correct field? round 2 decimals
                "WBGTMid"           => (float) $row['WBGTh'],
                "UTCIMid"           => (float) $row['UTCIh'],
               "ErrorStr"          => NULL
            );
            array_push($aMasterArray['d'], $aTemp);
        }

        CloseDB($mysqliConnection);
        print(json_encode($aMasterArray));
        die();
    }
    else {
        reportError("There were no results for the area or date that you have selected. Please ensure that you select an area over land!", $mysqliConnection);
    }

/* 
    Example of required JSON data output: 

{
  "d": [
    {
      "__type": "GridResult:#",
      "ErrorStr": null,
      "UTCI": 7.97,
      "WBGT": 6.4,
      "DewPoint": 3.44465,
      "GridLat": -41.75,
      "GridLng": 172.75,
      "Month": 0,
      "TemperatureMax": 12.475,
      "TemperatureMean": 7.71667,
      "TemperatureMin": 2.98333,
      "UTCIMax": 12.1941,
      "WBGTMax": 9.43967,
      "Year": 1980
    },
    {
      "__type": "GridResult:#",
      "ErrorStr": null,
      "UTCI": 13.4,
      "WBGT": 11.28,
      "DewPoint": 7.83153,
      "GridLat": -41.75,
      "GridLng": 172.75,
      "Month": 1,
      "TemperatureMax": 19.1,
      "TemperatureMean": 13.2,
      "TemperatureMin": 7.4,
      "UTCIMax": 18.421,
      "WBGTMax": 14.8331,
      "Year": 1980
    },
  ]
}


*/
?>
