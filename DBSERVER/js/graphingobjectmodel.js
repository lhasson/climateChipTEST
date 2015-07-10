function DFGraphModel() {
    this.models = new Array();
    this.jqPlotOptionsThirty = {
        title: "",
        axesDefaults: {
            tickRenderer: $.jqplot.CanvasAxisTickRenderer

        },
        axes: {
            xaxis: {
                numberTicks: 13,
                ticks:[[1980, '1980'],[1990, '1990'],[2000, '2000'],[2010, '2010'],[2020, '2020'],[2030, '2030'],[2040, '2040'],[2050, '2050'],[2060, '2060'],[2070, '2070'],[2080, '2080'],[2090, '2090'],[2100, '2100']],
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
                show: false,         // show the trend line
                color: '#ff0000',   // CSS color spec for the trend line.
                label: '',          // label for the trend line.
                type: 'linear',     // 'linear', 'exponential' or 'exp'
                shadow: true,       // show the trend line shadow.
                lineWidth: 2,     // width of the trend line.
                shadowAngle: 45,    // angle of the shadow.  Clockwise from x axis.
                shadowOffset: 1.5,  // offset from the line of the shadow.
                shadowDepth: 3,     // Number of strokes to make when drawing shadow.
                // Each stroke offset by shadowOffset from the last.
                shadowAlpha: 0.07   // Opacity of the shadow
            }
           
        },
        
    };
    this.JSONLookups = ["TemperatureMax", "TemperatureMean", "DewPoint", "WBGTMax", "WBGT", "UTCIMax", "UTCI"];

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
            showMarker: true,
			rendererOptions: {
                smooth: 10,
                constrainSmoothing: true
            }
        },
        series: [
            {color: modelColors[0], linePattern: 'dashed', markerOptions: { style:'filledCircle' }}, //HadGem 6.0
            {color: modelColors[0], markerOptions: { style:'filledCircle' }}, //HadGem 8.5 
            {color: modelColors[1], linePattern: 'dashed', markerOptions: { style:'filledDiamond' }}, //NORES 6.0
            {color: modelColors[1], markerOptions: { style:'filledDiamond' }}, //NORES 8.5 
			{color: modelColors[2], linePattern: 'dashed', markerOptions: { style:'filledSquare' }}, //GFDL 6.0
            {color: modelColors[2], markerOptions: { style:'filledSquare' }}, //GFDL 8.5 
            {color: modelColors[3], linePattern: 'dashed', markerOptions: { style:'x' }}, //ICPM 6.0
            {color: modelColors[3], markerOptions: { style:'x' }}, //ICPM 8.5 
            {color: modelColors[4], linePattern: 'dashed', markerOptions: { style:'plus' }}, //MIROC 6.0
			{color: modelColors[4], markerOptions: { style:'plus' }}, //MIROC 8.5 
        ],
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
        },
        rendererOptions: {
            smooth: 10,
            constrainSmoothing: true
        }
    };
	
	this.myThemeStraight = {
		grid: {
            drawBorder: false,
            shadow: false,
            background: 'rgba(255, 255, 255, 0.0)'
        },
        seriesDefaults: {
            shadow: false,
            showMarker: true,
			rendererOptions: {
                smooth: 0,
                constrainSmoothing: true
            }
        },
        series: [
            {color: modelColors[0], linePattern: 'dashed', markerOptions: { style:'filledCircle' }}, //HadGem 6.0
            {color: modelColors[0], markerOptions: { style:'filledCircle' }}, //HadGem 8.5 
            {color: modelColors[1], linePattern: 'dashed', markerOptions: { style:'filledDiamond' }}, //NORES 6.0
            {color: modelColors[1], markerOptions: { style:'filledDiamond' }}, //NORES 8.5 
			{color: modelColors[2], linePattern: 'dashed', markerOptions: { style:'filledSquare' }}, //GFDL 6.0
            {color: modelColors[2], markerOptions: { style:'filledSquare' }}, //GFDL 8.5 
            {color: modelColors[3], linePattern: 'dashed', markerOptions: { style:'x' }}, //ICPM 6.0
            {color: modelColors[3], markerOptions: { style:'x' }}, //ICPM 8.5 
            {color: modelColors[4], linePattern: 'dashed', markerOptions: { style:'plus' }}, //MIROC 6.0
			{color: modelColors[4], markerOptions: { style:'plus' }}, //MIROC 8.5 
        ],
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
        },
        rendererOptions: {
            smooth: 0,
            constrainSmoothing: true
        }
    };
	
	//New
	this.trendTheme = {
        grid: {
            drawBorder: false,
            shadow: false,
            background: 'rgba(255, 255, 255, 0.0)'
        },
        seriesDefaults: {
            shadow: false,
            showMarker: true
        },
        series: [{
			color: modelColors[0], showLine:false,  markerOptions: { style:'filledCircle' },
			trendline: {
				show: true, 
				color: modelColors[0],
				linePattern: 'dashed'
			}
		},{
			color: modelColors[0], showLine:false,  markerOptions: { style:'filledCircle' },
			trendline: {
				show: true, 
				color: modelColors[0]
			}
		},{
			color: modelColors[1], showLine:false,  markerOptions: { style:'filledDiamond' },
			trendline: {
				show: true, 
				color: modelColors[1],
				linePattern: 'dashed'
			}
		},{
			color: modelColors[1], showLine:false,  markerOptions: { style:'filledDiamond' },
			trendline: {
				show: true, 
				color: modelColors[1]
			}
		},{
			color: modelColors[2], showLine:false,  markerOptions: { style:'filledSquare' },
			trendline: {
				show: true, 
				color: modelColors[2],
				linePattern: 'dashed'
			}
		},{
			color: modelColors[2], showLine:false,  markerOptions: { style:'filledSquare' },
			trendline: {
				show: true, 
				color: modelColors[2]
			}
		},{
			color: modelColors[3], showLine:false,  markerOptions: { style:'x' },
			trendline: {
				show: true, 
				color: modelColors[3],
				linePattern: 'dashed'
			}
		},{
			color: modelColors[3], showLine:false,  markerOptions: { style:'x' },
			trendline: {
				show: true, 
				color: modelColors[3]
			}
		},{
			color: modelColors[4], showLine:false,  markerOptions: { style:'plus' },
			trendline: {
				show: true, 
				color: modelColors[4],
				linePattern: 'dashed'
			}
		},{
			color: modelColors[4], showLine:false,  markerOptions: { style:'plus' },
			trendline: {
				show: true, 
				color: modelColors[4]
			}
		}],
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
        },
        rendererOptions: {
            smooth: 10,
            constrainSmoothing: true
        }
    }; // End trendtheme
}

DFGraphModel.prototype = new DFGraph();

DFGraphModel.prototype.getEmptyModelArray = function(){
    var emptyModelArray = new Array();
    for(var i = 0; i<models.length;i++){
		emptyModelArray[i] = new Array();
		
		for (var j = 1; j<rcpNos.length; j++) { //skip rcp = 0
        
			emptyModelArray[i][j] = new Array();
		}
    }
    return emptyModelArray;
};

//Create Monthly Distribution graph
DFGraph.prototype.createMonthlyGraph = function () {

    var monthlyRawData = GetMonthlyRawData(this.lat, this.lng);
    var monthlyGraphData = this.getEmptyModelArray();
    var parent = this;
	var rcpArray = new Array();
	var chosenYear = $("#lstYearBracket").val();		

	//For RCP = 6.0 and RCP = 8.5
	for (var currentRCP = 1; currentRCP < this.rcpNos.length; currentRCP++) { 
		
		//For all models
		for (var currentModel = 0; currentModel < this.models.length; currentModel++) {
		
			var currentModelIndex = models.indexOf(models[currentModel]);
			var newArray = new Array();
			
			//For months 1 - 12
			for (var i = 1; i < 13; i++) {
			
				var lcItem = new Array();
				lcItem[0] = arrMonths[i];  //Month name
				if (parent.temperature == "C")
					//Get temperature from monthlyRawData [rcp][model][month]
					lcItem[1] = parent.JSONLookups[parent.parameterIndex].findIn(monthlyRawData)[chosenYear][currentRCP - 1][currentModelIndex][i];
				else
					lcItem[1] = ConvertToFarenheit(parent.JSONLookups[parent.parameterIndex].findIn(monthlyRawData)[chosenYear][currentRCP - 1][currentModelIndex][i]);
				newArray[i - 1] = lcItem; //Month = 1 becomes index 0 etc.
			}
			//Store in monthlyGraphData [model][rcp]
			monthlyGraphData[this.models[currentModel]][this.rcpNos[currentRCP - 1]] = newArray;
		}
	}
    this.getMonthlyFileTitle("Tomorrow");
    this.getMonthlyChartTitle("Tomorrow");
    this.jqPlotOptionsMonthly.axes.yaxis.label = this.ytitle;
    this.renderMonthlyGraph(monthlyGraphData);
};

//Create default graph from 1980 to 2100 - 4 points for each model type
DFGraphModel.prototype.createThirtyGraph = function () {
    var thirtyRawData = GetThirtyYearData(this.lat, this.lng, numYears, this.type, this.models);
    var thirtyGraphData = this.getEmptyModelArray();
    var parent = this;
	
	//For all models (5)
    for (var currentModel = 0; currentModel < this.models.length; currentModel++) { 
        var tempArray = new Array();
		
		//For all of the data
        for (var i=0; i < thirtyRawData.length;i++) {
		
			//If the record's model is the same for this iteration
            if (thirtyRawData[i].Model == models[this.models[currentModel]]) {
                tempArray.push(thirtyRawData[i]);  //tempArray is all four years for one model
			}
        }
		
		//Array for this model for each RCP
		var noRcpNoArray = new Array();
		
		//For each RCP no (0, 6.0, 8.5)
		for(var currentRcp = 0; currentRcp < this.rcpNos.length; currentRcp++) {
			
			var newArray = new Array(); 
			var rcpArray = new Array();
			
			//For all records in tempArray - filtered by model
			for(var j=0; j < tempArray.length; j++) {
				
				//If the record's RCP No is the same as this iteration
				if(tempArray[j].RcpNo == rcpNos[this.rcpNos[currentRcp]]) {
					rcpArray.push(tempArray[j]);
				}
			}
			
			//If RCP is NOT 0, push the RCP=0 record to the first position of penultimate array, since all non-zero RCPs share the same 1992 point.
			if(currentRcp != 0) {
				newArray.push(noRcpNoArray[0][0]);
			} 
			
			//For all RCPs (although the RCP=0 iteration won't matter), get the year and temperature values.
			$(rcpArray).each(function (index, lcGridResult) {
				var lcItem = new Array();
				lcItem[0] = parseInt(lcGridResult.Years);
				if (parent.temperature == "C")
					lcItem[1] = parent.JSONLookups[parent.parameterIndex].findIn(lcGridResult);
				else
					lcItem[1] = ConvertToFarenheit(parent.JSONLookups[parent.parameterIndex].findIn(lcGridResult));
				newArray.push(lcItem);
			});
			
			//If RCP=0, push the year and temp values to noRcpNoArray, awaiting for insertion into the non-zero RCP newArray.
			if(currentRcp == 0) {
				noRcpNoArray.push(newArray);
			} else {
				//Put the newArray with the four points (the first of which is RCP=0 points) into final array.
				thirtyGraphData[this.models[currentModel]][this.rcpNos[currentRcp]] = newArray;
			}
		}
    }
    this.getThirtyFileTitle("Tomorrow");
    this.getThirtyChartTitle("Tomorrow");
    this.jqPlotOptionsThirty.axes.yaxis.label = this.ytitle;
    this.renderThirtyGraph(thirtyGraphData);
};

//Render monthly graph
DFGraphModel.prototype.renderMonthlyGraph = function (prGraphData) {
	// $('#jqPlotGraph').html("");
	//$('#btnSaveGraph').remove();
	// $('#btnShowTable').remove();		//[model][rcp]
   			//var rcpNos = new Array(0, 60, 85);

	this.plot = $.jqplot("jqPlotGraph", [prGraphData[0][0], prGraphData[0][1], prGraphData[1][0], prGraphData[1][1], prGraphData[2][0], prGraphData[2][1],prGraphData[3][0], prGraphData[3][1], prGraphData[4][0], prGraphData[4][1]], $.extend(true, {}, this.myTheme, this.jqPlotOptionsMonthly));
	
	for (r = 1; r < rcpNos.length; r++) {
		
		var rcpChk = document.getElementById('chkRCP' + rcpNos[r]).checked;
		
		for (x = 0; x < checkBoxModels.length; x++) {
			
			var modelName = checkBoxModels[x];
			modelName = modelName.substring(0, modelName.length -1);
			
			var parityNo = r - 1;
			
			if (x % 2 === parityNo) { 
			
				//Determine if RCP checkbox is checked - if so, show it
				var chkChecked = $('#' + modelName).is(":checked") && rcpChk;
				graph.plot.series[x].show = chkChecked;	
			}
		}		
	}
	
	//graph.plot.redraw(true); //Redraw
	graph.plot.replot({ resetAxes: (numPlotted > 0) }); //Refresh axes		
};

DFGraphModel.prototype.getMonthlyChartTitle = function () {
    this.jqPlotOptionsMonthly.title = this.parameterText + ' (Model Monthly Averages).<div>Latitude: ' + this.lat + ' &amp; Longitude: ' + this.lng + '</div>';
};

//Render thirty graph	
DFGraphModel.prototype.renderThirtyGraph = function (prGraphData) {
	
	var setThemeIndex;
	var lineType = document.getElementById('lstLineType').selectedIndex;
	
	if (lineType == 0) {
		setThemeIndex = this.myTheme;
	} else if (lineType == 1) {
		setThemeIndex = this.myThemeStraight;
	} else {
		setThemeIndex = this.trendTheme;
	}
	//  $('#jqPlotGraph').html("");
	//$('#btnShowTable').remove();
	//  $('#btnSaveGraph').remove();		//[model][rcp]
    this.plot = $.jqplot("jqPlotGraph", [prGraphData[0][1], prGraphData[0][2], prGraphData[1][1], prGraphData[1][2], prGraphData[2][1], prGraphData[2][2], prGraphData[3][1], prGraphData[3][2], prGraphData[4][1], prGraphData[4][2]], $.extend(true, {}, setThemeIndex, this.jqPlotOptionsThirty));

	//this.standardError = getStandardError(prGraphData);
	
	for (r = 1; r < rcpNos.length; r++) {
		
		var rcpChk = document.getElementById('chkRCP' + rcpNos[r]).checked;
		
		for (x = 0; x < checkBoxModels.length; x++) {
			
			var modelName = checkBoxModels[x];
			modelName = modelName.substring(0, modelName.length -1);
			
			var parityNo = r - 1;
			
			if (x % 2 === parityNo) { 
			
				//Determine if RCP checkbox is checked - if so, show it
				var chkChecked = $('#' + modelName).is(":checked") && rcpChk;
				graph.plot.series[x].show = chkChecked;	
				graph.plot.series[x].trendline.show = chkChecked && (lineType == 2);	
			}
		}		
	}
	
	//graph.plot.redraw(true); //Redraw
	graph.plot.replot({ resetAxes: true }); //Refresh axes
    //this.renderTrendInfo(); // Timeout to let the jqPlot finish rendering? Caused a lockup!!! // Ryan
	//$('#divGraphContainer').append('<input id="btnShowTable" class="btn" type="button" onclick="CreateDataTable();" value="Show Data Table" />');
	$('#tableName').val(this.fileTitle); //Set title for data table into form for submitting to PHP which creates excel
	var gradientArray = this.CalculateGradient(prGraphData);
	PopulateGradientTable(gradientArray, lineType);
	StoreDataTable(prGraphData);
};

DFGraphModel.prototype.saveGraph = function () {
    var imgData = $('#jqPlotGraph').jqplotToImageStr({});
    var tempData = $('#jqPlotGraph').jqplotToImageCanvas({});
    if (!tempData)
        return false;
    var data = tempData.toDataURL("image/png");
    data = data.substr(data.indexOf(',') + 1).toString();
    $('#imgdata').val(data);
    $('#name').val(this.fileTitle + '.png');
    //$('#divGraphContainer').append('<input style="bottom: -156px;" id="btnSaveGraph" class="btn" type="button" value="Save this Graph as an Image" />');
    $('#frmjqPlot').submit(); // Submit PHP
};

DFGraphModel.prototype.CalculateGradient = function (prGraphData) {
	
	var gradientArray = this.getEmptyModelArray();
			
	for (x = 0; x < models.length; x++) {
			
		for (r = 1; r < rcpNos.length; r++) {

			gradientArray[x][r] = getStandardError(prGraphData[x][r]);
		}
	}
	
	return gradientArray;
}