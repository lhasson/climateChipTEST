/**
 * The current webpage uses markerclusterer_compiled.js
 * The code is minified so the licensing text is included below.
 *
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0.1
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 	
 * or <a href="LICENSE-2.0.txt">"LICENSE-2.0.txt</a>
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'averageCenter': (boolean) Wether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 * @constructor
 * @extends google.maps.OverlayView
 *
 * This file is markerhandler.js
 * 
 * Uses markerclusterer_compiled.js 
 * http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js
 * The code groups nearby markers into clusters to reduce the loading
 * time of adding all of the weather station data.
 * 
 * 2015 Lloyd Hasson
*/ 
 
var styles = [[{
	url: '/DBSERVER/img/marker-light.png',
	height: 47,
	width: 48,
	anchor: [14, 0],
	textColor: '#fff',
	textSize: 11
}, {
	url: '/DBSERVER/img/marker-med.png',
	height: 47,
	width: 48,
	anchor: [14, 0],
	textColor: '#fff',
	textSize: 11
}, {
	url: '/DBSERVER/img/marker-dark.png',
	height: 47,
	width: 48,
	anchor: [14, 0],
	textColor: '#fff',
	textSize: 11
}
]];

var markerClusterer = null;
var map = null;
var imageUrl = '/DBSERVER/img/marker-small.png';

function GenerateMarkers() {

    if (markerClusterer) {
		markerClusterer.clearMarkers();
    }
	
	var markers = [];

//This is the image at full zoom, ie. single point, not clustered
	var markerImage = new google.maps.MarkerImage(imageUrl,	new google.maps.Size(24, 32));

	for (var i = 0; i < WeatherStations.length; ++i) {
		var latLng = new google.maps.LatLng(WeatherStations[i].Latitude, WeatherStations[i].Longitude)
		
		var marker = new google.maps.Marker({
			position: latLng,
			map : map,
			visible : true,
			zIndex : 10,
			icon: markerImage,
			info : '<div class="scrollfix"><b>' + WeatherStations[i].StationName + '</b>'
											   + '<br /><b>Elevation:</b> ' + WeatherStations[i].Elevation_m + 'm'
											   + '<br /><b>Data Density 1980-' + currentYear + ':</b> ' + (WeatherStations[i].NOAAReadings / (((currentYear-1980)+1)*365.25) * 100).toFixed(1) + '%'
		});
		google.maps.event.addListener(marker, 'click', function() {infoWindow.setContent(this.info);infoWindow.open(map, this);});
		markers.push(marker);
	}

	/*var zoom = parseInt(document.getElementById('zoom').value, 10);
	var size = parseInt(document.getElementById('size').value, 10);
	var style = parseInt(document.getElementById('style').value, 10);*/
	var zoom =  null ;
	var size = null ;
	var style = 0;

	markerClusterer = new MarkerClusterer(map, markers, {
		maxZoom: zoom,
		gridSize: size,
		styles: styles[style]
		});
		
	google.maps.event.addListener(map,'dragstart',function(){
		markerClusterer.zoomOnClick_=false;
	});
	
	google.maps.event.addListener(map,'mouseup',function(){setTimeout(function(){
		markerClusterer.zoomOnClick_=true;},50);
	});
}

function clearClusters() {
	markerClusterer.clearMarkers();
}


// function GenerateMarker(weatherStation){
    // var image = {
      // url: "/DBSERVER/img/marker-large.png",
      // size: new google.maps.Size(24, 28),
      // scaledSize: new google.maps.Size(24, 28)
   // };
   
   // if(map.zoom < 5){
      // image.size = new google.maps.Size(16, 19);
	  // image.scaledSize = new google.maps.Size(16, 19);
	  // }
   
   // if(map.zoom < 4) {
      // image.size = new google.maps.Size(8, 9);
	  // image.scaledSize = new google.maps.Size(8, 9);
	  // }
   
   // if(map.zoom < 3) {
      // image.size = new google.maps.Size(4, 5);
	  // image.scaledSize = new google.maps.Size(4, 5);
	  // }
	// if(map.zoom < 2){
      // image.size = new google.maps.Size(2, 3);
	  // image.scaledSize = new google.maps.Size(2, 3);  
	  // }
    // marker = new google.maps.Marker({
	   // position : new google.maps.LatLng(weatherStation.Latitude, weatherStation.Longitude),
	   // map : map,
	   // visible : true,
	   // icon : image,
	   // zIndex : 10,
	   // info : '<div class="scrollfix"><b>' + weatherStation.StationName + '</b>'
										   // + '<br /><b>Elevation:</b> ' + weatherStation.Elevation_m + 'm'
										   // + '<br /><b>Data Density 1980-' + currentYear + ':</b> ' + (weatherStation.NOAAReadings / (((currentYear-1980)+1)*365.25) * 100).toFixed(1) + '%'
	   // });
	   // google.maps.event.addListener(marker, 'click', function() {infoWindow.setContent(this.info);infoWindow.open(map, this);});
	   // //google.maps.event.addListener(marker, 'mouseout', function() {infoWindow.setContent(this.info);infoWindow.close();});
      // return marker;
// }

