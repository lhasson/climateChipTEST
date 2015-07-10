<?php

/*============================================
*
*	Calculates the WBGT and  UTCI shade heat 
*	stress calculations.  Users enter a 
*	temperature and humidity value and click 
*	the Calculate button.
*
*	Originally written in C# by 
*	Ryan Clarke in 2014.
*	Translated into PHP by 
*	Lloyd Hasson, 04 December 2014
*
*===========================================*/

class WBGTResult {
	
	private $_WBGT = null;
	private $_UTCI = null;
	private $_ErrorStr = null;
	
	public function set_WBGT($_WBGT){
		$this->_WBGT = $_WBGT;
	}
	public function set_UTCI($_UTCI){
		$this->_UTCI = $_UTCI;
	}
	public function set_ErrorStr($_ErrorStr){
		$this->_ErrorStr = $_ErrorStr;
	}
	
	public function get_WBGT(){
		$_WBGTout = $this->_WBGT;
		if ($_WBGTout == -1)
		{
			return -1;
		}
		else
		{
			return number_format ($_WBGTout, 2);
		}
	}
	public function get_UTCI(){
		$_UTCIout = $this->_UTCI;
		if ($_UTCIout == -1)
		{
			return -1;
		}
		else
		{
			return number_format ($_UTCIout, 2);
		}
	}
	public function get_ErrorStr(){
		return $this->_ErrorStr;
	}
}

class  ClimateCHIPCalcuations
{
	public static function CalculateWBGTOptions($temperature, $temperatureType, $humidity, $humidityType)
	{
		// temperatureType: 'C'elsius, 'F'ahrenheit
		// humidityType: 'D'ewpoint, 'H'umidity, 'V'apour Pressure

		$lcResults = new WBGTResult;
		
		try
		{
			$lcDewPt;
			$lcTemp;

			switch ($temperatureType)
			{
				case "C": 
					$lcTemp = $temperature;
					break;
				case "F": 
					$lcTemp = self::Celsius($temperature);
					break;
				default: 
					return $lcResults;
			}

			switch ($humidityType)
			{
				case "D": 
					$lcDewPt = $humidity;
					break;
				case "V": 
					$lcDewPt = self::dewPoint($humidity);
					break;
				case "H": 
					$lcDewPt = self::dewPoint2($humidity, $lcTemp);
					break;
				default: 
					return $lcResults;
			}

			if ($lcTemp > 50 || ($lcDewPt > $lcTemp))    // error conditions
			{
				$lcResults->set_WBGT(-1);
				$lcResults->set_UTCI(-1);
				$lcResults->set_ErrorStr("Input temperature must be below 50 C, and humidity no higher than 100%");
			}
			else
			{
				$lcResults->set_WBGT(self::CalculateWBGTSimple($lcTemp, $lcDewPt));
				$lcResults->set_UTCI(self::UTCI_approx($lcTemp, $lcDewPt));
				
				if ($temperatureType == "F")
				{
					$lcResults->set_WBGT(self::Fahrenheit($lcResults->get_WBGT()));
					$lcResults->set_UTCI(self::Fahrenheit($lcResults->get_UTCI()));
				}
			}
		}
		catch (Exception $ex)
		{
			$lcResults->set_WBGT(-1);
			$lcResults->set_UTCI(-1);
			$lcResults->set_ErrorStr($ex->getMessage());
		}

		return $lcResults;
	}

	private static function UTCI_approx($Ta, $Td)
	
	// DOUBLE PRECISION Function value is the UTCI in degree Celsius
	//  computed by a 6th order approximating polynomial from the 4 Input paramters 
	//  
	//  Input parameters (all of type DOUBLE PRECISION)
	//  - Ta       : air temperature, degree Celsius
	//  - Pa    : water vapour presure, hPa=hecto Pascal
	//  - Tmrt   : mean radiant temperature, degree Celsius
	//  - va10m  : wind speed 10 m above ground level in m/s
	//  
	//   UTCI_approx, Version a 0.002, October 2009
	//   Copyright (C) 2009  Peter Broede
	//
	
	{
		
		// Note the followinf simplifications, assumption:
		// va: wind (air) speed, here 1

		// D_Tmrt: difference between the mean radiant temperature and the ambient temperature
		// Since we are indoors this = 0.
		// Matthias Otto, Bruno Lemke, 2010


		//double Pa = ehPa / 10.0; // use vapour pressure in kPa
		$Pa = 0.6108 * exp(17.29 * $Td / ($Td + 237.3)); // Bruno's formula

		return $Ta +
			(6.07562052E-01) +
			(-2.27712343E-02) * $Ta +
			(8.06470249E-04) * $Ta * $Ta +
			(-1.54271372E-04) * $Ta * $Ta * $Ta +
			(-3.24651735E-06) * $Ta * $Ta * $Ta * $Ta +
			(7.32602852E-08) * $Ta * $Ta * $Ta * $Ta * $Ta +
			(1.35959073E-09) * $Ta * $Ta * $Ta * $Ta * $Ta * $Ta +
			(-2.25836520E+00)  +
			(8.80326035E-02) * $Ta +
			(2.16844454E-03) * $Ta * $Ta +
			(-1.53347087E-05) * $Ta * $Ta * $Ta +
			(-5.72983704E-07) * $Ta * $Ta * $Ta * $Ta +
			(-2.55090145E-09) * $Ta * $Ta * $Ta * $Ta * $Ta +
			(-7.51269505E-01)  +
			(-4.08350271E-03) * $Ta +
			(-5.21670675E-05) * $Ta * $Ta +
			(1.94544667E-06) * $Ta * $Ta * $Ta +
			(1.14099531E-08) * $Ta * $Ta * $Ta * $Ta +
			(1.58137256E-01)  +
			(-6.57263143E-05) * $Ta +
			(2.22697524E-07) * $Ta * $Ta +
			(-4.16117031E-08) * $Ta * $Ta * $Ta +
			(-1.27762753E-02)  +
			(9.66891875E-06) * $Ta +
			(2.52785852E-09) * $Ta * $Ta +
			(4.56306672E-04)  +
			(-1.74202546E-07) * $Ta +
			(-5.91491269E-06)  +
			(5.12733497E+00) * $Pa +
			(-3.12788561E-01) * $Ta * $Pa +
			(-1.96701861E-02) * $Ta * $Ta * $Pa +
			(9.99690870E-04) * $Ta * $Ta * $Ta * $Pa +
			(9.51738512E-06) * $Ta * $Ta * $Ta * $Ta * $Pa +
			(-4.66426341E-07) * $Ta * $Ta * $Ta * $Ta * $Ta * $Pa +
			(5.48050612E-01)  * $Pa +
			(-3.30552823E-03) * $Ta* $Pa +
			(-1.64119440E-03) * $Ta * $Ta* $Pa +
			(-5.16670694E-06) * $Ta * $Ta * $Ta* $Pa +
			(9.52692432E-07) * $Ta * $Ta * $Ta * $Ta* $Pa +
			(-4.29223622E-02) * $Pa +
			(5.00845667E-03) * $Ta* $Pa +
			(1.00601257E-06) * $Ta * $Ta* $Pa +
			(-1.81748644E-06) * $Ta * $Ta * $Ta* $Pa +
			(-1.25813502E-03) * $Pa +
			(-1.79330391E-04) * $Ta* $Pa +
			(2.34994441E-06) * $Ta * $Ta* $Pa +
			(1.29735808E-04) * $Pa +
			(1.29064870E-06) * $Ta* $Pa +
			(-2.28558686E-06) * $Pa +
			(-2.80626406E+00) * $Pa * $Pa +
			(5.48712484E-01) * $Ta * $Pa * $Pa +
			(-3.99428410E-03) * $Ta * $Ta * $Pa * $Pa +
			(-9.54009191E-04) * $Ta * $Ta * $Ta * $Pa * $Pa +
			(1.93090978E-05) * $Ta * $Ta * $Ta * $Ta * $Pa * $Pa +
			(-3.08806365E-01)  * $Pa * $Pa +
			(1.16952364E-02) * $Ta* $Pa * $Pa +
			(4.95271903E-04) * $Ta * $Ta* $Pa * $Pa +
			(-1.90710882E-05) * $Ta * $Ta * $Ta* $Pa * $Pa +
			(2.10787756E-03) * $Pa * $Pa +
			(-6.98445738E-04) * $Ta* $Pa * $Pa +
			(2.30109073E-05) * $Ta * $Ta* $Pa * $Pa +
			(4.17856590E-04) * $Pa * $Pa +
			(-1.27043871E-05) * $Ta* $Pa * $Pa +
			(-3.04620472E-06) * $Pa * $Pa +
			(-3.53874123E-02) * $Pa * $Pa * $Pa +
			(-2.21201190E-01) * $Ta * $Pa * $Pa * $Pa +
			(1.55126038E-02) * $Ta * $Ta * $Pa * $Pa * $Pa +
			(-2.63917279E-04) * $Ta * $Ta * $Ta * $Pa * $Pa * $Pa +
			(4.53433455E-02)  * $Pa * $Pa * $Pa +
			(-4.32943862E-03) * $Ta* $Pa * $Pa * $Pa +
			(1.45389826E-04) * $Ta * $Ta* $Pa * $Pa * $Pa +
			(2.17508610E-04) * $Pa * $Pa * $Pa +
			(-6.66724702E-05) * $Ta* $Pa * $Pa * $Pa +
			(3.33217140E-05) * $Pa * $Pa * $Pa +
			(6.14155345E-01) * $Pa * $Pa * $Pa * $Pa +
			(-6.16755931E-02) * $Ta * $Pa * $Pa * $Pa * $Pa +
			(1.33374846E-03) * $Ta * $Ta * $Pa * $Pa * $Pa * $Pa +
			(3.55375387E-03)  * $Pa * $Pa * $Pa * $Pa +
			(-5.13027851E-04) * $Ta* $Pa * $Pa * $Pa * $Pa +
			(1.02449757E-04) * $Pa * $Pa * $Pa * $Pa +
			(8.82773108E-02) * $Pa * $Pa * $Pa * $Pa * $Pa +
			(-3.01859306E-03) * $Ta * $Pa * $Pa * $Pa * $Pa * $Pa +
			(1.04452989E-03)  * $Pa * $Pa * $Pa * $Pa * $Pa +
			(1.48348065E-03) * $Pa * $Pa * $Pa * $Pa * $Pa * $Pa;
	}

	private static function Fahrenheit($prCelsius)
	{
		return 9 / 5 * $prCelsius + 32;
	}

	private static function Celsius($prFahrenheit)
	{
		return 5 / 9 * ($prFahrenheit - 32);
	}

	private static function dewPoint2($prhum, $prTemp)
	{
		$lcSatVapPres = 6.112 * pow(exp(1), 17.67 * $prTemp / (243.5 + $prTemp));
		// alternatively: (literature
		// double lcSatVapPres = 6.112D * Math.Pow(Math.E, 17.62D * prTemp / (243.12D + prTemp));
		return self::dewPoint($prhum / 100 * $lcSatVapPres);
	}

	private static function dewPoint($prVapPressure)
	{
		$x = log($prVapPressure / 6.112, exp(1));
		return (243.5 * $x) / (17.67 - $x);
	}

	public static function CalculateWBGTSimple($temperature, $humidity)
	{
		// humidity = dewpoint expected
		return 0.67 * self::fTw($temperature, $humidity) + 0.33 * $temperature;
		//return temperature * humidity;
	}

	private static function fTw($Ta, $Td)
	{
		// Ta ambient temperature
		// Td dewpoint temperature
		$Tw = $Td;
		$Diff = 10000;
		$Ed = self::calcE($Td);
		$DiffOld;
		do
		{
			$DiffOld = $Diff;
			$Ew = self::calcE($Tw);
			$Diff = ($Ed - $Ew) * (1556 - 1.484 * $Tw) + 101 * ($Ta - $Tw);
			$Tw += 0.2;
			if ($Tw > $Ta) break;
		} while ($Diff > 0 && $DiffOld > 0 || $Diff < 0 && $DiffOld < 0);

		if ($Tw > $Td + 0.3)
			return $Tw - 0.3;
		else
			return $Td;
	}

	private static function calcE($T)
	{
		return 0.6106 * exp(17.27 * $T / (237.3 + $T));
	}
}


### EXECUTE #############################################################

$aPOST = json_decode(file_get_contents('php://input'),true);  // POST arrives  as $HTTP_RAW_POST_DATA (JSON/XML...), decode into array ('true' parameter)
$fTemperature = filter_var($aPOST['temperature'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);  // Sanitize POST var to be float (prevent mysql injection) needed here???
$fHumidity  = filter_var($aPOST['humidity'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
$sTemperatureType = $aPOST['temperatureType'];
$sHumidityType = $aPOST['humidityType'];

$WBGTResult = ClimateCHIPCalcuations::CalculateWBGTOptions($fTemperature, $sTemperatureType, $fHumidity, $sHumidityType);

// this works with 'd.'
//$aMasterArray['d'] = array(
//	"WBGT" =>	$WBGTResult->get_WBGT(), 
//	"UTCI" =>	$WBGTResult->get_UTCI(),
//	"ErrorStr" => $WBGTResult->get_ErrorStr()
//	);
//
//print(json_encode($aMasterArray));

// simplified:
print(json_encode(array(
	"WBGT" =>	$WBGTResult->get_WBGT(), 
	"UTCI" =>	$WBGTResult->get_UTCI(),
	"ErrorStr" => $WBGTResult->get_ErrorStr()
	)));

die();

?>	


