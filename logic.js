let myMap = L.map("map", {
    center: [43, -108],
    zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function(data){
    console.log(data);

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return new L.circleMarker(latlng,{
                radius: feature.properties.mag**2,
                color: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: .5,
                weight: 1.5
            })
        },
        onEachFeature: function(feature,layer) {
            layer.bindPopup(
                `<h5>`+`Location : ${feature.properties.place}`+`<h5><hr>`+
                `<h5>`+`Magnitude : ${feature.properties.mag}`+`<h5><br>`+
                `<h5>`+`Depth : ${feature.geometry.coordinates[2]}`+`<h5>`
            );
        }
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = data.geometry.coordinates[2];
      let colors = depths.map(depth=>chooseColor(depth));
      let labels = [];
  
      // Add the minimum and maximum.
      let legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + depths[0] + "</div>" +
          "<div class=\"max\">" + depths[depths.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      depths.forEach(function(depths, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
});

function chooseColor(depth) 
{
  if (depth >= 90) {
    return "red";
  }
  else if (depth > 70) {
    return "orangered";
  }
  else if (depth > 50) {
    return "orange";
  }
  else if (depth > 30) {
    return "yellow";
  }
  else if (depth > 10) {
    return "lime";
  }
  else if (depth > -10) {
    return "green";
  }
  else {
    return "Black";
  }
}