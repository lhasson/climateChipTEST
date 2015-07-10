// Ryan's Hack Grid Coordinate Code
gridMove = 0;
var points = [];
var startLat = 0;
var startLng = 0;
var firstLoad = true; // bool to see if the spiral out search for land and therefore data should be made
for (var x = -1; x < 2; x++) {
	for (var y = -1; y < 2; y++) {
		points.push({lat:x, lng:y});              
	}
}

function GridCoordinate(prCoordIn) {
   return Math.round((parseFloat(prCoordIn + 0.25)) * 2) / 2 - .25;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function() {
        return this * Math.PI / 180;
    }
}

var mapLatStr = getCookie("mapLat");
var mapLngStr = getCookie("mapLng");
var gridLatStr = getCookie("gridLat");
var gridLngStr = getCookie("gridLng");

if (mapLatStr == "") {
	getLocation();
	try {
		var mapLat = (geoplugin_latitude());
		var mapLng = (geoplugin_longitude());	
	} catch(err) {
		var mapLat = -41.287934;
		var mapLng = 173.258198;	
	}
		
    var gridLat = GridCoordinate(mapLat);
    var gridLng = GridCoordinate(mapLng);
	startLat = parseFloat(mapLat);
	startLng = parseFloat(mapLng);
}
else {
    var mapLat = parseFloat(mapLatStr);
    var mapLng = parseFloat(mapLngStr);
    var gridLat = parseFloat(gridLatStr);
    var gridLng = parseFloat(gridLngStr);
	firstLoad = false;
}

var map;
var gridCell;
var StationMarkers = new Array();
var infoWindow = null;
var currentYear = 2013;
var oldZoom = -1;
var showStations = false;
var showClosest = false;

var gridLineOptions = {
   strokeColor: "#ff0000",
   strokeOpacity: 0.5,
   strokeWeight: 1,
   editable: false,
   visible: false,
   clickable: false
}

var gridLines = new Array();
var ClosetLine = null;
var ClosestStationMarker = null;

/**
 * 	
 * A JQUERY GOOGLE MAPS LATITUDE AND LONGITUDE LOCATION PICKER
 * version 1.1
 * 
 * Supports multiple maps. Works on touchscreen. Easy to customize markup and CSS.
 * 
 * To see a live demo, go to:
 * http://wimagguc.hu/projects/jquery-latitude-longitude-picker-gmaps/
 * 
 * by Richard Dancsi
 * http://wimagguc.hu/
 * 
 */

// for ie9 doesn't support debug console >>>
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };
// ^^^

var GMapsLatLonPicker = (function () {

   var _self = this;

   ///////////////////////////////////////////////////////////////////////////////////////////////
   // PARAMETERS (MODIFY THIS PART) //////////////////////////////////////////////////////////////
   _self.params = {
      defLat: 0,
      defLng: 0,
      defZoom: 1,
      queryLocationNameWhenLatLngChanges: true,
      queryElevationWhenLatLngChanges: true,
      mapOptions: {
         mapTypeId: google.maps.MapTypeId.ROAD,
         mapTypeControl: true,
		 mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, //Satellite, roadmap and labels options
			position: google.maps.ControlPosition.RIGHT_TOP
		 },
         disableDoubleClickZoom: true,
         zoomControlOptions: true,
         streetViewControl: false,
		 minZoom: 2, // to avoid user clicking into grey space at poles
		 styles: [ //removes POI like national parks, universities which can be clicked on - label pops up //LMH
					{
						"featureType": "poi",
						"elementType": "labels",
						"stylers": [
								{ 
									"visibility": "off" 
								}
							]
					}  
				]
      },
      strings: {
         markerText: "Drag this Marker",
         error_empty_field: "Couldn't find coordinates for this place",
         error_no_results: "Couldn't find coordinates for this place"
      }
   };


   ///////////////////////////////////////////////////////////////////////////////////////////////
   // VARIABLES USED BY THE FUNCTION (DON'T MODIFY THIS PART) ////////////////////////////////////
   _self.vars = {
      ID: null,
      LATLNG: null,
      map: null,
      marker: null,
      geocoder: null
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////
   // PRIVATE FUNCTIONS FOR MANIPULATING DATA ////////////////////////////////////////////////////
   var setPosition = function (position, viewport) {

      _self.vars.map.panTo(position);
      if (viewport) {
         _self.vars.map.fitBounds(viewport);
         if ((_self.vars.map.zoom >= 13) || (_self.vars.map.zoom == 12)) _self.vars.map.setZoom(9);
         if ((_self.vars.map.zoom == 11) || (_self.vars.map.zoom == 10)) _self.vars.map.setZoom(8);
         if ((_self.vars.map.zoom == 9) || (_self.vars.map.zoom == 8)) _self.vars.map.setZoom(7);

      }
      $(_self.vars.cssID + ".gllpZoom").val(_self.vars.map.getZoom());

      $(_self.vars.cssID + ".gllpLongitude").val(position.lng());
      $(_self.vars.cssID + ".gllpLatitude").val(position.lat());

      // Ryan's Code for adding Grid Cell Location
       mapLat = position.lat();
       mapLng = position.lng();

       setCookie("mapLat", mapLat);
       setCookie("mapLng", mapLng);

		gridLat = GridCoordinate(mapLat);
		gridLng = GridCoordinate(mapLng);

		setCookie("gridLat", gridLat);
		setCookie("gridLng", gridLng);

		setCookie("zoom", _self.vars.map.zoom);

		//./$(_self.vars.cssID).trigger("location_changed", $(_self.vars.cssID));

		if (_self.params.queryLocationNameWhenLatLngChanges) {
			getLocationName(mapLat, mapLng);
		}
		if (_self.params.queryElevationWhenLatLngChanges) {
			getElevation(position);
		}
		RenderGridCellCoordinates();
		if(Page == "Original")
			GetAllGridCellResults();
		if (Page == "Model")
			GetAllGridCellResultsModel();
	};

   // for getting the elevation value for a position
   var getElevation = function (position) {
      var latlng = new google.maps.LatLng(position.lat(), position.lng());

      var locations = [latlng];

      var positionalRequest = { 'locations': locations };

      _self.vars.elevator.getElevationForLocations(positionalRequest, function (results, status) {
         if (status == google.maps.ElevationStatus.OK) {
            if (results[0]) {
               $(_self.vars.cssID + ".gllpElevation").val(results[0].elevation.toFixed(3));
            } else {
               $(_self.vars.cssID + ".gllpElevation").val("");
            }
         } else {
            $(_self.vars.cssID + ".gllpElevation").val("");
         }
         $(_self.vars.cssID).trigger("elevation_changed", $(_self.vars.cssID));
      });
   };

   // search function
   var performSearch = function (string, silent) {
      if (string == "") {
         if (!silent) {
            displayError(_self.params.strings.error_empty_field);
         }
         return;
      }
      _self.vars.geocoder.geocode(
       { "address": string },
       function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
             $(_self.vars.cssID + ".gllpZoom").val(11);
             _self.vars.map.setZoom(8);
             setPosition(results[0].geometry.location, results[0].geometry.viewport);
          } else {
             if (!silent) {
                displayError(_self.params.strings.error_no_results);
             }
          }
       }
    );
   };

   // error function
   var displayError = function (message) {
      alert(message);
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////
   // PUBLIC FUNCTIONS  //////////////////////////////////////////////////////////////////////////
   var publicfunc = {

      // INITIALIZE MAP ON DIV //////////////////////////////////////////////////////////////////
      init: function (object) {

         if (!$(object).attr("id")) {
            if ($(object).attr("name")) {
               $(object).attr("id", $(object).attr("name"));
            } else {
               $(object).attr("id", "_MAP_" + Math.ceil(Math.random() * 10000));
            }
         }

         _self.vars.ID = $(object).attr("id");
         _self.vars.cssID = "#" + _self.vars.ID + " ";

         _self.params.defLat = 0;
         _self.params.defLng = 0;
         _self.params.defZoom = 1;

         _self.vars.LATLNG = new google.maps.LatLng(_self.params.defLat, _self.params.defLng);

         _self.vars.MAPOPTIONS = _self.params.mapOptions;
         _self.vars.MAPOPTIONS.zoom = _self.params.defZoom;
         _self.vars.MAPOPTIONS.center = _self.vars.LATLNG;

         _self.vars.map = new google.maps.Map($(_self.vars.cssID + ".gllpMap").get(0), _self.vars.MAPOPTIONS);
         _self.vars.geocoder = new google.maps.Geocoder();
         _self.vars.elevator = new google.maps.ElevationService();

         //_self.vars.marker = new google.maps.Marker({
         //    position: _self.vars.LATLNG,
         //    map: _self.vars.map,
         //    title: _self.params.strings.markerText,
         //    draggable: true
         //});

         // Set position on -doubleclick dbl - [changed to single click] dbl
         google.maps.event.addListener(_self.vars.map, 'click', function (event) {
			gridMove = 0;
			firstLoad = false;
            setPosition(event.latLng);
			
         });
		 


         //// Set position on marker move
         //google.maps.event.addListener(_self.vars.marker, 'dragend', function(event) {
         //    setPosition(_self.vars.marker.position);
         //});

         // Set zoom field's value when user changes zoom on the map
         google.maps.event.addListener(_self.vars.map, 'zoom_changed', function (event) {
            $(_self.vars.cssID + ".gllpZoom").val(_self.vars.map.getZoom());
            $(_self.vars.cssID).trigger("location_changed", $(_self.vars.cssID));
            setCookie("zoom", _self.vars.map.zoom);
         });

         // Update location and zoom values based on input field's value 
         $(_self.vars.cssID + ".gllpUpdateButton").bind("click", function () {
            var lat = $(_self.vars.cssID + ".gllpLatitude").val();
            var lng = $(_self.vars.cssID + ".gllpLongitude").val();
            var latlng = new google.maps.LatLng(lat, lng);
            map.setZoom(8);
            setPosition(latlng);
         });

         // Search function by search button
         $(_self.vars.cssID + ".gllpSearchButton").bind("click", function () {
            performSearch($(_self.vars.cssID + ".gllpSearchField").val(), false);
         });

         // Search function by gllp_perform_search listener
         $(document).bind("gllp_perform_search", function (event, object) {
            performSearch($(object).attr('string'), true);
         });

         map = _self.vars.map;
      }

   }
   return publicfunc;
});


$(document).ready(function () {

   if(getParameterByName('mode') == 'dev')
      $('body').css('width', '990px').css('margin', '10px auto');
   $(".gllpLatlonPicker").each(function () {
      (new GMapsLatLonPicker()).init($(this));
   });
   RenderGrid();
   //startLat = mapLat;
  // startLng = mapLng;
   map.panTo(new google.maps.LatLng(mapLat, mapLng));
   
   getLocationName(mapLat, mapLng);
   var zoomCookie = parseFloat(getCookie("zoom"));   
   if (!isNaN(zoomCookie)) {
       map.setZoom(zoomCookie);
   }
   else {
       map.setZoom(7);
   }


	infoWindow = new google.maps.InfoWindow({content: "holding..."});
	$('#maplegend').append('<div id="maplegendinfo"><img style="margin-right: 25px; height: 25px;" src="/DBSERVER/img/marker-small.png" alt="Marker" />Orange markers indicate weather stations that have data for<br />90%+ of all days 1980-' + currentYear + '. <b>Clicking</b> a marker reveals more info.</div>');
	$('#showstations').click(function(){
		if ($("#showstations").attr("checked")) {
			showStations = true;
			
			GenerateMarkers();
			$('#maplegendinfo').css('visibility', 'visible');
		}
		else {
			showStations = false;
			if(showClosest == false)
				$('#maplegendinfo').css('visibility', 'hidden');
			clearClusters();
		}    
	});
   $('#showclosest').click(function(){
      if($("#showclosest").attr("checked")) {
         showClosest = true;
         CalculateClosestStation();
         $('#maplegendinfo').css('visibility', 'visible');
      }
      else{
         showClosest = false;
         if(showStations == false)
            $('#maplegendinfo').css('visibility', 'hidden');
         ClearClosestStation();
         
      }
   });

    // Check cookies are enabled.  If not, show subtle message in map header (make span visible).
   if (!(are_cookies_enabled())) {
       $('#divCookies').css('visibility', 'visible');
   }
   $('#maplegendinfo').css('visibility', 'hidden');
	
});


function RenderGrid() {

   var lngStart = -179.5;
   while (lngStart != 180.5) {
      RenderGridLine(90, -90, lngStart, lngStart);
      lngStart += 0.5;
   }

   var latStart = -90;
   while (latStart != 90.5) {
      RenderGridLine(latStart, latStart, -180, 0);
      RenderGridLine(latStart, latStart, 0, 180);
      latStart += 0.5;
   }
}

function RenderGridLine(latStart, latStop, lngStart, lngStop) {
   var newGridLine = new google.maps.Polyline(gridLineOptions);
   newGridLine.setMap(map);
   newGridLine.getPath().push(new google.maps.LatLng(latStart, lngStart));
   newGridLine.getPath().push(new google.maps.LatLng(latStop, lngStop));
   gridLines.push(newGridLine);

	//google.maps.event.trigger(newGridLine, 'click', {
   //     latLng: event.latlng
	//});
}

$(document).bind("location_changed", function (event, object) {
   console.log("changed: " + $(object).attr('id'));
   ShowGrid();

});

function RenderGridCell() {
   if (gridCell != null) {
      gridCell.setMap(null);
      gridCell = null;
   }
   var gridCellCoords = [
       new google.maps.LatLng(gridLat - 0.25, gridLng - 0.25),
       new google.maps.LatLng(gridLat - 0.25, gridLng + 0.25),
       new google.maps.LatLng(gridLat + 0.25, gridLng + 0.25),
       new google.maps.LatLng(gridLat + 0.25, gridLng - 0.25)
   ];
   gridCell = new google.maps.Polygon({
      paths: gridCellCoords,
      strokeColor: '#ff0000',
      strokeWeight: 1,
      strokeOpacity: 0.8,
      fillColor: '#ff0000',
      fillOpacity: 0.2,
      clickable: false
   });
   gridCell.setMap(map);
}

function ShowGrid() {
   if (map.zoom > 5) {
      for (i = 0; i < gridLines.length; i++) {
         gridLines[i].setOptions({ visible: true });
      }

   }
   else {
      for (i = 0; i < gridLines.length; i++) {
         gridLines[i].setOptions({ visible: false });
      }
   }
   RenderGridCellCoordinates();
}

function RenderGridCellCoordinates() {
	//alert('nowf');
   //if (map.zoom > 5) {
   var lcOutput = '<table id="tblGridCellCoordinates" border="0" cellpadding="5" cellspacing="5">';
   lcOutput += '<tr><td><b>Latitude</b></td><td><b>Longitude</b></td></tr>';
   //lcOutput += '<tr><td><b>Map Coordinates</b></td><td>' + mapLat.toFixed(2) + '</td><td>' + mapLng.toFixed(2) + '</td></tr>';
   lcOutput += '<tr><td style="text-align: right">' + gridLat + '</td><td style="text-align: right">' + gridLng + '</td></tr>';
   lcOutput += '</table>';
   //}
   //else {
   //   $('#tblGridCellCoordinates').remove();
   //}
   $('#divGridCell').html(lcOutput);
   RenderGridCell();
   CalculateClosestStation();
}

function ClearClosestStation(){
   if(ClosetLine != null){
      ClosetLine.setMap(null);
	  ClosetLine = null;
	}
   if(ClosestStationMarker != null){
      ClosestStationMarker.setMap(null);
      ClosestStationMarker = null;
   }
}

function CalculateClosestStation(){
   if(!showClosest)
      return;
   ClearClosestStation();
   var Distances = new Array();
   var Shortest = 1000000;
   var StationIndex = -1;
   for(var i = 0; i < WeatherStations.length; i++) {
      var φ1 = gridLat.toRadians(), φ2 = WeatherStations[i].Latitude.toRadians(), Δλ = (WeatherStations[i].Longitude-gridLng).toRadians(), R = 6371;
	  var d = Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;
	  Distances.push(d);
   }
   for (var i = 0; i < Distances.length; i++){
      if(Distances[i] < Shortest) {
	     Shortest = Distances[i];
		 StationIndex = i;
	  }
   }
   var ClosestCoordinates = [
      new google.maps.LatLng(gridLat, gridLng),
	  new google.maps.LatLng(WeatherStations[StationIndex].Latitude, WeatherStations[StationIndex].Longitude)
   ];
   ClosetLine = new google.maps.Polyline({
      path: ClosestCoordinates,
      geodesic: true,
      strokeColor: 'green',
      strokeOpacity: 0.75,
      strokeWeight: 1.5
   });
   ClosetLine.setMap(map);
   
  // ClosestStationMarker = GenerateMarker(WeatherStations[StationIndex]);
  // ClosestStationMarker.setMap(map);
 
   console.log("StationIndex is " + StationIndex);
}

function RenderHeatMap() {
   var Bounds = map.getBounds();
   var GridCells = new Array();
   var north = (Math.round(map.getBounds().getNorthEast().lat() * 2) / 2).toFixed(2) - 0.25;
   var east = (Math.round(map.getBounds().getNorthEast().lng() * 2) / 2).toFixed(2) - 0.25;
   var south = (Math.round(map.getBounds().getSouthWest().lat() * 2) / 2).toFixed(2) - -0.25;
   var west = (Math.round(map.getBounds().getSouthWest().lng() * 2) / 2).toFixed(2) - -0.25;
   console.log("North - " + north);
   console.log("South - " + south);
   console.log("West - " + west);
   console.log("East - " + east);
   for (var lng = west; lng < east ; lng -= 0.5)
      for (var lat = north ; lat > south; lat -= 0.5) {
         var gridCellCoords = [
       new google.maps.LatLng(lat - 0.25, lng - 0.25),
       new google.maps.LatLng(lat - 0.25, lng + 0.25),
       new google.maps.LatLng(lat + 0.25, lng + 0.25),
       new google.maps.LatLng(lat + 0.25, lng - 0.25)
         ];
         GridCells.push(gridCellCoords);
         if (GridCells.length == 10) {
            var HeatMap = new google.maps.Polygon({
               paths: GridCells,
               strokeWeight: 0,
               fillColor: "#FF00",
               fillOpacity: 0.2
            });
            HeatMap.setMap(map);
            GridCells = new Array();
         }

         console.log(GridCells.length);
      }
   HeatMap = new google.maps.Polygon({
      paths: GridCells,
      fillColor: "#FFFF00",
      fillOpacity: 0.1
   });
   HeatMap.setMap(map);
}

//Geocoding code

//HTML5 Geolocation options
var options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

//HTML5 Geolocation call
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successFunction, errorFunction, options);
	}
}

//Get the latitude and the longitude from success of HTML5 Geolocation call
function successFunction(position) {

	startLat = position.coords.latitude;
    startLng = position.coords.longitude;
	
	//Set lat and long to public vars
	mapLat = startLat;
	mapLng = startLng;
	gridLat = GridCoordinate(mapLat);
    gridLng = GridCoordinate(mapLng);
	
	//Go to location and draw red grid
	map.panTo(new google.maps.LatLng(mapLat, mapLng));
	RenderGridCellCoordinates();
	if(Page == "Original")
          GetAllGridCellResults();
    if (Page == "Model")
          GetAllGridCellResultsModel();
	
	//Get text name of location through reverse geocoding
	getLocationName(mapLat, mapLng);
}

//If HTML5 Geolocation call fails
function errorFunction(error){
   switch(error.code) {
        case error.PERMISSION_DENIED:

            break;
        case error.POSITION_UNAVAILABLE:

            break;
        case error.TIMEOUT:

            break;
        case error.UNKNOWN_ERROR:
           alert('ink');
            break;
    }
}

//For reverse geocoding
function getLocationName(prLat, prLng) {
	var geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(prLat, prLng);
	
	var cityCountryName = geocoder.geocode({ 'latLng': latlng }, function (results, status) {
	
        if (status == google.maps.GeocoderStatus.OK )  {
			var arrAddress = "";
			var city = "";
			var country = "";
			
			for (var i = 0; i < results[0].address_components.length; i++) {
				var addr = results[0].address_components[i];
				// check if this entry in address_components has a type of country
				if (addr.types[0] == 'country') {
					country = addr.long_name;
				}
				else if (addr.types[0] == ['locality'])  
				{ // City
					city = addr.long_name;
                }
			}

			if (city == "") {
				arrAddress = country;
			} else {
				arrAddress = city + ", " + country;
			}

            $(".gllpSearchField").val(arrAddress);
        } else {
            $(".gllpSearchField").val("");
        }
    });
}
  
// Algorithm to spiral out from initially-set location on load if no climate data
// was returned.  Called from GetAllGridCellResultsSuccess() in wbgt- files
function noDataFound() {

	if (gridMove < 9)
	{
		latFactor = points[gridMove].lat;
		lngFactor = points[gridMove].lng;
		
		mapLat = startLat + (latFactor * 0.5);
		mapLng = startLng + (lngFactor * 0.5);
        
		gridLat = GridCoordinate(mapLat);
		gridLng = GridCoordinate(mapLng);
		gridMove++;
		
	//	GetAllGridCellResults();
		//Go to location and draw red grid
		//map.panTo(new google.maps.LatLng(mapLat, mapLng));
		RenderGridCellCoordinates();
		if(Page == "Original")
          GetAllGridCellResults();
		if (Page == "Model")
          GetAllGridCellResultsModel();
		
		//Get text name of location through reverse geocoding
		getLocationName(mapLat, mapLng);
	}
	else
	{
		firstLoad = false;
		map.panTo(new google.maps.LatLng(mapLat, mapLng));
	}
}