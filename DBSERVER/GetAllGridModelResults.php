<?php
//DebugBreak();         // Local Debugging Function for phpEd application   
	header('Content-Type: application/json');       // HTTP Header JSON

	### Configure DB ########################################################
	define("DBHost", "localhost");
	define("DBName", "climatedb");
	define("DBUser", "cdbGuest");
	define("DBPass", "climatechip");
	define("CLIMATETABLE", "rcp3corr");

	### Connect to DB #######################################################
	/*
	//    Connect to database with earlier defined credentials 
	//*/
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
			"__type"            => "GridResultModel:#",
			"ErrorStr"          => $sError          
			);
		
		print(json_encode($aMasterArray));
		if ($mysqliConnection != null && mysqli_ping($mysqliConnection)) {  // Check DB connection, close if still open
			CloseDB($mysqliConnection);
		}
		die();
	}

	### EXECUTE #############################################################

	//reportError("testing", null);
	//print(json_encode("Just Testing"));
	//die();

	$aPOST = json_decode(file_get_contents('php://input'),true);                                                                // POST arrives as $HTTP_RAW_POST_DATA (JSON/XML...), decode into array ('true' parameter)
	$fLongitude = gridCoordinate(filter_var($aPOST['longitude'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION));    // Sanitize POST var to be float (prevent mysql injection) and apply custom rounding
	$fLatitude  = gridCoordinate(filter_var($aPOST['latitude'],  FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION));

	$aMasterArray['d'] = array();                                           // Array for returning climate data as JSON
	$mysqliConnection = ConnectDB();


	$sQuery  = " SELECT Lat/100 as latitude, Lon/100 as longitude, YearFirst, YearLast, MonthNumber as Month,";
	$sQuery .= " TmeanAvg/100 as TmeanAvg, TmaxAvg/100 as TmaxAvg, TdewAvg/100 as TdewAvg,";
	$sQuery .= " UTCImeanAvg/100 as UTCImeanAvg, UTCImaxAvg/100 as UTCImaxAvg, WBGTmeanAvg/100 as WBGTmeanAvg, WBGTmaxAvg/100 as WBGTmaxAvg, Model, RcpNo";
	$sQuery .= " FROM " . CLIMATETABLE;
	$sQuery .= " WHERE (Lon=" . round($fLongitude*100) . ") AND (Lat=" . round($fLatitude*100) . ")";
	$sQuery .= " ORDER BY YearFirst, MonthNumber ASC;";

	$result = @mysqli_query($mysqliConnection, $sQuery) or reportError(mysqli_error($mysqliConnection),$mysqliConnection);

	if(mysqli_num_rows($result) > 0) {                                      // If no results return error string
		
		while($row = mysqli_fetch_assoc($result)) {
			$aTemp = array(
		// this neede?	"__type"            => "GridResultModel:#",                      // Always this value?
				"GridLat"           => (float) $row['latitude'],
				"GridLng"           => (float) $row['longitude'],
				"Years"             =>	       $row['YearFirst'].$row['YearLast'],
				"TemperatureMean"   => (float) $row['TmeanAvg'],
				"TemperatureMax"    => (float) $row['TmaxAvg'],
				"DewPoint"          => (float) $row['TdewAvg'],
				"WBGTMax"           => (float) $row['WBGTmaxAvg'],
				"WBGT"              => (float) $row['WBGTmeanAvg'],
				"UTCIMax"           => (float) $row['UTCImaxAvg'],
				"UTCI"              => (float) $row['UTCImeanAvg'],
				"Model"		    => (string) $row['Model'],
				"Month"             => (int)  $row['Month'],
				"RcpNo"		    => (int) $row['RcpNo'],
	/* remove here */	"ErrorStr"          => "Data Loaded"
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

?>
