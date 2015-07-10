<?php
	
	//A HTML DOM parser written in PHP5+ let you manipulate HTML in a very easy way
	include "simple_html_dom.php";
	
	//If export type is .xls
	if($_POST['exportType'] == 0) {
		
		if(isset($_POST['excel']) && $_POST['excel'])
		{
			# Download  Excel (.xls) File...
			header('Content-Disposition: attachment; filename="' . $_POST['tableName'] .'.xls"');
			header("Content-Type: application/vnd.ms-excel");
			

			echo $_POST['excel'];
			exit();
		}
	}
	else
	{
		//If export type is .csv
		if(isset($_POST['csvcode']) && $_POST['csvcode'])
		{	
			//Get red of html spaces and dash
			$htmlsp = preg_replace("/\s|&nbsp;/",'  ', $_POST['csvcode']);
			$htmldsh = str_replace("&mdash;","&#176;", $htmlsp);
			$html = str_get_html($htmldsh); 
		
			header('Content-Description: File Transfer');
			header('Content-Type: application/octet-stream'); 
			header('Content-Disposition: attachment; filename="' . $_POST['tableName'] .'.csv"');
			header('Content-Transfer-Encoding: binary');
			header('Expires: 0');
			header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
			header('Pragma: public');
			echo "\xEF\xBB\xBF"; // UTF-8 BOM
			
			$fp = fopen("php://output", "w");
			$rowNo = 1;
				
			foreach($html->find('tr') as $element) {
			
				$colNo = 1;
				$td = array();
				foreach( $element->find('th') as $row) {
				
					if (strpos(trim($row->class), 'actions') === false && strpos(trim($row->class), 'checker') === false) {
						if ($rowNo == 2) { //Repeat year bracket headers only on row 2
							
							
							if (strpos($row,'colspan="2"') !== false) {
							
								if ($colNo > 2) { //Repeat year bracket headers for 2011-2040 and over
									$td [] = $row->plaintext;
									$td [] = $row->plaintext;
								}
								else
								{
									$td [] = $row->plaintext;
								}
							} 
							else
							{
								$td [] = $row->plaintext;
							}
						}
						else
						{
							$td [] = $row->plaintext;
						}
					
					$colNo++;		
					}
				}
				if (!empty($td)) {
					fputcsv($fp, $td);
				}

				$td = array();
				foreach( $element->find('td') as $row) {
					if (strpos(trim($row->class), 'actions') === false && strpos(trim($row->class), 'checker') === false) {
					$td [] = $row->plaintext;
					}
				}
				if (!empty($td)) {
					fputcsv($fp, $td);
				}
				$rowNo++;
			}

			fclose($fp);
			exit;
		}
	}	
?>