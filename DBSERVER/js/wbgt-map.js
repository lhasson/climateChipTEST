var arrGridResults = {};
var arrGridAverages = new Array();
var arrMonths = new Array('Annual Average', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
var numYears = 32;
var probFlag = false;
var graph;

//var FirstRun = true;

$(function () {

    $('#lstYear').change(GetAllGridCellResults);
    $('#lstMonth').change(function () {
        CurrentMonth = $(this).val();
        setCookie("lstMonth", CurrentMonth); // Store selected parameter in cookie.
        GetAllGridCellResults();
    });
    $('#lstTempType').change(function () {
        CurrentTempType = $(this).val();
        setCookie("lstTempType", CurrentTempType); // Store selected parameter in cookie.
        ConvertTemps();
    });
    $('#lstParameter').change(function () {
        CurrentGraph = $(this).val();
        setCookie("lstParameter", CurrentGraph); // Store selected parameter in cookie.
        GetAllGridCellResults();
    });
    //LMH
    SetDropDownValuesFromCookies();
     //RenderGridCellCoordinates();
    GetAllGridCellResults();
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
	 $('#btnSaveGraph').click(function () { 
		graph.saveGraph();
	});
});

function SetTextBoxLocation() {
    if (geoplugin_city() != "")
        $('.gllpSearchField').val(geoplugin_city() + ', ' + geoplugin_countryName())
    else
        $('.gllpSearchField').val(geoplugin_countryName())
}

function GetAllGridCellResults() {
   //RenderGridCellCoordinates();
    var cached = false;
    $(arrGridResults).each(function (index, lcGridResult) {
        if ((lcGridResult.GridLat == gridLat) && (lcGridResult.GridLng == gridLng)) {
            cached = true;
            GetAllGridCellResultsSuccess(null);
            return false;
        }
    });
    if (cached)
        return true;
    var AJAXData = '{"latitude": ' + gridLat + ', "longitude": ' + gridLng + '}';
    AJAXCall("GetAllGridResults.php", AJAXData, GetAllGridCellResultsSuccess, GeneralServiceError);
	//LMH
	$('#spinner').fadeIn(100);
	$('#jqPlotGraph').fadeTo( 100, 0.2, function() {});	
	/*    AJAXCall("/ClimateCHIPInterfaceService.svc/GetAllGridResults", AJAXData, GetAllGridCellResultsSuccess, GeneralServiceError) */
}

function GetAllGridCellResultsModel() {
    RenderGridCellCoordinates();
    var cached = false;
    $(arrGridResults).each(function (index, lcGridResult) {
        if ((lcGridResult.GridLat == gridLat) && (lcGridResult.GridLng == gridLng)) {
            cached = true;
            GetAllGridCellResultsSuccess(null);
            return false;
        }
    });
    if (cached)
        return true;
    var AJAXData = '{"latitude": ' + gridLat + ', "longitude": ' + gridLng + '}';
    AJAXCall("GetAllGridModelResults.php", AJAXData, GetAllGridCellResultsSuccess, GeneralServiceError);
	$('#jqPlotGraph').fadeTo( 100, 0.2, function() {});	
	$('#spinner').fadeIn(100);
/*	AJAXCall("/ClimateCHIPInterfaceService.svc/GetAllGridModelResults", AJAXData, GetAllGridCellResultsSuccess, GeneralServiceError) */
}

function timeoutErr(prXHR, prTextStatus, prError) {
  alert('timeoi');
}

function GetAllGridCellResultsSuccess(prData) {
	$('#spinner').fadeOut(500);
	$('#jqPlotGraph').stop().fadeTo('slow',1);
    if (prData != null)
        if (prData.d.length == (numYears * 13)) {
            GetAverages(prData.d);
            if ($.isEmptyObject(arrGridResults))
                arrGridResults = prData.d;
            else
                arrGridResults = arrGridResults.concat(prData.d);
			if (probFlag) {
				map.panTo(new google.maps.LatLng(mapLat, mapLng));
				probFlag = false;
			}
        }
        else if (prData.d.length == 1) {
           //RenderGridResult(prData.d[0]); //Ryan
           //GraphIt(); //Ryan
            $('#jqPlotGraph').html('<p style="text-align:center;color:red;padding-top: 190px;">Sorry there are no results for the selected grid cell location</p>');
			probFlag = true;
			
			//If there is no data and the user has loaded the page for the first time, call spiral out algorithm
			if (firstLoad) {
				
				noDataFound();
			}

            return false;
        }
		
	//Ryan
    //$(arrGridResults).each(function (index, lcResult) {
    //    var lcYear = parseInt($('#lstYear').val());
    //    var lcMonth = parseInt($('#lstMonth').val());
    //    if ((lcResult.GridLat == gridLat) && (lcResult.GridLng == gridLng) && (lcResult.Year == lcYear) && (lcResult.Month == lcMonth)) {
    //       //RenderGridResult(lcResult);
           
    //        return false;
    //    }
    //});
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
    $('#lnkMinTemp').click(function () { CurrentGraph = "MinTemp"; RenderGraph(); });
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
    //if (FirstRun) {
    //   CurrentGraph = 'MeanTemp';
    //   RenderGraph();
    //   FirstRun = false;
    //}
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

function GetThirtyYearData(prLat, prLng, prYears, prMonth) {
    var lcFirstIndex = -1;
    $(arrGridResults).each(function (index, lcGridResult) {
        if ((lcGridResult.GridLat == prLat) && (lcGridResult.GridLng == prLng)) {
            lcFirstIndex = index;
            return false;
        }
    });
    var results = new Array();
    for (var i = 0; i < prYears; i++) {
        results[i] = arrGridResults[(i * 13) + lcFirstIndex + prMonth];
    }
    return results;
}

function GetAverages(prData) {
    var lcAverages = new MonthlyWBGTAverage();
    lcAverages.GridLat = prData[0].GridLat;
    lcAverages.GridLng = prData[0].GridLng;
    $(prData).each(function (index, prRow) {
        lcAverages.UTCI[prRow.Month] += prRow.UTCI;
        lcAverages.UTCIMax[prRow.Month] += prRow.UTCIMax;
        lcAverages.WBGT[prRow.Month] += prRow.WBGT;
        lcAverages.WBGTMax[prRow.Month] += prRow.WBGTMax;
        lcAverages.DewPoint[prRow.Month] += prRow.DewPoint;
        lcAverages.TemperatureMax[prRow.Month] += prRow.TemperatureMax;
        lcAverages.TemperatureMean[prRow.Month] += prRow.TemperatureMean;
        lcAverages.TemperatureMin[prRow.Month] += prRow.TemperatureMin;
    });
    lcAverages.CalculateAverages();

    arrGridAverages = arrGridAverages.concat(lcAverages);
}

function MonthlyWBGTAverage() {
    this.GridLat = 0.0;
    this.GridLng = 0.0;
    this.UTCI = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.UTCIMax = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.WBGT = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.WBGTMax = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.DewPoint = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.TemperatureMax = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.TemperatureMean = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.TemperatureMin = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
}

MonthlyWBGTAverage.prototype.CalculateAverages = function () {
    for (var i = 0; i < 13; i++) {
        this.UTCI[i] = this.UTCI[i] / numYears;
        this.UTCIMax[i] = this.UTCIMax[i] / numYears;
        this.WBGT[i] = this.WBGT[i] / numYears;
        this.WBGTMax[i] = this.WBGTMax[i] / numYears;
        this.DewPoint[i] = this.DewPoint[i] / numYears;
        this.TemperatureMax[i] = this.TemperatureMax[i] / numYears;
        this.TemperatureMean[i] = this.TemperatureMean[i] / numYears;
        this.TemperatureMin[i] = this.TemperatureMin[i] / numYears;
    }

}

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

function GraphIt() {
   errdata = GetErrorBandDataUTCI(gridLat, gridLng);
   graph = new DFGraph();
   graph.lat = gridLat;
   graph.lng = gridLng;
   graph.parameter = $("#lstParameter").val();
   graph.type = parseInt($('#lstMonth').val());
   graph.temperature = $('#lstTempType').val();
   graph.monthText = $("#lstMonth option:selected").text();
   graph.parameterText = $("#lstParameter option:selected").text();
   graph.parameterIndex = $("#lstParameter").prop("selectedIndex");
   graph.createGraph();
}

// LMH
// Checks cookies if set from previous page or this page
function SetDropDownValuesFromCookies() {
    var lstParameterCookie = getCookie("lstParameter");
    var lstMonthCookie = getCookie("lstMonth");
    var lstTempTypeCookie = getCookie("lstTempType");

    if (lstParameterCookie != "") {
        $("#lstParameter").val(lstParameterCookie);
    }
    if (lstMonthCookie != "") {
        $("#lstMonth").val(lstMonthCookie);
    }
    if (lstTempTypeCookie != "") {
        $("#lstTempType").val(lstTempTypeCookie);
    }
	
}

function clearAllCookies() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		deleteCookie(cookies[i].split("=")[0]);
	}
	location.reload();
}