$(function () {
    $('#btnCalculate').click(CalculateWBGTOptions);
});

function CalculateWBGTOptions() {
    var temperature = parseFloat($('#txtTemperature').val());
    var temperatureType = $('[name=radTemperature]:checked').val();
    var humidity = parseFloat($('#txtHumidity').val());
    var humidityType = $('[name=radHumid]:checked').val();
    var AJAXData = '{"temperature": ' + temperature + ', "temperatureType": "' + temperatureType + '", "humidity": ' + humidity + ', "humidityType": "' + humidityType + '"}';
    AJAXCall("CalculateHeatIndexes.php", AJAXData, CalculateWBGTOptionsSuccess, GeneralServiceError)
  //  AJAXCall("/ClimateCHIPInterfaceService.svc/CalculateWBGTOptions", AJAXData, CalculateWBGTOptionsSuccess, GeneralServiceError)
}

function CalculateWBGTOptionsSuccess(prData) {
    var result = '<h2>Calculated WBGT/UTCI Results in &deg;C</h2>';
    result += '<table border="0" cellpadding="5">';
//    result += '<tr><td align="right"><b>WBGT</b></td><td>' + prData.d.WBGT + '</td></tr>';
//    result += '<tr><td align="right"><b>UTCI</b></td><td>' + prData.d.UTCI + '</td></tr>';
    result += '<tr><td align="right"><b>WBGT</b></td><td>' + prData.WBGT + '</td></tr>';
    result += '<tr><td align="right"><b>UTCI</b></td><td>' + prData.UTCI + '</td></tr>';
    $('#divWBGTOutput').html(result);
}
function ConvertTemps() {
    if ($('#lstTempType').val() == "C")
        $('#divLookupGridResultResult h2').html('<h2>Historic WBGT/UTCI Lookup Results in &deg;C(Shade)</h2>');
    else
        $('#divLookupGridResultResult h2').html('<h2>Historic WBGT/UTCI Lookup Results in &deg;F(Shade)</h2>');
    $('#historicResults td.tdTemp').each(function (temp, index) {
        if ($(this).html() != "") {
            var lcTemperature = parseFloat($(this).html());
            if ($('#lstTempType').val() == "F")
                $(this).html(ConvertToFarenheit(lcTemperature).toFixed(1));
            else
                $(this).html(ConvertToCelcius(lcTemperature).toFixed(1));
        }
    });
    RenderGraph();
}

function ConvertToCelcius(prTemperature) {
    return (prTemperature - 32) * 5 / 9;
}

function ConvertToFarenheit(prTemperature) {
    return prTemperature * 9 / 5 + 32;
}