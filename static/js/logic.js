var dataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


var myMap = L.map("map", {
    center:[15.5994, -28.6731],
    zoom: 4
  });

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

d3.json(dataUrl, function(response){
    console.log(response);
    var features = response.features;
    var quakeCoord = [];
    var quakeMag = [];

    for(var i =0; i < features.length; i++){
        var location = features[i].geometry;
        console.log(location);

        quakeCoord.push([location.coordinates[1], location.coordinates[0]]);
        var quakeMag = features[i].properties.mag;
        console.log(quakeMag);
        console.log(quakeCoord[i]);
        var color = ""
       if (quakeMag >= 5){
           color = "DarkRed";
       }
       else if (quakeMag >= 4){
           color = "red";
       }
       else if (quakeMag >= 3){
           color =  "orange";
       }
       else if (quakeMag >= 2){
            color = "yellow";
       }
       else if (quakeMag >= 1){
           color = "GreenYellow";
       }
       else{
           color = "LimeGreen"
       }
       
        L.circle(quakeCoord[i], {
            fillOpacity: 0.8,
            color: color,
            fillColor: color,
            radius: quakeMag * 50000
        }).bindPopup(`<h1>EarthQuake Magnitude</h1> <hr> <h3>${quakeMag} </h3>`).addTo(myMap);
    }
   var legend = L.control({ position: "bottomright"});
   legend.onAdd = function(){
    var div = L.DomUtil.create('div', 'info legend');
    ranges = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    colors = ["LimeGreen", "GreenYello", "yellow", "orange", "red", "DarkRed"];
    labels = [];
    ranges.forEach(function(ranges, i){
         labels.push("<li style=\"background-color: " + colors[i] + "\">"+ranges+"</li>");
        });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;
   };
legend.addTo(myMap);
});