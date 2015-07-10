var arrGridResults = {};
var arrGridAverages = new Array();
var arrMonths = new Array('Annual Average', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
var numYears = 4;
var models = new Array('HadGem', 'NORES', 'GFDL', 'IPCM', 'MIROC');
var yearBrackets = new Array('1981-2005', '2011-2040', '2041-2070', '2071-2099');
var yearMid = new Array(1992.5, 2025.5, 2055.5, 2085);
var tableData = new Array();
var gradientArray = new Array();

//Create checkbox array for all models and both RCP no.s
var checkBoxModels = new Array;
for (x = 0; x < models.length; x++) {
	checkBoxModels.push(models[x] + "1");
	checkBoxModels.push(models[x] + "2");
}	
var rcpNos = new Array(0, 60, 85);
var rcpNoChks = new Array;
for (y = 0; y < rcpNos.length; y++) {
	rcpNoChks.push("chkRCP" + rcpNos[y]);
}

var modelColors = new Array('#ef4136', '#672d93', '#29aae3', '#8dc641', '#f8931f');
var timePeriods = new Array("19812004", "20112040", "20412070", "20712099");
showStations = false;
var probFlag = false;
var graph;
var numPlotted = 5; //Count number of plotted series to prevent axis refresh disruption

$(function () {
    CreateCheckBoxes();
    $('#lstYear').change(GetAllGridCellResultsModel);
    $('#lstMonth').change(function () {
        CurrentMonth = $(this).val();
        setCookie("lstMonth", CurrentMonth); // Store selected parameter in cookie.
        UncheckRCP6();  //If required
		GetAllGridCellResultsModel();
		ShowHideMonthDropDown();
    });
    $('#lstTempType').change(function () {
        CurrentTempType = $(this).val();
        setCookie("lstTempType", CurrentTempType); // Store selected parameter in cookie.
        ConvertTemps();
    });
    $('#lstParameter').change(function () {
        CurrentGraph = $(this).val();
        setCookie("lstParameter", CurrentGraph); // Store selected parameter in cookie.
        GetAllGridCellResultsModel();
    });
	$('#lstLineType').change(function () {
        CurrentLineType = $(this).val();
        setCookie("lstLineType", CurrentLineType); // Store selected parameter in cookie.
        GetAllGridCellResultsModel();
    });
	$('#lstYearBracket').change(function () {
		// t0 = performance.now();
		
		GetAllGridCellResultsModel();
		UncheckRCP6();
		//alert(numPlotted);
		//	ShowCheckBoxDiv();
	});
	
    //LMH
    SetDropDownValuesFromCookies();
	
	//Listener for model/RCP checkbox clicks - add/remove series on chart
	$('.tg-031e input[type=checkbox]').on('click', function(e) {
		
		var currentID = e.target.id;
		var checkStatus = e.target.checked;
		var modelCheck;
		var modelCheckIndex;
		var lineType = document.getElementById('lstLineType').selectedIndex == 2;

		for (r = 1; r < rcpNos.length; r++) {
		
			var rcpChk = document.getElementById('chkRCP' + rcpNos[r]).checked;
		
			if (rcpChk) {
				
				modelCheck = currentID + r;
				modelCheckIndex = checkBoxModels.indexOf(modelCheck);
				if (checkStatus) { numPlotted++; } else { numPlotted--; } //Check number of checkboxes checked to prevent axis refresh disruption
				ShowHideSeries(modelCheckIndex, checkStatus, lineType);
			}
		}
		//alert(numPlotted);	
		
		resetGraph();
	});
	
	
	//$$$Listener for model/RCP checkbox clicks - add/remove series on chart
	$('.tg-00t input[type=checkbox]').on('click', function(e) {	
		
		var currentID = e.target.id;
		var checkStatus = e.target.checked;
		
		RcpCheckBoxChanger(currentID, checkStatus);

	});
	
    //RenderGridCellCoordinates();
    GetAllGridCellResultsModel();
    //SetTextBoxLocation();
    $(".gllpSearchField").keypress(function (e) {
        if (e.which == 13) {
            $('.gllpSearchButton').click();
        }
    });
    $.jqplot.config.enablePlugins = true;
	$('.clear-cell-action').click(function(){
		clearAllCookies();
	});
	ShowHideMonthDropDown();
    $('#btnSaveGraph').click(function () { 
		graph.saveGraph();
	});
	$('#myModal').on('shown.bs.modal', function() {		
		selectTextCopy(); //Select text for copying on opening modal
    });
	//AdministerLineType();
});

function CreateCheckBoxes() {
	
	var output = '<div id="rcpHeaderTable"><table class="tg-031f">' 
					+ '<tr class="tg-031f"><td class="tg-00t"><input id="chkRCP60" type="checkbox" /></td>' 
					+ '<td class="tg-00xx"><label>RCP 6.0&nbsp;&nbsp;- - - -</label></td></tr>'
					+ '<tr class="tg-031f"><td class="tg-00t"><input checked="checked" id="chkRCP85" type="checkbox" /></td>'
					+ '<td class="tg-00xx"><label>RCP 8.5&nbsp;&nbsp;&mdash;&mdash;</span></label></td></tr></table></div>'
					+ '<div id="modelHeaderTable"><table class="tg-031f" width=390px;><tr>';
	
	for (x = 0; x < models.length; x++) {
		
		output += '<td class="tg-031e"><label><input checked="checked" id="' + models[x] + '" type="checkbox" /></label>'
					+ '<span style="color:' + modelColors[x] + '">' + models[x] + '</span></td>';
	}
	
	output += '</tr></table></div><div id="slopes"></div>';

/*					
	//Create table of checkboxes for each model and each RCP.  Only RCP=8.5 checked by default
	var output = '<table class="tg" width= 516px;><tr><th class="tg-00xs" colspan="2"><label>Select Model(s)</label></th><th class="tg-s6z2"><span style="color:' 
		+ modelColors[0] + '">' + 'HadGem' + '</span></th><th class="tg-031e"><span style="color:' + modelColors[1] + '">' + 'NORES' 
		+ '</span></th><th class="tg-031e"><span style="color:' + modelColors[2] + '">' + 'GFDL' + '</span></th><th class="tg-031e"><span style="color:' 
		+ modelColors[3] + '">' + 'IPCM' + '</span></th><th class="tg-031e"><span style="color:' + modelColors[4] + '">' + 'MIROC'
		+ '</span></th></tr><tr class="tg-031f"><td class="tg-00t"> \
			<input checked="checked" id="chkRCP60" type="checkbox" /></td><td class="tg-00xx"><label>RCP=6.0&nbsp;&nbsp;- - - - &nbsp;&nbsp;</label></td>';
	
	$(models).each(function (key, value) { // <span style="color:' + modelColors[key] + '">' + '6.0' + '</span>
		output += '<td class="tg-031e" rowspan="2"><label><input checked="checked" id="' + value + '" type="checkbox" /></label></td>';
	});
	//<td><a class="selectall" href="javascript:selectAllChecks(0);">Select all</a></td>
	 
	/***output += '</tr><tr class ="tg-031i"><td class="tg-00xx"><label><span id="rcpLabel">&mdash;&mdash; &nbsp;&nbsp; </span> \
					<span id="rcpLabel2" class="selectall" data-toggle="tooltip" title="Select all" onclick="selectAllCheck(1)">RCP=8.5</span> </label></td>';
	$(models).each(function (key, value) { // <span style="color:' + modelColors[key] + '">' + '8.5' + '</span>
		output += '<td class="tg-031g"><label><input checked="checked" id="' + value + 2 + '" type="checkbox" />  </label></td>';
	});
	***/
////	output += '</tr><tr class ="tg-031f"><td class="tg-00t"><input checked="checked" id="chkRCP85" type="checkbox" /></td><td class="tg-00xx"><label>RCP=8.5&nbsp;&nbsp;&mdash;&mdash; &nbsp;&nbsp; </span> \
		//			</label></td></tr></table>';	 


	//Add table to graph div
    $('#divModelInputs').html(output);
	
	//Create and populate year bracket dropdown
	output2 = '<select id="lstYearBracket">';
	
	var optionY = '';
	for (var i=0; i < yearBrackets.length; i++) {
		optionY += '<option value="'+ i + '">' + yearBrackets[i] + '</option>';
	}
	
	output2 += optionY + '</select>';

	$('#divGraphContainer').append(output2);
	$("#lstYearBracket").val('3'); //Select '2071-2099' by default
	
	output3 = '<select id="lstLineType"><option value="1">Smooth Line</option><option value="2">Straight Line</option><option value="3">Linear Trend</option></select>';
	$('#divGraphContainer').append(output3);
	$("#lstLineType").val('1'); //Select Smooth Line by default
}

function SetTextBoxLocation() {
    if (geoplugin_city() != "")
        $('.gllpSearchField').val(geoplugin_city() + ', ' + geoplugin_countryName())
    else
        $('.gllpSearchField').val(geoplugin_countryName())
}

function GetAllGridCellResultsModel() {

    //RenderGridCellCoordinates();
    var cached = false;
    $(arrGridResults).each(function (index, lcGridResult) {
        if ((lcGridResult.GridLat == gridLat) && (lcGridResult.GridLng == gridLng)) {
            cached = true;
            GetAllGridCellResultsModelSuccess(null);
            return false;
        }
    });
    if (cached)
        return true;
    var AJAXData = '{"latitude": ' + gridLat + ', "longitude": ' + gridLng + '}';
    AJAXCall("GetAllGridModelResults.php", AJAXData, GetAllGridCellResultsModelSuccess, GeneralServiceError);
	$('#jqPlotGraph').fadeTo( 100, 0.2, function() {});	
	$('#spinner').fadeIn(100);
	UncheckRCP6();
}

function GetAllGridCellResultsModelSuccess(prData) {
	$('#spinner').fadeOut(500);
	$('#jqPlotGraph').stop().fadeTo('slow',1);
    if (prData != null) {
		//Check the correct amount of data has been retrieved
		// 3years * 13months * 5models * 2rcpNos  +  1year * 13months * 5models * 1rcpNo
		var dataCount = (numYears - 1) * 13 * models.length * (rcpNos.length - 1) + 13 * models.length;
        if (prData.d.length == dataCount) {   //(numYears * 13 * models.length)) {
            $(prData.d).each(function(key, value){
              /* HACK for screwup in DB - LMH  
				if(value.Years == '2011204')
				{
                    value.Years = '20112040';
				} else if (value.Years == '2041207') {
					value.Years = '20412070';
				} else if (value.Years == '2071209') {
					value.Years = '20712099';
				}
				*/
                switch(value.Years){
                    case '19812004':
                        value.Years = 1992.5;
                        break;
					 case '19812005':
                        value.Years = 1993;
                        break;
                    case '20112040':
                        value.Years = 2025.5;
                        break;
                    case '20412070':
                        value.Years = 2055.5;
                        break;
                    case '20712099':
                        value.Years = 2085;
                        break;
                }
            });
            //Calculate average temp. etc. for each model, for each month, over all four year brackets.
            GetAverages(prData.d);
            if ($.isEmptyObject(arrGridResults))
			{
                arrGridResults = prData.d;
				
			} else {
                arrGridResults = arrGridResults.concat(prData.d);
				}
			if (probFlag) {
				map.panTo(new google.maps.LatLng(mapLat, mapLng));
				probFlag = false;
			}
        }
        else if (prData.d.length == 1) {
			// RYAN $('#jqPlotGraph').html('<p style="text-align:center;color:red;padding-top: 190px;">Sorry there are no results for the selected grid cell location</p>');
            $('#jqPlotGraph').html('<p style="text-align:center;color:red;padding-top: 190px;">' + prData.d[0].ErrorStr + '</p>');
			probFlag = true;
			//If there is no data and the user has loaded the page for the first time, call spiral out algorithm
			if (firstLoad) {
				
				noDataFound();
			}
			return false;
        }
	}
    GraphIt();
}

function RenderGridResult(prData) {
    var result = '';
    if (prData.ErrorStr == null) {
        if ($('#lstTempType').val() == "C")
            result = '<h2>Climate data for this grid cell area (in the shade)</h2>';
        else
            result = '<h2>Climate data for this grid cell area (in the shade)</h2>';
        result += '<table id="historicResults" border="0" cellpadding="5">';
        result += '<tr><td class="tdLabel"><b>Maximium Temperature:</b></td><td class="tdTemp">' + prData.TemperatureMax.toFixed(1) + '</td><td class="graphrow"><span id="lnkMaxTemp" class="graphbutton">View graph</span></td><td class="tdLabel"><b>WBGT Max:</b></td><td class="tdTemp">' + prData.WBGTMax.toFixed(1) + '</td><td><span id="lnkWBGTMax" class="graphbutton">View graph</span></td><td style="text-align: left;" valign="top" rowspan="2"><a href="#divExplainWBGT" class="graphexplain" data-toggle="modal">WBGT Explained</a></td></tr>';
        result += '<tr><td class="tdLabel"><b>Mean Temperature:</b></td><td class="tdTemp">' + prData.TemperatureMean.toFixed(1) + '</td><td class="graphrow"><span id="lnkMeanTemp" class="graphbutton">View graph</span></td><td class="tdLabel"><b>WBGT Mean:</b></td><td class="tdTemp">' + prData.WBGT.toFixed(1) + '</td><td><span id="lnkWBGTMean" class="graphbutton">View graph</span></td></tr>';
        result += '<tr><td class="tdLabel"><b>Minimum Temperature:</b></td><td class="tdTemp">' + prData.TemperatureMin.toFixed(1) + '</td><td><span id="lnkMinTemp" class="graphbutton">View graph</span></td><td class="tdLabel"><b>UTCI Max:</b></td><td class="tdTemp">' + prData.UTCIMax.toFixed(1) + '</td><td><span id="lnkUTCIMax" class="graphbutton">View graph</span></td><td style="text-align: left;" valign="top" rowspan="2"><a href="#divExplainUTCI" class="graphexplain" data-toggle="modal">UTCI Explained</a></td></tr>';
        result += '<tr><td class="tdLabel"><b>Mean Dew Point:</b></td><td class="tdTemp">' + prData.DewPoint.toFixed(1) + '</td><td><span id="lnkDewPoint" class="graphbutton">View graph</span></td><td class="tdLabel"><b>UTCI Mean:</b></td><td class="tdTemp">' + prData.UTCI.toFixed(1) + '</td><td><span id="lnkUTCIMean" class="graphbutton">View graph</span></td></tr>';
        result += '</table>';
    }
    else {
        result = '<h2>' + prData.ErrorStr + '</h2';
        $('#jqPlotThirty').html('');
        $('#jqPlotMonthly').html('');
        $('#divLookupGridResultResult').html(result);
        return false;
    }


    $('#divLookupGridResultResult').html(result);
    if ($('#lstTempType').val() == "F")
        if(prData.ErrorStr == null)
            ConvertTemps();
    $('#lnkMaxTemp').click(function () { CurrentGraph = "MaxTemp"; RenderGraph(); });
    $('#lnkMeanTemp').click(function () { CurrentGraph = "MeanTemp"; RenderGraph(); });
    $('#lnkDewPoint').click(function () { CurrentGraph = "MeanDewPoint"; RenderGraph(); });
    $('#lnkWBGTMax').click(function () { CurrentGraph = "MaxWBGT"; RenderGraph(); });
    $('#lnkWBGTMean').click(function () { CurrentGraph = "MeanWBGT"; RenderGraph(); });
    $('#lnkUTCIMax').click(function () { CurrentGraph = "MaxUTCI"; RenderGraph(); });
    $('#lnkUTCIMean').click(function () { CurrentGraph = "MeanUTCI"; RenderGraph(); });
    $('.graphbutton').click(function () {
        element_to_scroll_to = document.getElementById('scrollAnchor');
        element_to_scroll_to.scrollIntoView();
    });
    GraphIt();
}

function ConvertTemps() {
    if ($('#lstTempType').val() == "C")
        $('#divLookupGridResultResult h2').html('<h2>Climate data for this grid cell area (in the shade)</h2>');
    else
        $('#divLookupGridResultResult h2').html('<h2>Climate data for this grid cell area (in the shade)</h2>');
    $('#historicResults td.tdTemp').each(function (temp, index) {
        if ($(this).html() != "") {
            var lcTemperature = parseFloat($(this).html());
            if ($('#lstTempType').val() == "F")

                $(this).html(ConvertToFarenheit(lcTemperature).toFixed(1));
            else
                $(this).html(ConvertToCelcius(lcTemperature).toFixed(1));
        }
    });
    GraphIt();
}

function ConvertToCelcius(prTemperature) {
    return (prTemperature - 32) * 5 / 9;
}

function ConvertToFarenheit(prTemperature) {
    return prTemperature * 9 / 5 + 32;
}


function GetMonthlyRawData(prGridLat, prGridLng) {
    var result = {};
    $(arrGridAverages).each(function (index, average) {
        if ((average.GridLat == prGridLat) && (average.GridLng == prGridLng)) {
            result = average;
            return;
        }
    });
    return result;
}

function GetThirtyYearData(prLat, prLng, prYears, prMonth, prModels) {
    var results = new Array();
    var preSelect = new Array();
    for (var i = 0; i < arrGridResults.length; i++) {
        if (arrGridResults[i].GridLat == prLat && arrGridResults[i].GridLng == prLng && arrGridResults[i].Month == prMonth)
            preSelect.push(arrGridResults[i]);
    }
    for (var i = 0; i < prModels.length; i++) {
        var selected = new Array();
        for (var j = 0; j < preSelect.length; j++)
            if (preSelect[j].Model == models[prModels[i]])
                selected.push(preSelect[j]);
        results = results.concat(selected);
    }
    return results;
}

//This is for Monthly Only
//Calculate average temp. etc. for each model, for each month, over year bracket chosen in graph's dropdown
//(Ryan used to average the monthly averages over all four year brackets - this is incorrect according to Matthias.
function GetAverages(prData) {
	
	var dataForYear = prData;
	var currentLstYearBracketIndex = $("#lstYearBracket").val();
	
	//Get empty average objects
    var lcAverages = new MonthlyModelAverage();
	
    lcAverages.GridLat = dataForYear[0].GridLat;
    lcAverages.GridLng = dataForYear[0].GridLng;
	
	//For all the data for the grid, find each attribute's average, split up by model, and split up by month [and now split by year].
	//Therefore, the averages are for all year brackets.
    $(dataForYear).each(function (index, prRow) {
		
		var lcYear = $.inArray(prRow.Years, yearMid)
        var lcModel = $.inArray(prRow.Model, models)
		var lcRCPno = $.inArray(prRow.RcpNo, rcpNos)
		
		//If the year bracket is 1992.5 or 1993
		if (lcYear == -1 || lcRCPno == 0) { //Add the data to the first index (for the first year bracket) and put in slot for RCP=6.0
			lcAverages.UTCI[0][lcRCPno + 1][lcModel][prRow.Month] += prRow.UTCI;
			lcAverages.UTCIMax[0][lcRCPno + 1][lcModel][prRow.Month] += prRow.UTCIMax;
			lcAverages.WBGT[0][lcRCPno + 1][lcModel][prRow.Month] += prRow.WBGT;
			lcAverages.WBGTMax[0][lcRCPno + 1][lcModel][prRow.Month] += prRow.WBGTMax;
			lcAverages.DewPoint[0][lcRCPno + 1][lcModel][prRow.Month] += prRow.DewPoint;
			lcAverages.TemperatureMax[0][lcRCPno + 1][lcModel][prRow.Month] += prRow.TemperatureMax;
			lcAverages.TemperatureMean[0][lcRCPno + 1][lcModel][prRow.Month] += prRow.TemperatureMean;
		
		} else { //Add the data only to the specific RCP
			
			lcAverages.UTCI[lcYear][lcRCPno - 1][lcModel][prRow.Month] += prRow.UTCI;
			lcAverages.UTCIMax[lcYear][lcRCPno - 1][lcModel][prRow.Month] += prRow.UTCIMax;
			lcAverages.WBGT[lcYear][lcRCPno - 1][lcModel][prRow.Month] += prRow.WBGT;
			lcAverages.WBGTMax[lcYear][lcRCPno - 1][lcModel][prRow.Month] += prRow.WBGTMax;
			lcAverages.DewPoint[lcYear][lcRCPno - 1][lcModel][prRow.Month] += prRow.DewPoint;
			lcAverages.TemperatureMax[lcYear][lcRCPno - 1][lcModel][prRow.Month] += prRow.TemperatureMax;
			lcAverages.TemperatureMean[lcYear][lcRCPno - 1][lcModel][prRow.Month] += prRow.TemperatureMean
		}

    });
    // lcAverages.CalculateAverages(); // no longer applicable

    arrGridAverages = arrGridAverages.concat(lcAverages);
}

function MonthlyModelAverage() {
    this.GridLat = 0.0;
    this.GridLng = 0.0;
    this.UTCI = GetModelArrays();
    this.UTCIMax = GetModelArrays();
    this.WBGT = GetModelArrays();
    this.WBGTMax = GetModelArrays();
    this.DewPoint = GetModelArrays();
    this.TemperatureMax = GetModelArrays();
    this.TemperatureMean = GetModelArrays();
}

function GetModelArrays() {

	//Create 2D array, for RCP=6.0 and RCP=8.5
    var lcNewArray = new Array(); 
	
	for (var h = 0; h < (yearMid.length); h++) {  //Years 
		lcNewArray[h] = [];
		for (var i = 0; i < (rcpNos.length -1); i++) {  //RCP nos
			lcNewArray[h][i] = [];
			for (var j = 0; j < models.length; j++) { //Models
				lcNewArray[h][i][j] = GetModelArray();
			}
		}
	}
    return lcNewArray;
}

function GetModelArray() {
    return new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
}

MonthlyModelAverage.prototype.CalculateAverages = function () {
	for (var x = 0; x < (rcpNos.length -1); x++) {
		for (var y = 0; y < models.length; y++) {
			for (var i = 0; i < 13; i++) {
				this.UTCI[x][y][i] = this.UTCI[x][y][i] / numYears;
				this.UTCIMax[x][y][i] = this.UTCIMax[x][y][i] / numYears;
				this.WBGT[x][y][i] = this.WBGT[x][y][i] / numYears;
				this.WBGTMax[x][y][i] = this.WBGTMax[x][y][i] / numYears;
				this.DewPoint[x][y][i] = this.DewPoint[x][y][i] / numYears;
				this.TemperatureMax[x][y][i] = this.TemperatureMax[x][y][i] / numYears;
				this.TemperatureMean[x][y][i] = this.TemperatureMean[x][y][i] / numYears;
			}
		}
	}
}

//??
function GetErrorBandDataUTCI(prLat, prLng) {
    var errData = new Array();
    var month = 1;
    $(arrGridResults).each(function (index, lcGridResult) {
        if ((lcGridResult.GridLat == prLat) && (lcGridResult.GridLng == prLng)) {
            if (month == 13)
                month = 1;
            else {
                errData.push(new Array([month, lcGridResult.UTCI]));
                month += 1;
            }

        }
    });
    return errData;
}

function GetSelectedModels() {

    var selected = new Array();
    $('.tg-031e input[type=checkbox]:checked').each(function (key, value) {
        selected.push($.inArray(value.id, models));
    });
    return selected;
}

function GetSelectedRcpNos() {
 
    var selected = new Array();
	for (var x = 0; x < 3; x++) {
    //$('#divModelSelects input:checked').each(function (key, value) {
        selected.push(x);//$.inArray(value.id, models));
    //});
	}
    return selected;
}

function GraphIt() {
	try {
		//errdata = GetErrorBandDataUTCI(gridLat, gridLng);
		graph = new DFGraphModel();
		graph.models = [0,1,2,3,4]; //GetSelectedModels(); changed by LMH after addition of RCP 8.5
		graph.lat = gridLat;
		graph.lng = gridLng;
		graph.parameter = $("#lstParameter").val();
		graph.type = parseInt($('#lstMonth').val());
		graph.temperature = $('#lstTempType').val();
		graph.monthText = $("#lstMonth option:selected").text();
		graph.parameterText = $("#lstParameter option:selected").text();
		graph.parameterIndex = $("#lstParameter").prop("selectedIndex");
		graph.rcpNos = GetSelectedRcpNos();
		graph.createGraph();
	} catch(err) {
	}
}

// LMH
// Checks cookies if set from previous page or this page
function SetDropDownValuesFromCookies() {
    var lstParameterCookie = getCookie("lstParameter");
    var lstMonthCookie = getCookie("lstMonth");
    var lstTempTypeCookie = getCookie("lstTempType");
	var lstLineTypeCookie = getCookie("lstLineType");
	
    if ((lstParameterCookie != "") && (lstParameterCookie != "Min_Temp")) {
        $("#lstParameter").val(lstParameterCookie);
    }
    if (lstMonthCookie != "") {
        $("#lstMonth").val(lstMonthCookie);
    }
    if (lstTempTypeCookie != "") {
        $("#lstTempType").val(lstTempTypeCookie);
    } 
	if (lstLineTypeCookie != "") {
        $("#lstLineType").val(lstLineTypeCookie);
    } 
}

function clearAllCookies() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		deleteCookie(cookies[i].split("=")[0]);
	}
	location.reload();
}

function ShowHideSeries(modelCheckInd, chkStatus, lineType) {

	graph.plot.series[modelCheckInd].show = chkStatus;
	graph.plot.series[modelCheckInd].trendline.show = chkStatus && lineType;	

} 

//NO LONGER NEEDED
function ShowCheckBoxDiv() {

	var chosenYear = $("#lstYearBracket").val();		
	
	if (chosenYear == 0) {
		$('.tg-031f').hide();
		$('#rcpLabel').text('');
		$('#rcpLabel2').text('');				
		$('#graphnote-model').css('bottom', "-100px");
		
		/*var chkCnt = 0;
		$(".tg-031f input[type=checkbox]").each(function() {
			if (this.checked) {

				$(this).prop('checked', false); 
				numPlotted--;
				graph.plot.series[chkCnt * 2].show = false;
				
			}
			chkCnt++;
		});
		
		var rescaleIt = (numPlotted != 0);
		graph.plot.replot({ resetAxes: rescaleIt });  */
		//resetGraph(); //Reset so that the series at zero degrees does not appear in the saved graph image
		
	} else {
		$('.tg-031f').show();
		$('#rcpLabel').text('\u2014\u2014\u00A0\u00A0\u00A0'); //Unicode dashes and spaces
		$('#rcpLabel2').text('RCP=8.5'); //Unicode dashes and spaces

		$('#graphnote-model').css('bottom', "-90px");
	}
}

function ShowHideMonthDropDown() {
	
	var chosenMonth = $("#lstMonth").val();	
	if (chosenMonth == -1) {
	
		$('#lstYearBracket').show();
		//ShowCheckBoxDiv(); //???
		$('#btnShowTable').hide();
		$('#lstLineType').hide();
		
	} else {
		$('#lstYearBracket').hide();
	//	$('.tg-031f').show();
	//	$('#rcpLabel').text('\u2014\u2014\u00A0\u00A0\u00A0'); //Unicode dashes and spaces
	//	$('#rcpLabel2').text('RCP=8.5'); //Unicode dashes and spaces
	//	$('#graphnote-model').css('bottom', "-90px"	);
		$('#btnShowTable').show();
		$('#lstLineType').show();
	}	
}
 
//Store table data in global array
function StoreDataTable(prGraphData) {
	
	tableData = prGraphData;
}
	
function CreateDataTable() {
	
	//The table will be different if the user has selected only RCP 8.5 checkboxes or only RCP 6.0 checkboxes.  
	//If they selected even one of the both RCP No.s the full table is composed. 
	 var modelsSelected = GetSelectedModels(); //Get which models and RCP no.s have been checked by user	
	/*var flag60 = 0; 
	var flag85 = 0;
	
	//Determine if either RCP 6.0 or RCP 8.5 have been checked by the user
	for (a = 0; a < rcpsSelected.length; a++) {
		if (rcpsSelected[a] % 2 == 0) {
			flag60 = 1;
		} else {
			flag85 = 1;
		}
	}
	*/
	var rcpPresent = new Array();
	
	for (r = 1; r < rcpNos.length; r++) {
		
		var rcpChk = (document.getElementById('chkRCP' + rcpNos[r]).checked) ? 1 : 0;
		rcpPresent.push(rcpChk);
	}
	
	//var rcpPresent = [flag60, flag85];  
	var indexZero = rcpPresent.indexOf(0); //Find if either RCP 6.0 or RCP 8.5 have been checked by the user
	var titleColSpan;
	var yearColSpan;
	
	//The first row for the title will be 10 cells wide if both RCPs are ticked, otherwise 6 cells wide
	if (indexZero == -1) {
		titleColSpan = 10;
		yearColSpan = 2;
	} else {
		titleColSpan = 6;
		yearColSpan = 1;
	}
	
	//Title
	tableTitle = graph.jqPlotOptionsThirty.title;
	tableTitle = tableTitle.replace(")<div>", " (\xB0" + graph.temperature + ").&nbsp;&nbsp;");
	tableTitle = tableTitle.replace("</div>", "&nbsp;&nbsp;");
	tableTitle = tableTitle.replace(" &", ",");
	tableTitle = tableTitle.replace("(", ",&nbsp;");

	//$('#myModalLabel').html(tableTitle);
	
	//Table
	var result = '';
	result += '<table id="popupTable" border="0" cellpadding="5">';
	result += '<thead><tr><th colspan="' + titleColSpan + '">' + tableTitle +'</th></tr>';

	result += '<thead><tr><th class="firstCol">Years</th>';
	result += '<th colspan="1">' + yearBrackets[0] + '</th>'; //First year bracket, only one col

	//For subsequent year brackets, put values in and span columns appropriately
	for (a = 1; a < yearBrackets.length; a++) {
		
		result += '<th colspan="' + yearColSpan + '">' + yearBrackets[a] + '</th>';
	}
	result += '<th colspan="' + yearColSpan + '">Trend (\xB0/decade)</th></tr><tr><th class="firstCol">RCP No.</th><th colspan="1">\u2013</th>'; //First year bracket, only one col
	
	//For subsequent year brackets
	for (b = 1; b < yearBrackets.length + 1; b++) {
		
		//For RCP No.s that have ticked checkboxes
		for (r = 1; r < rcpNos.length; r++) {
		
			if (rcpPresent[r - 1] == 1) {
			
				result += '<th>' + (rcpNos[r] / 10).toFixed(1) + '</th>';
			}
		}
	}
	
	//Table body
	result += '</tr></thead><tbody>';

	for (x = 0; x < models.length; x++) { //For each model
		
		//For only the models that have a tick in either of the RCP No. checkboxes, make a row for this model
		if ((modelsSelected.indexOf(x) > -1)) {
		
			var modelResult = '<tr><td class="firstCol">' + models[x] + '</td>';
			
			for (y = 0; y < yearMid.length; y++) { //For each year bracket
			
				for (z = 1; z < rcpNos.length; z++) { //For each RCP number
					
					if ((y == 0) && (rcpPresent[0] == 1 || rcpPresent[1] == 1)) { //If year bracket = 1991-2005
						
						modelResult += '<td colspan="1">' + tableData[x][z][y][1].toFixed(2) + '</td>'; //Merge
						z++;
						
					} else {
						if (rcpPresent[z - 1] == 1) { //For RCP No.s that have ticked checkboxes only

							modelResult += '<td>' + tableData[x][z][y][1].toFixed(2) + '</td>';
						}
					}					
				}
				
			}
			for (z = 1; z < rcpNos.length; z++) { //For each RCP number

				if (rcpPresent[z - 1] == 1) { //For RCP No.s that have ticked checkboxes only

					modelResult += '<td>' + gradientArray[x][z]['slope'].toFixed(2) + '</td>';
				}
			}
			modelResult += '</tr>';
			result += modelResult;
		}
	}
	result += '</tbody></table>';

   $('#dataTable').html(result);
   $('#csvcode').val(result);
   $('#myModal').modal('show');
   
   //If no check boxes have been checked, there will be an empty table, so show error msg
	if ((rcpPresent[0] == 0 && rcpPresent[1] == 0) || (modelsSelected.length == 0)) {
		showMessageModal("Please check a checkbox under the graph to view the data");
	}	
}
 
function getHtmlData() {
	//Put zero in hidden box to signify to PHP that an Excel doc is to be written
	$("#exportType").val('0');
	$("#excel").val('<table border="1">'+$("#popupTable").clone().html()+'</table>');
	document.forms["frmDataTable"].submit();
}

function getHtmlDataCSV() {
	//Put 1 in hiiden box to signify to PHP that a csv doc is to be written
	$("#exportType").val('1');	
	document.forms["frmDataTable"].submit();
}

function selectTextCopy() {
	
	//Select table for copying
	selectElementContents( document.getElementById('popupTable') ); 	
	//showMessageModal("Press CTRL + C to copy the table to the clipboard");
}

function showMessageModal(messStr) {

	$("#noDataMsg").html(messStr);
	$('#noDataMsg').fadeIn("fast", function() { $(this).delay(5000).fadeOut("slow"); });	
}

function selectAllCheck(rowNo) {
	
	var lineType = document.getElementById('lstLineType').selectedIndex == 2;

	//Tick all boxes on row depending on whether it is already ticked or what row it is on
	for (x = 0; x < checkBoxModels.length; x++) {
		
		//If the checkbox is not already checked
		if (!($('#' + checkBoxModels[x]).is(":checked"))) {
			
			if (x % 2 == rowNo) {
				
				$('#' + checkBoxModels[x]).prop('checked', true);
				ShowHideSeries(x, true, lineType); //Unhide series
				numPlotted++;
			}
		}
	} 	
	resetGraph();
}

function resetGraph() {
	
	//$('#btnSaveGraph').remove();
 
	//Since the graph is replotted, the shaded axis, hover poup and save graph image functions must be re-run
	if (graph.parameter.indexOf("WBGT") != -1 || graph.parameter.indexOf("UTCI") != -1) {
		graph.shadeGraph();		
	}
	graph.scaleEvents();
	var rescaleIt = (numPlotted != 0);
	graph.plot.replot({ resetAxes: rescaleIt });
	//graph.saveGraph();
}

function UncheckRCP6() {

	var chosenYear = $("#lstYearBracket").val();		
	var rcp60checked = document.getElementById("chkRCP60").checked;
	var chosenMonth = $("#lstMonth").val();	
	
	if (chosenYear == 0 && chosenMonth == -1) {
		//$("#chkRCP60").prop("disabled", true);
		$(".tg-00t").css({"visibility":"hidden"});
		$(".tg-00xx").css({"visibility":"hidden"});
		
		if (rcp60checked) {
		$('#chkRCP60').prop('checked', false);
		//$('input[name=check1]').attr('checked', true).triggerHandler('click');
		//document.getElementById("chkRCP60").onclick();
RcpCheckBoxChanger("chkRCP60", false);
		/*var chkCnt = 0;
		$(".tg-031f input[type=checkbox]").each(function() {
			if (this.checked) {

				$(this).prop('checked', false); 
				numPlotted--;
				graph.plot.series[chkCnt * 2].show = false;
				
			}
			chkCnt++;
		}); */
		//alert(numPlotted);
		}
	}
	else {
		$(".tg-00t").css({"visibility":"visible"});
		$(".tg-00xx").css({"visibility":"visible"});
		
	}
}	
	
function RcpCheckBoxChanger(prCurrentID, prCheckStatus) {
	var currentID = prCurrentID;
		var checkStatus = prCheckStatus;
		var checkedRCPIndex = rcpNoChks.indexOf(currentID);
		var modelName;
		var modelArray;
		var modelArrayIndex;
		var modelCheckedStatus;
		var lineType = document.getElementById('lstLineType').selectedIndex == 2;
	
		for (m = 0; m < models.length; m++) {
			
			modelName = models[m];
			modelArray = models[m] + checkedRCPIndex;
			modelArrayIndex = checkBoxModels.indexOf(modelArray);
			modelCheckedStatus = document.getElementById(modelName).checked;

			if (checkStatus && modelCheckedStatus) { 
				numPlotted++; //
			} else if (!(checkStatus) && modelCheckedStatus) {
				numPlotted--; 
			} //Check number of checkboxes checked to prevent axis refresh disruption
			//alert (numPlotted);
			ShowHideSeries(modelArrayIndex, (checkStatus && modelCheckedStatus), lineType);
		}
		//alert(numPlotted);
		resetGraph();
}	

function PopulateGradientTable(prGradientArray, lineType) {
	
	gradientArray = prGradientArray;
	var tableOutput = '<table id="gradientTable"><tr class = "tg-00r">';
	
	for (r = 1; r < rcpNos.length; r++) {
		for (x = 0; x < models.length; x++) {
			
			tableOutput += '<td class="tg-00' + x + '">' + gradientArray[x][r]['slope'].toFixed(2) + '</td>';			
		}
		if (r==1) {
			tableOutput += '<td class="tg-00r2" rowspan="2"><span id="deg">°/</span><br>decade</td></tr><tr class = "tg-00r">';
		} else {
			tableOutput += '</tr><tr class = "tg-00r">';
		}
	}
	tableOutput += '</tr></table>';
	$('#slopes').html(tableOutput);
	
	if (lineType == 2) {
		document.getElementById('gradientTable').style.display='block';
		$("#modelHeaderTable").css('top', "0px");
	} else {
		document.getElementById('gradientTable').style.display='none';
		$("#modelHeaderTable").css('top', "30px");
	}
}


