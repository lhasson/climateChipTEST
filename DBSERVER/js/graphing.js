var CurrentGraph = "MeanTemp";
var errData = new Array();
var graphTitleMonthly = "";
var graphTitleThirty = "";
var mySlope = 0.0;
var myIntercept = 0.0;
var MonthlyPlot = "";
var ThirtyPlot = "";
var StandardError = 0.0;

function RenderGraph() {
    errdata = GetErrorBandDataUTCI(gridLat, gridLng);
    //switch (CurrentGraph) {
    //   case "Min_Temp":
    //      GraphMinTemp();
    //      break;
    //   case "Max_Temp":
    //        GraphMaxTemp();
    //        break;
    //    case "Mean_Temp":
    //        GraphMeanTemp();
    //        break;
    //    case "Mean_Dewpoint":
    //        GraphMeanDewPoint();
    //        break;
    //    case "Max_WBGT":
    //        GraphMaxWBGT();
    //        break;
    //    case "Mean_WBGT":
    //        GraphMeanWBGT();
    //        break;
    //    case "Max_UTCI":
    //        GraphMaxUTCI();
    //        break;
    //    case "Mean_UTCI":
    //        GraphMeanUTCI();
    //        break;
    //}
    GraphIt();
}

function GraphMinTemp() {
   var thirtyRawData = GetThirtyYearData(this.lat, this.lng, numYears, parseInt($('#lstMonth').val()));
   var thirtyGraphData = new Array();
   $(thirtyRawData).each(function (index, lcGridResult) {
      var lcItem = new Array();
      lcItem[0] = lcGridResult.Year;
      if ($('#lstTempType').val() == "C")
         lcItem[1] = lcGridResult.TemperatureMin;
      else
         lcItem[1] = ConvertToFarenheit(lcGridResult.TemperatureMin);
      thirtyGraphData[index] = lcItem;
   });
   var monthlyRawData = GetMonthlyRawData(gridLat, gridLng);
   var monthlyGraphData = new Array();
   for (var i = 1; i < 13; i++) {
      var lcItem = new Array();
      lcItem[0] = arrMonths[i];
      if ($('#lstTempType').val() == "C")
         lcItem[1] = monthlyRawData.TemperatureMin[i];
      else
         lcItem[1] = ConvertToFarenheit(monthlyRawData.TemperatureMin[i]);
      monthlyGraphData[i - 1] = lcItem;
   }
   graphTitleThirty = "Min_Temp_C_MthAvg_" + "_" + gridLat + "," + gridLng;
   var lcThirtyTitle = '30 Year Plot of Minimum Temperature (&deg;C shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
   if ($('#lstTempType').val() == "F") {
      lcThirtyTitle = '30 Year Plot of Minimum Temperature (&deg;F shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
      graphTitleThirty = "Max_Temp_F-MthAvg_" + "-" + gridLat + "," + gridLng;
   }
   
   
   graphTitleMonthly = "Min_Temp_C_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
   var lcMonthlyTitle = '30 Year Averages By Month of Minimum Temperature (&deg;C shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
   if ($('#lstTempType').val() == "F") {
      lcMonthlyTitle = '30 Year Averages By Month of Minimum Temperature (&deg;F shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
      graphTitleMonthly = "Min_Temp_F_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
      
   }
   jqPlotOptionsThirty.title = lcThirtyTitle;
   jqPlotOptionsMonthly.title = lcMonthlyTitle;
   RenderThirtyGraph(thirtyGraphData, jqPlotOptionsThirty);
   RenderMonthlyGraph(monthlyGraphData, jqPlotOptionsMonthly);
}

function GraphMaxTemp() {
    var thirtyRawData = GetThirtyYearData(gridLat, gridLng, numYears, parseInt($('#lstMonth').val()));
    var thirtyGraphData = new Array();
    $(thirtyRawData).each(function (index, lcGridResult) {
        var lcItem = new Array();
        lcItem[0] = lcGridResult.Year;
        if ($('#lstTempType').val() == "C")
            lcItem[1] = lcGridResult.TemperatureMax;
        else
            lcItem[1] = ConvertToFarenheit(lcGridResult.TemperatureMax);
        thirtyGraphData[index] = lcItem;
    });
    var monthlyRawData = GetMonthlyRawData(gridLat, gridLng);
    var monthlyGraphData = new Array();
    for (var i = 1; i < 13; i++) {
        var lcItem = new Array();
        lcItem[0] = arrMonths[i];
        if ($('#lstTempType').val() == "C")
            lcItem[1] = monthlyRawData.TemperatureMax[i];
        else
            lcItem[1] = ConvertToFarenheit(monthlyRawData.TemperatureMax[i]);
        monthlyGraphData[i - 1] = lcItem;
    }
    graphTitleThirty = "Max_Temp_C_MthAvg_" + "_" + gridLat + "," + gridLng;
    var lcThirtyTitle = '30 Year Plot of Maximum Temperature (&deg;C shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
        lcThirtyTitle = '30 Year Plot of Maximum Temperature (&deg;F shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
        graphTitleThirty = "Max_Temp_F-MthAvg_" + "-" + gridLat + "," + gridLng;
    }
   
    graphTitleMonthly = "Max_Temp_C_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    var lcMonthlyTitle = '30 Year Averages By Month of Maximum Temperature (&deg;C shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
        lcMonthlyTitle = '30 Year Averages By Month of Maximum Temperature (&deg;F shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
        graphTitleMonthly = "Max_Temp_F_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    }
    jqPlotOptionsThirty.title = lcThirtyTitle;
    jqPlotOptionsMonthly.title = lcMonthlyTitle;
    RenderThirtyGraph(thirtyGraphData, jqPlotOptionsThirty);
    RenderMonthlyGraph(monthlyGraphData, jqPlotOptionsMonthly);
}

function GraphMeanTemp() {
    var thirtyRawData = GetThirtyYearData(gridLat, gridLng, numYears, parseInt($('#lstMonth').val()));
    var thirtyGraphData = new Array();
    $(thirtyRawData).each(function (index, lcGridResult) {
        var lcItem = new Array();
        lcItem[0] = lcGridResult.Year;
        if ($('#lstTempType').val() == "C")
            lcItem[1] = lcGridResult.TemperatureMean;
        else
            lcItem[1] = ConvertToFarenheit(lcGridResult.TemperatureMean);
        thirtyGraphData[index] = lcItem;
    });

    var monthlyRawData = GetMonthlyRawData(gridLat, gridLng);
    var monthlyGraphData = new Array();
    for (var i = 1; i < 13; i++) {
        var lcItem = new Array();
        lcItem[0] = arrMonths[i];
        if ($('#lstTempType').val() == "C")
            lcItem[1] = monthlyRawData.TemperatureMean[i];
        else
            lcItem[1] = ConvertToFarenheit(monthlyRawData.TemperatureMean[i]);
        monthlyGraphData[i - 1] = lcItem;
    }

    graphTitleThirty = "Mean_Temp_C_MthAvg_" + "_" + gridLat + "," + gridLng;
    var lcThirtyTitle = '30 Year Plot of Mean Temperature (&deg;C shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcThirtyTitle = '30 Year Plot of Mean Temperature (&deg;F shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleThirty = "Mean_Temp_F-MthAvg_" + "-" + gridLat + "," + gridLng;
    }

    graphTitleMonthly = "Mean_Temp_C_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    var lcMonthlyTitle = '30 Year Averages By Month of Mean Temperature (&deg;C shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcMonthlyTitle = '30 Year Averages By Month of Mean Temperature (&deg;F shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleMonthly = "Mean_Temp_F_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    }

    jqPlotOptionsThirty.title = lcThirtyTitle;
    jqPlotOptionsMonthly.title = lcMonthlyTitle;
    RenderThirtyGraph(thirtyGraphData, jqPlotOptionsThirty);
    RenderMonthlyGraph(monthlyGraphData, jqPlotOptionsMonthly);
}

function GraphMeanDewPoint() {
   var thirtyRawData = GetThirtyYearData(gridLat, gridLng, numYears, parseInt($('#lstMonth').val()));
    var thirtyGraphData = new Array();
    $(thirtyRawData).each(function (index, lcGridResult) {
        var lcItem = new Array();
        lcItem[0] = lcGridResult.Year;
        if ($('#lstTempType').val() == "C")
            lcItem[1] = lcGridResult.DewPoint;
        else
            lcItem[1] = ConvertToFarenheit(lcGridResult.DewPoint);
        thirtyGraphData[index] = lcItem;
    });

    var monthlyRawData = GetMonthlyRawData(gridLat, gridLng);
    var monthlyGraphData = new Array();
    for (var i = 1; i < 13; i++) {
        var lcItem = new Array();
        lcItem[0] = arrMonths[i];
        if ($('#lstTempType').val() == "C")
            lcItem[1] = monthlyRawData.DewPoint[i];
        else
            lcItem[1] = ConvertToFarenheit(monthlyRawData.DewPoint[i]);
        monthlyGraphData[i - 1] = lcItem;
    }

    graphTitleThirty = "Mean_Dewpoint_C_MthAvg_" + "_" + gridLat + "," + gridLng;
    var lcThirtyTitle = '30 Year Plot of Mean Dew Point (&deg;C shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcThirtyTitle = '30 Year Plot of Mean Dew Point (&deg;F shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleThirty = "Mean_Dewpoint_F-MthAvg_" + "-" + gridLat + "," + gridLng;
    }

    graphTitleMonthly = "Mean_Dewpoint_C_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    var lcMonthlyTitle = '30 Year Averages By Month of Mean Dew Point (&deg;C shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcMonthlyTitle = '30 Year Averages By Month of Mean Dew Point (&deg;F shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleMonthly = "Mean_Dewpoint_F_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    }

    jqPlotOptionsThirty.title = lcThirtyTitle;
    jqPlotOptionsMonthly.title = lcMonthlyTitle;
    RenderThirtyGraph(thirtyGraphData, jqPlotOptionsThirty);
    RenderMonthlyGraph(monthlyGraphData, jqPlotOptionsMonthly);
}

function GraphMaxWBGT() {
   var thirtyRawData = GetThirtyYearData(gridLat, gridLng, numYears, parseInt($('#lstMonth').val()));
    var thirtyGraphData = new Array();
    $(thirtyRawData).each(function (index, lcGridResult) {
        var lcItem = new Array();
        lcItem[0] = lcGridResult.Year;
        if ($('#lstTempType').val() == "C")
            lcItem[1] = lcGridResult.WBGTMax;
        else
            lcItem[1] = ConvertToFarenheit(lcGridResult.WBGTMax);
        thirtyGraphData[index] = lcItem;
    });

    var monthlyRawData = GetMonthlyRawData(gridLat, gridLng);
    var monthlyGraphData = new Array();
    for (var i = 1; i < 13; i++) {
        var lcItem = new Array();
        lcItem[0] = arrMonths[i];
        if ($('#lstTempType').val() == "C")
            lcItem[1] = monthlyRawData.WBGTMax[i];
        else
            lcItem[1] = ConvertToFarenheit(monthlyRawData.WBGTMax[i]);
        monthlyGraphData[i - 1] = lcItem;
    }

    graphTitleThirty = "Max_WBGT_MthAvg_" + "_" + gridLat + "," + gridLng;
    var lcThirtyTitle = '30 Year Plot of Maximum WBGT (&deg;C shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcThirtyTitle = '30 Year Plot of Maximum WBGT (&deg;F shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleThirty = "Max_WBGT_F-MthAvg_" + "-" + gridLat + "," + gridLng;
    }

    graphTitleMonthly = "Max_WBGT_C_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    var lcMonthlyTitle = '30 Year Averages By Month of Maximum WBGT (&deg;C shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcMonthlyTitle = '30 Year Averages By Month of Maximum WBGT (&deg;F shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleMonthly = "Max_WBGT_F_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    }

    jqPlotOptionsThirty.title = lcThirtyTitle;
    jqPlotOptionsMonthly.title = lcMonthlyTitle;
    RenderThirtyGraph(thirtyGraphData, jqPlotOptionsThirty, "WBGT");
    RenderMonthlyGraph(monthlyGraphData, jqPlotOptionsMonthly, "WBGT");
}

function GraphMeanWBGT() {
   var thirtyRawData = GetThirtyYearData(gridLat, gridLng, numYears, parseInt($('#lstMonth').val()));
    var thirtyGraphData = new Array();
    $(thirtyRawData).each(function (index, lcGridResult) {
        var lcItem = new Array();
        lcItem[0] = lcGridResult.Year;
        if ($('#lstTempType').val() == "C")
            lcItem[1] = lcGridResult.WBGT;
        else
            lcItem[1] = ConvertToFarenheit(lcGridResult.WBGT);
        thirtyGraphData[index] = lcItem;
    });

    var monthlyRawData = GetMonthlyRawData(gridLat, gridLng);
    var monthlyGraphData = new Array();
    for (var i = 1; i < 13; i++) {
        var lcItem = new Array();
        lcItem[0] = arrMonths[i];
        if ($('#lstTempType').val() == "C")
            lcItem[1] = monthlyRawData.WBGT[i];
        else
            lcItem[1] = ConvertToFarenheit(monthlyRawData.WBGT[i]);
        monthlyGraphData[i - 1] = lcItem;
    }

    graphTitleThirty = "Mean_WBGT_C_MthAvg_" + "_" + gridLat + "," + gridLng;
    var lcThirtyTitle = '30 Year Plot of Mean WBGT (&deg;C shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcThirtyTitle = '30 Year Plot of Mean WBGT (&deg;F shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleThirty = "Mean_WBGT_F-MthAvg_" + "-" + gridLat + "," + gridLng;
    }

    graphTitleMonthly = "MEan_WBGT_C_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    var lcMonthlyTitle = '30 Year Averages By Month of Mean WBGT (&deg;C shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcMonthlyTitle = '30 Year Averages By Month of Mean WBGT (&deg;F shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleMonthly = "Mean_WBGT_F_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    }

    jqPlotOptionsThirty.title = lcThirtyTitle;
    jqPlotOptionsMonthly.title = lcMonthlyTitle;
    RenderThirtyGraph(thirtyGraphData, jqPlotOptionsThirty, "WBGT");
    RenderMonthlyGraph(monthlyGraphData, jqPlotOptionsMonthly, "WBGT");
}

function GraphMaxUTCI() {
   var thirtyRawData = GetThirtyYearData(gridLat, gridLng, numYears, parseInt($('#lstMonth').val()));
    var thirtyGraphData = new Array();
    $(thirtyRawData).each(function (index, lcGridResult) {
        var lcItem = new Array();
        lcItem[0] = lcGridResult.Year;
        if ($('#lstTempType').val() == "C")
            lcItem[1] = lcGridResult.UTCIMax;
        else
            lcItem[1] = ConvertToFarenheit(lcGridResult.UTCIMax);
        thirtyGraphData[index] = lcItem;
    });

    var monthlyRawData = GetMonthlyRawData(gridLat, gridLng);
    var monthlyGraphData = new Array();
    for (var i = 1; i < 13; i++) {
        var lcItem = new Array();
        lcItem[0] = arrMonths[i];
        if ($('#lstTempType').val() == "C")
            lcItem[1] = monthlyRawData.UTCIMax[i];
        else
            lcItem[1] = ConvertToFarenheit(monthlyRawData.UTCIMax[i]);
        monthlyGraphData[i - 1] = lcItem;
    }

    graphTitleThirty = "Max_UTCI_C_MthAvg_" + "_" + gridLat + "," + gridLng;
    var lcThirtyTitle = '30 Year Plot of Maximum UTCI (&deg;C shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcThirtyTitle = '30 Year Plot of Maximum UTCI (&deg;F shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleThirty = "Max_UTCI_F-MthAvg_" + "-" + gridLat + "," + gridLng;
    }

    graphTitleMonthly = "Max_UTCI_C_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    var lcMonthlyTitle = '30 Year Averages By Month of Maximum UTCI (&deg;C shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcMonthlyTitle = '30 Year Averages By Month of Maximum UTCI (&deg;F shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleMonthly = "Max_UTCI_F_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    }

    jqPlotOptionsThirty.title = lcThirtyTitle;
    jqPlotOptionsMonthly.title = lcMonthlyTitle;
    RenderThirtyGraph(thirtyGraphData, jqPlotOptionsThirty, "UTCI");
    RenderMonthlyGraph(monthlyGraphData, jqPlotOptionsMonthly, "UTCI");
}


function GraphMeanUTCI() {
   var thirtyRawData = GetThirtyYearData(gridLat, gridLng, numYears, parseInt($('#lstMonth').val()));
    var thirtyGraphData = new Array();
    $(thirtyRawData).each(function (index, lcGridResult) {
        var lcItem = new Array();
        lcItem[0] = lcGridResult.Year;
        if ($('#lstTempType').val() == "C")
            lcItem[1] = lcGridResult.UTCI;
        else
            lcItem[1] = ConvertToFarenheit(lcGridResult.UTCI);
        thirtyGraphData[index] = lcItem;
    });

    var monthlyRawData = GetMonthlyRawData(gridLat, gridLng);
    var monthlyGraphData = new Array();
    for (var i = 1; i < 13; i++) {
        var lcItem = new Array();
        lcItem[0] = arrMonths[i];
        if ($('#lstTempType').val() == "C")
            lcItem[1] = monthlyRawData.UTCI[i];
        else
            lcItem[1] = ConvertToFarenheit(monthlyRawData.UTCI[i]);
        monthlyGraphData[i - 1] = lcItem;
    }

    graphTitleThirty = "Mean_UTCI_C_MthAvg_" + "_" + gridLat + "," + gridLng;
    var lcThirtyTitle = '30 Year Plot of Mean UTCI (&deg;C shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcThirtyTitle = '30 Year Plot of Mean UTCI (&deg;F shade) for ' + $("#lstMonth option:selected").text() + '.<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleThirty = "Mean_UTCI_F-MthAvg_" + "-" + gridLat + "," + gridLng;
    }

    graphTitleMonthly = "Mean_UTCI_C_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    var lcMonthlyTitle = '30 Year Averages By Month of Mean UTCI (&deg;C shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
    if ($('#lstTempType').val() == "F") {
       lcMonthlyTitle = '30 Year Averages By Month of Mean UTCI (&deg;F shade).<br />Latitude: ' + gridLat + ' &amp; Longitude: ' + gridLng;
       graphTitleMonthly = "Mean_UTCI_F_" + $("#lstMonth option:selected").val() + "_" + gridLat + "," + gridLng;
    }

    jqPlotOptionsThirty.title = lcThirtyTitle;
    jqPlotOptionsMonthly.title = lcMonthlyTitle;
    RenderThirtyGraph(thirtyGraphData, jqPlotOptionsThirty, "UTCI");
    RenderMonthlyGraph(monthlyGraphData, jqPlotOptionsMonthly, "UTCI");
}


function RenderThirtyGraph(prGraphData, prGraphOptions, prScaled) {
    $('#jqPlotThirty').html("");
    $('#btnSaveGraph').remove();
    ThirtyPlot = $.jqplot("jqPlotThirty", [prGraphData], $.extend(true, {}, myTheme, prGraphOptions));
    StandardError = GetStandardError(prGraphData);
    setTimeout(RenderTrendInfo, 512); // Timeout to let the jqPlot finish rendering? Caused a lockup!!!
    if ((prScaled == "UTCI") && ($('#lstTempType').val() == "C"))
       ShadeThirtyUTCIGraph();
    if ((prScaled == "WBGT") && ($('#lstTempType').val() == "C"))
       ShadeThirtyWBGTGraph();
    setTimeout(ScaleEvents, 512);
}

myTheme = {
   grid: {
      drawBorder: false,
      shadow: false,
      background: 'rgba(255, 255, 255, 0.0)'
   },
   seriesDefaults: {
      shadow: false,
      showMarker: true
   },
   axes: {
      xaxis: {
         pad: 1.0,
         tickOptions: {
            showGridline: true,
            textColor: 'black'
         }
      },
      yaxis: {
         pad: 1.05,
         tickOptions: {
            textColor: 'black'
         }
      }
   }
};

function RenderTrendInfo() {
    var lcTrendtitle = '<div class="jqplot-title my-jqplot-title">Trendline: ' + (mySlope * 10).toFixed(2) + '&deg; per decade.<br />';
    lcTrendtitle += 'Standard Error: ' + (StandardError * 10).toFixed(3) + '&deg; per decade.</div>';
    $(lcTrendtitle).insertAfter('#jqPlotThirty .jqplot-grid-canvas');
    var imgData = $('#jqPlotThirty').jqplotToImageStr({});
    var tempData = $('#jqPlotThirty').jqplotToImageCanvas({});
    if (!tempData)
        return false;
    var data = tempData.toDataURL("image/png");
    data = data.substr(data.indexOf(',') + 1).toString();
    $('#imgdata').val(data);
    $('#name').val(graphTitleThirty + '.png');
    $('#graphs').append('<input id="btnSaveGraph" class="btn" type="button" value="Save this Graph as an Image" />');
    $('#btnSaveGraph').click(function () { $('#frmjqPlot').submit(); });
}

function RenderMonthlyGraph(prGraphData, prGraphOptions, prScaled) {
    $('#jqPlotMonthly').html("");
    $('#btnSaveMonthlyGraph').remove();
    MonthlyPlot = $.jqplot("jqPlotMonthly", [prGraphData], $.extend(true, {}, myTheme, prGraphOptions));
    if ((prScaled == "UTCI") && ($('#lstTempType').val() == "C"))
       ShadeMonthlyUTCIGraph();
    if ((prScaled == "WBGT") && ($('#lstTempType').val() == "C"))
       ShadeMonthlyWBGTGraph();
    setTimeout(ScaleEvents, 512);
    var imgData = $('#jqPlotMonthly').jqplotToImageStr({});
    var tempData = $('#jqPlotMonthly').jqplotToImageCanvas({});
    if (!tempData)
        return false;
    var data = tempData.toDataURL("image/png");
    data = data.substr(data.indexOf(',') + 1).toString();
    $('#monthlyimgdata').val(data);
    $('#monthlyname').val(graphTitleMonthly + '.png');
    $('#divGraphContainer').append('<input id="btnSaveMonthlyGraph" class="btn" type="button" value="Save this Graph as an Image" />');
    $('#btnSaveMonthlyGraph').click(function () { $('#frmjqPlotMonthly').submit(); });
    
}


var jqPlotOptionsThirty = {
   
   title: "",
    axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer
       
    },
    axes: {
        xaxis: {
            tickOptions: {
                angle: -90,
                fontSize: '10pt',
                textColor: 'black'
            }
        },
        yaxis: {
           tickOptions: {
              textColor: 'black'
           }
        }
    },
    seriesDefaults: {
        trendline: {
            show: false,         // show the trend line
            color: '#ff0000',   // CSS color spec for the trend line.
            label: '',          // label for the trend line.
            type: 'linear',     // 'linear', 'exponential' or 'exp'
            shadow: true,       // show the trend line shadow.
            lineWidth: 1.5,     // width of the trend line.
            shadowAngle: 45,    // angle of the shadow.  Clockwise from x axis.
            shadowOffset: 1.5,  // offset from the line of the shadow.
            shadowDepth: 3,     // Number of strokes to make when drawing shadow.
            // Each stroke offset by shadowOffset from the last.
            shadowAlpha: 0.07   // Opacity of the shadow
        }
    }
};

var jqPlotOptionsMonthly = {
    title: "",
    axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
       
    },
    axes: {
        xaxis: {
            renderer: $.jqplot.CategoryAxisRenderer,
            tickOptions: {
                angle: -90,
                fontSize: '10pt'
            }
        },
        yaxis: {
            
        }
    },
        
    seriesDefaults: {
    trendline: {
    show: false         // show the trend line
}
}
};

function GraphScale(label, max, min, color) {
   this.label = label;
   this.max = max;
   this.min = min;
   this.color = color;
}

function lstGraphScales() {
   this.items = [];
}

lstGraphScales.prototype.getScale = function (prTemp) {
   var length = this.items.length,
    element = null;
   for (var i = 0; i < length; i++) {
      element = this.items[i];
      if((prTemp <= element.max) && (prTemp > element.min))
         return element;
   }
}

function ShadeMonthlyUTCIGraph() {
   $('#jqPlotMonthly .jqplot-yaxis').append('<div id="scalecontainermonthly"></div><div id="scalehovercontainermonthly"></div>');
   var lcCurrent = MonthlyPlot.axes.yaxis.max;
   var lcMin = MonthlyPlot.axes.yaxis.min;
   var axisHeight = MonthlyPlot.axes.yaxis.max - MonthlyPlot.axes.yaxis.min;
   var top = 0;
   while (lcCurrent >= lcMin) {
      var objUTCI = UTCIValues.getScale(lcCurrent);
      var divHeight = (lcCurrent - objUTCI.min) / axisHeight * 100;
      if (divHeight + top > 100)
         divHeight = 100 - top; // Fix the height going greater than 100% for extreme edges
      var divHTML = '<div class="scalediv" style="top: ' + top + '%;height: ' + divHeight + '%; background-color: ' + objUTCI.color + ';"></div>';
      var scaleHTML = '<div class="scalediv hover" style="top: ' + top + '%;height: ' + divHeight + '%;"><div style="background-color: ' + objUTCI.color + ';" class="utciscaledivexplain"><h2>' + objUTCI.label + '</h2><br /><img class="utcihoverimage" alt="UTCI Scale Explanation" src="img/UTCI_scale.png"></div></div>';
      $('#scalecontainermonthly').append(divHTML);
      $('#scalehovercontainermonthly').append(scaleHTML);
      lcCurrent = objUTCI.min;
      top = top + divHeight;
   }
}

function ShadeThirtyUTCIGraph() {
   $('#jqPlotThirty .jqplot-yaxis').append('<div id="scalecontainerthirty"></div><div id="scalehovercontainerthirty"></div>');
   var lcCurrent = ThirtyPlot.axes.yaxis.max;
   var lcMin = ThirtyPlot.axes.yaxis.min;
   var axisHeight = ThirtyPlot.axes.yaxis.max - ThirtyPlot.axes.yaxis.min;
   var top = 0;
   while (lcCurrent >= lcMin) {
      var objUTCI = UTCIValues.getScale(lcCurrent);
      var divHeight = (lcCurrent - objUTCI.min) / axisHeight * 100;
      if (divHeight + top > 100)
         divHeight = 100 - top; // Fix the height going greater than 100% for extreme edges
      var divHTML = '<div class="scalediv" style="top: ' + top + '%;height: ' + divHeight + '%; background-color: ' + objUTCI.color + ';"></div>';
      var scaleHTML = '<div class="scalediv hover" style="top: ' + top + '%;height: ' + divHeight + '%;"><div style="background-color: ' + objUTCI.color + ';" class="utciscaledivexplain"><h2>' + objUTCI.label + '</h2><br /><img class="utcihoverimage" alt="UTCI Scale Explanation" src="img/UTCI_scale.png"></div></div>';
      $('#scalecontainerthirty').append(divHTML);
      $('#scalehovercontainerthirty').append(scaleHTML);
      lcCurrent = objUTCI.min;
      top = top + divHeight;
   }
}

function ShadeMonthlyWBGTGraph() {
   $('#jqPlotMonthly').append('<div id="scalecontainermonthly"></div><div id="scalehovercontainermonthly"></div>');
   var lcCurrent = MonthlyPlot.axes.yaxis.max;
   var lcMin = MonthlyPlot.axes.yaxis.min;
   var axisHeight = MonthlyPlot.axes.yaxis.max - MonthlyPlot.axes.yaxis.min;
   var top = 0;
   while (lcCurrent >= lcMin) {
      var objWBGT = WBGTValues.getScale(lcCurrent);
      var divHeight = (lcCurrent - objWBGT.min) / axisHeight * 100;
      if (divHeight + top > 100)
         divHeight = 100 - top; // Fix the height going greater than 100% for extreme edges
      var divHTML = '<div class="scalediv" style="top: ' + top + '%;height: ' + divHeight + '%; background-color: ' + objWBGT.color + ';"></div>';
      //var scaleHTML = '<div class="scalediv hover" style="top: ' + top + '%;height: ' + divHeight + '%;"><div style="background-color: ' + objWBGT.color + ';" class="scaledivexplain"><h2>' + objWBGT.label + '</h2><br /><img class="hoverimage" alt="WBGT Scale Explanation" src="img/WBGT_scale.png"></div></div>';
      $('#scalecontainermonthly').append(divHTML);
      //$('#scalehovercontainermonthly').append(scaleHTML);
      lcCurrent = objWBGT.min;
      top = top + divHeight;
   }
}

function ShadeThirtyWBGTGraph() {
   $('#jqPlotThirty').append('<div id="scalecontainerthirty"></div><div id="scalehovercontainerthirty"></div>');
   var lcCurrent = ThirtyPlot.axes.yaxis.max;
   var lcMin = ThirtyPlot.axes.yaxis.min;
   var axisHeight = ThirtyPlot.axes.yaxis.max - ThirtyPlot.axes.yaxis.min;
   var top = 0;
   while (lcCurrent >= lcMin) {
      var objWBGT = WBGTValues.getScale(lcCurrent);
      var divHeight = (lcCurrent - objWBGT.min) / axisHeight * 100;
      if (divHeight + top > 100)
         divHeight = 100 - top; // Fix the height going greater than 100% for extreme edges
      var divHTML = '<div class="scalediv" style="top: ' + top + '%;height: ' + divHeight + '%; background-color: ' + objWBGT.color + ';"></div>';
      //var scaleHTML = '<div class="scalediv hover" style="top: ' + top + '%;height: ' + divHeight + '%;"><div style="background-color: ' + objWBGT.color + ';" class="scaledivexplain"><h2>' + objWBGT.label + '</h2><br /><img class="hoverimage" alt="WBGT Scale Explanation" src="img/WBGT_scale.png"></div></div>';
      $('#scalecontainerthirty').append(divHTML);
      //$('#scalehovercontainerthirty').append(scaleHTML);
      lcCurrent = objWBGT.min;
      top = top + divHeight;
   }
}

function ScaleEvents() {
   $('.scalediv.hover').mouseover(ShowExplain).mouseout(HideExplain);
}

function ShowExplain() {
   $(this).children().css("display", "block");
}

function HideExplain() {
   $(this).children().css("display", "none");
}




