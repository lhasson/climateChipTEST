function DFGraph() {
   this.parameter = "";
   this.type = 0;
   this.temperature = "";
   this.lat = 0.0;
   this.lng = 0.0;
   this.errData = new Array();
   this.fileTitle = "";
   this.monthText = "";
   this.parameterText = "";
   this.plot = "";
   this.ytitle = "";
   this.parameterIndex = 0;
   this.standardError = new SEResults();
   this.jqPlotOptionsThirty = {
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
            },
            label: "",
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
         }
      },
      seriesDefaults: {
         trendline: {
            show: true,         // show the trend line
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

   this.jqPlotOptionsMonthly = {
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
            label: "",
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
         }
      },

      seriesDefaults: {
         trendline: {
            show: false         // show the trend line
         }
      }
   };

   this.myTheme = {
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
   this.JSONLookups = ["TemperatureMax", "TemperatureMean", "TemperatureMin", "DewPoint", "WBGTMax", "WBGT", "UTCIMax", "UTCI"];
}

DFGraph.prototype.createGraph = function () {
   $('.graphexplain').remove();
   this.createYTitle();
   //this.errData = GetErrorBandDataUTCI(this.lat, this.lng);
   switch (this.type) {
      case -1:
         this.createMonthlyGraph();
         break;
      default:
         this.createThirtyGraph();
   }
   if (this.parameter.indexOf("WBGT") != -1 || this.parameter.indexOf("UTCI") != -1) {
      this.shadeGraph();
      this.showExplainLinks();
   }
   this.scaleEvents();
   //this.saveGraph();
};

DFGraph.prototype.showExplainLinks = function () {
   if (this.parameter.indexOf("UTCI") != -1)
      $('#divGraphContainer').append('<a data-toggle="modal" class="graphexplain" href="#divExplainUTCI">UTCI Explained</a>');
   else
      $('#divGraphContainer').append('<a data-toggle="modal" class="graphexplain" href="#divExplainWBGT">WBGT Explained</a>');
};

DFGraph.prototype.shadeGraph = function () {
   if(this.type == -1)
      $('#jqPlotGraph .jqplot-yaxis').append('<div id="scalecontainer" class="thirty"></div><div id="scalehovercontainer"></div>');
   else
      $('#jqPlotGraph .jqplot-yaxis').append('<div id="scalecontainer" class="monthly"></div><div id="scalehovercontainer"></div>');
   var lcCurrent = this.plot.axes.yaxis.max;
   var lcMin = this.plot.axes.yaxis.min;
   var firstrun = true;
   var axisHeight = 0.0;
   if (this.temperature == 'C') {
      //lcMin = this.plot.axes.yaxis.min;
      axisHeight = this.plot.axes.yaxis.max - this.plot.axes.yaxis.min;
   }
   else {
      //lcMin = ConvertToCelcius(this.plot.axes.yaxis.min);
      axisHeight = ConvertToCelcius(this.plot.axes.yaxis.max) - ConvertToCelcius(this.plot.axes.yaxis.min);
   }
   
   var top = 0;
   var item = 0;
   while (lcCurrent >= lcMin) {
     
      var lcCurrentShade = {};
      if (this.parameter.indexOf("WBGT") != -1) {
         if (this.temperature == 'C')
            lcCurrentShade = WBGTValues.getScale(lcCurrent);
         else
            lcCurrentShade = WBGTValues.getScale(roundHalf(ConvertToCelcius(lcCurrent)));
      }
      else {
         if(this.temperature == 'C')
            lcCurrentShade = UTCIValues.getScale(lcCurrent);
         else
            lcCurrentShade = UTCIValues.getScale(ConvertToCelcius(lcCurrent));
      }
      var divHeight = "";
      if (this.temperature == 'C')
         divHeight = (lcCurrent- lcCurrentShade.min) / axisHeight * 100;
      else
         divHeight = (ConvertToCelcius(lcCurrent) - lcCurrentShade.min) / axisHeight * 100;
      if (divHeight + top > 100)
         divHeight = 100 - top; // Fix the height going greater than 100% for extreme edges
      var divHTML = '<div class="scalediv" style="top: ' + top + '%;height: ' + divHeight + '%; background-color: ' + lcCurrentShade.color + ';"></div>';
      var scaleHTML = '<div class="scalediv hover" data-item="' + item + '" style="top: ' + top + '%;height: ' + divHeight + '%;"></div>';
      scaleHTML += '<div style="background-color: ' + lcCurrentShade.color + ';" class="utciscaledivexplain scaleexplain"><h2>' + lcCurrentShade.label + '</h2><br />';
      if (this.parameter.indexOf("UTCI") != -1)
         scaleHTML += '<img class="utcihoverimage" alt="UTCI Scale Explanation" src="img/UTCI_scale.png"></div>';
      else
         scaleHTML += '<img class="hoverimage" alt="UTCI Scale Explanation" src="img/WBGT_scale.png"></div>';
      $('#scalecontainer').append(divHTML);
      //if (this.parameter.indexOf("UTCI") != -1) // Not showing for WBGT until we get better image or explanation or something!!!
         $('#scalehovercontainer').append(scaleHTML);
      if (this.temperature == 'C')
         lcCurrent = lcCurrentShade.min;
      else 
         lcCurrent =ConvertToFarenheit(lcCurrentShade.min);
      top = top + divHeight;
      item++;
   }
};

DFGraph.prototype.createMonthlyGraph = function () {
   var monthlyRawData = GetMonthlyRawData(this.lat, this.lng);
   var monthlyGraphData = new Array();
   var parent = this;
   for (var i = 1; i < 13; i++) {
      var lcItem = new Array();
      lcItem[0] = arrMonths[i];
      if (parent.temperature == "C")
         lcItem[1] = parent.JSONLookups[parent.parameterIndex].findIn(monthlyRawData)[i];
      else
         lcItem[1] = ConvertToFarenheit(parent.JSONLookups[parent.parameterIndex].findIn(monthlyRawData)[i]);
      monthlyGraphData[i - 1] = lcItem;
   }
   this.getMonthlyFileTitle("Today");
   this.getMonthlyChartTitle("Today");
   this.jqPlotOptionsMonthly.axes.yaxis.label = this.ytitle;
   this.renderMonthlyGraph(monthlyGraphData);
};

DFGraph.prototype.createThirtyGraph = function () {
   var thirtyRawData = GetThirtyYearData(this.lat, this.lng, numYears, this.type);
   var thirtyGraphData = new Array();
   var parent = this;
   $(thirtyRawData).each(function (index, lcGridResult) {
      var lcItem = new Array();
      lcItem[0] = lcGridResult.Year;
      if (parent.temperature == "C")
         lcItem[1] = parent.JSONLookups[parent.parameterIndex].findIn(lcGridResult);
      else
         lcItem[1] = ConvertToFarenheit(parent.JSONLookups[parent.parameterIndex].findIn(lcGridResult));
      thirtyGraphData[index] = lcItem;
   });
   this.getThirtyFileTitle("Today");
   this.getThirtyChartTitle("Today");
   this.jqPlotOptionsThirty.axes.yaxis.label = this.ytitle;
   this.renderThirtyGraph(thirtyGraphData);
};

DFGraph.prototype.createYTitle = function () {
   if (this.temperature == "C")
      this.ytitle = '(°C)';
   else
      this.ytitle = '(°F)';
};

DFGraph.prototype.renderMonthlyGraph = function (prGraphData) {
	//$('#jqPlotGraph').html("");
	//$('#btnSaveGraph').remove();
	this.plot = $.jqplot("jqPlotGraph", [prGraphData], $.extend(true, {}, this.myTheme, this.jqPlotOptionsMonthly));
	graph.plot.replot({ resetAxes: true }); //Refresh axes
};

DFGraph.prototype.renderThirtyGraph = function (prGraphData) {
     // $('#jqPlotGraph').html("");
      //$('#btnSaveGraph').remove();
      this.plot = $.jqplot("jqPlotGraph", [prGraphData], $.extend(true, {}, this.myTheme, this.jqPlotOptionsThirty));
      this.standardError = getStandardError(prGraphData);
	  graph.plot.replot({ resetAxes: true }); //Refresh axes
      this.renderTrendInfo(); // Timeout to let the jqPlot finish rendering? Caused a lockup!!!
};

DFGraph.prototype.renderTrendInfo = function () {
   var lcTrendtitle = '<div class="jqplot-title my-jqplot-title">Trendline: ' + (this.standardError.slope * 10).toFixed(2) + '° per decade<div>';
   lcTrendtitle += 'Standard Error: ' + (this.standardError.standardError * 10).toFixed(3) + '°</div></div>';
   $(lcTrendtitle).insertAfter('#jqPlotGraph .jqplot-grid-canvas');
   var imgData = $('#jqPlotGraph').jqplotToImageStr({});
   var tempData = $('#jqPlotGraph').jqplotToImageCanvas({});
   if (!tempData)
      return false;
   var data = tempData.toDataURL("image/png");
   data = data.substr(data.indexOf(',') + 1).toString();
   $('#imgdata').val(data);
   $('#name').val(graphTitleThirty + '.png');
   //$('#graphs').append('<input id="btnSaveGraph" class="btn" type="button" value="Save this Graph as an Image" />');
   //$('#btnSaveGraph').click(function () { $('#frmjqPlot').submit(); });
};

DFGraph.prototype.getThirtyFileTitle = function (prTimeType) {
    this.fileTitle = prTimeType + "_" + this.parameter + "_" + this.temperature + "_" + this.monthText.substring(0, 3) + "_" + this.lat + "," + this.lng;
};

DFGraph.prototype.getThirtyChartTitle = function () {
   this.jqPlotOptionsThirty.title = this.parameterText + '(' + this.monthText + ')<div>Latitude: ' + this.lat + ' & Longitude: ' + this.lng + '</div>';
};

DFGraph.prototype.getMonthlyFileTitle = function (prTimeType) {
    this.fileTitle = prTimeType + "_" + this.parameter + "_" + this.temperature + "_MthAvg_" + this.lat + "," + this.lng;
};

DFGraph.prototype.getMonthlyChartTitle = function () {
   this.jqPlotOptionsMonthly.title = this.parameterText + ' (Monthly Averages 1980 to 2011).<div>Latitude: ' + this.lat + ' & Longitude: ' + this.lng + '</div>';
};

DFGraph.prototype.scaleEvents = function () {
   $('.scalediv.hover').mouseover(this.showExplain).mouseout(this.hideExplain);
};

DFGraph.prototype.showExplain = function (prChild) {
   $($('.scaleexplain')[parseInt($(this).attr('data-item'))]).css("display", "block");
};

DFGraph.prototype.hideExplain = function (prChild) {
   $('.scaleexplain').css("display", "none");
};

DFGraph.prototype.saveGraph = function () {
   var imgData = $('#jqPlotGraph').jqplotToImageStr({});
   var tempData = $('#jqPlotGraph').jqplotToImageCanvas({});
   if (!tempData)
      return false;
   var data = tempData.toDataURL("image/png");
   data = data.substr(data.indexOf(',') + 1).toString();
   $('#imgdata').val(data);
   $('#name').val(this.fileTitle + '.png');
  // $('#divGraphContainer').append('<input id="btnSaveGraph" class="btn" type="button" value="Save this Graph as an Image" />');
   $('#frmjqPlot').submit(); // Submit PHP
};

String.prototype.findIn = function (multi) {
   multi = multi || '';
   var val = this.valueOf();
   if (typeof multi == 'object' || typeof multi == 'array') {
      if (val in multi) {
         return multi[val];
      }
      else {
         for (var x in multi) {
            var found = this.findIn(multi[x]);
            if (found != false) {
               return found;
            }
         }
      }
   }
   return false;
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
   var rounded = prTemp;
   var length = this.items.length,
    element = null;
   for (var i = 0; i < length; i++) {
      element = this.items[i];
      if ((rounded <= element.max) && (rounded > element.min))
         return element;
   }
}

// Lookups - No point having these reinitialised everytime a new graph is created!!!!!

var UTCIValues = new lstGraphScales();
UTCIValues.items.push(new GraphScale("Extreme cold stress", -40, -30000, '#5555ff'));
UTCIValues.items.push(new GraphScale("Very strong cold stress", -27, -40, '#5f8dd3'));
UTCIValues.items.push(new GraphScale("Strong cold stress", -13, -27, '#75a4ea'));
UTCIValues.items.push(new GraphScale("Moderate cold stress", 0, -13, '#87cdde'));
UTCIValues.items.push(new GraphScale("Slight cold stress", 9, 0, '#aaeeff'));
UTCIValues.items.push(new GraphScale("No thermal stress", 26, 9, '#87deaa'));
UTCIValues.items.push(new GraphScale("Moderate heat stress", 32, 26, '#f4d7d7'));
UTCIValues.items.push(new GraphScale("Strong heat stress", 38, 32, '#e9afaf'));
UTCIValues.items.push(new GraphScale("Very strong heat stress", 46, 38, '#ff8080'));
UTCIValues.items.push(new GraphScale("Extreme heat stress", 30000, 46, '#ff5555'));

var WBGTValues = new lstGraphScales();
WBGTValues.items.push(new GraphScale("min/hr", 26, -30000, '#87deaa'));
WBGTValues.items.push(new GraphScale("min/hr", 27, 26, '#f4d7d7'));
WBGTValues.items.push(new GraphScale("min/hr", 28, 27, '#e9afaf'));
WBGTValues.items.push(new GraphScale("min/hr", 29, 28, '#ff8080'));
WBGTValues.items.push(new GraphScale("min/hr", 30, 29, '#ff5555'));
WBGTValues.items.push(new GraphScale("min/hr", 31, 30, '#ff2a2a'));
WBGTValues.items.push(new GraphScale("min/hr", 32, 31, '#d40000'));
WBGTValues.items.push(new GraphScale("min/hr", 33, 32, '#aa0000'));
WBGTValues.items.push(new GraphScale("min/hr", 34, 33, '#550000'));
WBGTValues.items.push(new GraphScale("min/hr", 30000, 34, '#2b0000'));

// Standard error stuff

function XYDataPoint() {
   this.X = 0.0;
   this.Y = 0.0;
}

function GetDataPointArray(prData) {
   var lcData = new Array();
   $(prData).each(function (key, value) {
      var lcNewDataPoint = new XYDataPoint();
      lcNewDataPoint.X = value[0];
      lcNewDataPoint.Y = value[1];
//	  var div = document.getElementById('outputX');
//div.innerHTML = div.innerHTML + '<br>' + lcNewDataPoint.X + '|' + lcNewDataPoint.Y;

      lcData.push(lcNewDataPoint);
   });
   return lcData;
}

function CalculateStandardError(prData, prTrend) {
   var lcResult = 0.0;
   var lcXError = 0.0;
   var lcYError = 0.0;
   var lcDataLength = 0;
   var lcXAvg = (prData[prData.length - 1].X - prData[0].X) / 2 + prData[0].X;

   $(prData).each(function (key, lcDataPoint) {
      lcYError += Math.pow((lcDataPoint.Y - prTrend.Y * lcDataPoint.X - prTrend.X), 2);
      lcXError += Math.pow((lcDataPoint.X - lcXAvg), 2);
      lcDataLength++;
   });

   lcResult = Math.sqrt(lcYError / (lcDataLength - 2)) / Math.sqrt(lcXError);
   return lcResult;
}


function CalculateYIntercept(prData) {
   var SumX = 0.0;
   var SumY = 0.0;
   var SumX2 = 0.0;
   var SumXY = 0.0;
   var D = 0.0;
   var lcDataLength = 0;
   var SlopeIntercept = new XYDataPoint();
   $(prData).each(function (key, lcDataPoint) {
      SumX += lcDataPoint.X;
      SumY += lcDataPoint.Y;
      SumX2 += lcDataPoint.X * lcDataPoint.X;
      SumXY += (lcDataPoint.X * lcDataPoint.Y);
      lcDataLength++;
   });
   D = lcDataLength * SumX2 - SumX * SumX;
   SlopeIntercept.Y = (lcDataLength * SumXY - SumY * SumX) / D;
   SlopeIntercept.X = (SumY * SumX2 - SumXY * SumX) / D;

   return SlopeIntercept;
}

function GetStandardError(prData) { // deprecated delete when page revamp goes live
   var lcData = GetDataPointArray(prData);
   var lcSlopeIntercept = CalculateYIntercept(lcData);
   mySlope = lcSlopeIntercept.Y;
   myIntercept = lcSlopeIntercept.X;
   var lcStandardError = CalculateStandardError(lcData, lcSlopeIntercept);
   return lcStandardError;
}

function getStandardError(prData) {
   var lcResult = new SEResults();
   var lcData = GetDataPointArray(prData);
   var lcSlopeIntercept = CalculateYIntercept(lcData);
   lcResult.slope = lcSlopeIntercept.Y;
   lcResult.yIntercept = lcSlopeIntercept.X;
   lcResult.standardError = CalculateStandardError(lcData, lcSlopeIntercept);
   return lcResult;
}

function SEResults() {
   this.slope = 0.0;
   this.yIntercept = 0.0;
   this.standardError = 0.0;
}

function roundHalf(num) {
   num = Math.round(num * 2) / 2;
   return num;
}

/* Standard Error Stuff Based on C# algorithm Courtesy of Matthias Otto

struct XYDataPoint
{
  public double X;
   public double? Y;
}
 
double StandardError(XYDataPoint[] prData, XYDataPoint prTrend)
        {
            double lcResult = 0;
            double lcXError = 0;
            double lcYError = 0;
            int lcDataLength = 0;
            double lcXAvg = (prData[prData.Length - 1].X - prData[0].X) / 2 + prData[0].X;
 
            foreach (XYDataPoint lcDataPoint in prData)
                if (lcDataPoint.Y != null)
                {   // trend structure: X = Intercept, Y = Slope
                    lcYError += Math.Pow((double)(lcDataPoint.Y - prTrend.Y * lcDataPoint.X - prTrend.X), 2);
                    lcXError += Math.Pow((double)(lcDataPoint.X - lcXAvg), 2);
                    lcDataLength++;
                }
 
            if (lcDataLength > 2)
                lcResult = Math.Sqrt(lcYError / (lcDataLength - 2)) / Math.Sqrt(lcXError);
 
            return lcResult;
        }
        */


/*
        XYDataPoint LineFit(XYDataPoint[] prData)
        {   // original algorithm, modified to exclude null data
            double SumX = 0;
            double SumY = 0;
            double SumX2 = 0;
            double SumXY = 0;
            double D = 0;
            XYDataPoint SlopeIntercept;
            int lcDataLength = 0;
 
            foreach (XYDataPoint lcDataPoint in prData)
                if (lcDataPoint.Y != null)
                {
                    // SumX += lcDataPoint.X;
                    // SumY += (double)lcDataPoint.Y;
                    // SumX2 += lcDataPoint.X * lcDataPoint.X;
                    // SumXY += (double)(lcDataPoint.X * lcDataPoint.Y);
                    // lcDataLength++;
                }
 
            D = lcDataLength * SumX2 - SumX * SumX;
            SlopeIntercept.Y = (lcDataLength * SumXY - SumY * SumX) / D; //Slope
            SlopeIntercept.X = (SumY * SumX2 - SumXY * SumX) / D; //actual Intercept
 
            return SlopeIntercept;
        }

*/

