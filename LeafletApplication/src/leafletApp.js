var mymap = L.map('mapid').setView([22, 77], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>' +
		' Aaditya Mankar, AgainstTheCurrent',
	id: 'mapbox/dark-v10'
}).addTo(mymap);

var layerControl = L.control.layers();
layerControl.addTo(mymap);

mymap.pm.addControls({
  position: 'topleft',
  drawCircle: true,
});

L.control.fullscreen({
  position: 'topright', // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
  title: 'Enter Fullscreen mode.', // change the title of the button, default Full Screen
  titleCancel: 'Exit fullscreen mode.', // change the title of the button when fullscreen is on, default Exit Full Screen
  content: null, // change the content of the button, can be HTML, default null
  forceSeparateButton: true, // force seperate button to detach from zoom buttons, default false
  forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
  fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
}).addTo(mymap);


L.control.mouseCoordinate({gpsLong: true, gps: true}).addTo(mymap);

let polylineMeasure = L.control.polylineMeasure ({position:'topleft', unit:'nauticalmiles', showBearings:true, clearMeasurementsOnStop: false, showClearControl: true, showUnitControl: true}, {tempLine: { color: '#0A0', weight: '2'}});
polylineMeasure.addTo (mymap), {fixedLine: {color: '#A00'}};

function debugevent(e) { console.debug(e.type, e, polylineMeasure._currentLine) }

mymap.on('polylinemeasure:toggle', debugevent);
mymap.on('polylinemeasure:start', debugevent);
mymap.on('polylinemeasure:resume', debugevent);
mymap.on('polylinemeasure:finish', debugevent);
mymap.on('polylinemeasure:clear', debugevent);
mymap.on('polylinemeasure:add', debugevent);
mymap.on('polylinemeasure:insert', debugevent);
mymap.on('polylinemeasure:move', debugevent);
mymap.on('polylinemeasure:remove', debugevent);

function addCircle(lat, lon, radiusOfCircle = 5000) {
	var circle = L.circle([lat, lon], {
	    color: '#110',
			stroke: 1,
	    fillColor: '#111',
	    fillOpacity: 0.4,
	    radius: radiusOfCircle
	}).addTo(mymap);
}

var html = "<div><b>Resizable Control</h5></b><p>A resizable window to add stuff on. Can be used for base inputs.</p>";


var resizabletopright = new L.ResizableControl({
    position: 'topright',
    minimizedHeight: 60,
    minimizedWidth: 0.1,
    enlargedHeight: 0.65,
    enlargedWidth: 0.1945,
    enlargeCallback: function(e) {},
    minimizeCallback: function(e) {},
    contentClassName: "resizable-control-content",
    scrollPaneClassName: "resizable-control-scrollpane",
    className: "resizable-control-container",
    jscrollpane: true,
    appendOnAdd: function(divElement) {}
});
mymap.addControl(resizabletopright);
resizabletopright.setContent(html);

// WindJSLeaflet.init({
// 		localMode: true,
// 		map: mymap,
// 		layerControl:  layerControl,
// 		useNearest: false,
// 	    timeISO: null,
// 	    nearestDaysLimit: 7,
// 	    displayValues: true,
// 	    displayOptions: {
// 	        displayPosition: 'bottomleft',
// 	        displayEmptyString: 'No wind data'
// 	    },
// 	    overlayName: 'Wind current',
// 	    pingUrl: 'http://144.6.233.100:7000/alive/',
// 	    latestUrl: 'http://144.6.233.100:7000/latest/',
// 	    nearestUrl: 'http://144.6.233.100:7000/nearest/',
// });

$.getJSON('demo.json', function (data) {

	var velocityLayer = L.velocityLayer({
		displayValues: true,
		displayOptions: {
			velocityType: 'Global Wind',
			displayPosition: 'bottomleft',
			displayEmptyString: 'No wind data',
			speedUnit: 'nm',
		},
		data: data,
		maxVelocity: 18,
		minVelocity: 0,

	});

	layerControl.addOverlay(velocityLayer, 'Wind - Global');
});
