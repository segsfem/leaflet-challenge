var myMap = L.map("mapid", {
    center: [15.5994, -28.6731],
    zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

  // Store API query variables
  var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
 // Grab the data with d3
  d3.json(baseURL, function(data) {
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
    // set color for magnitude
    function getColor(magnitude) {
        switch (true) {
          case magnitude > 5:
            return "#ccff33";
          case magnitude > 4:
            return "#ffff33";
          case magnitude > 3:
            return "#ffcc33";
          case magnitude > 2:
            return "#ff9933";
          case magnitude > 1:
            return "#ff6633";
          default:
            return "#ff3333";
        }
      }
  
      function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 4;
      }
      // geojson layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
      }).addTo(myMap);
      var legend = L.control({
        position: "bottomright"
      });
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
          "#ff3333",
          "#ff6633",
          "#ff9933",
          "#ffcc33",
          "#ffff33",
          "#ccff33"
        ];

        // Loop through data
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" +grades[i + 1] + "<br>" : "+");
        }
        return div; 
    };

    //add legend to map
    legend.addTo(myMap);
});