const srcLat = parseFloat(document.querySelector("#srcLat").textContent);
const srcLng = parseFloat(document.querySelector("#srcLng").textContent);
const destLat = parseFloat(document.querySelector("#destLat").textContent);
const destLng = parseFloat(document.querySelector("#destLng").textContent);

function initMap() {

    const map = new google.maps.Map(document.querySelector('#map'), {
        center: determineMidpoint()
      });

    fetch(`/directionPolyline?srcLat=${srcLat}&srcLng=${srcLng}&destLat=${destLat}&destLng=${destLng}`)
      .then(res => res.json())
      .then(response => {
        
        const sourceLocation = new google.maps.LatLng({lat: srcLat, lng: srcLng});
        const destLocation = new google.maps.LatLng({lat: destLat, lng: destLng});

        var markerBounds = new google.maps.LatLngBounds();

        const sourceMarkerLabel = document.querySelector("#sourceStation").textContent; //new google.maps.MarkerLabel({color: "#0000ff", text: document.querySelector("#sourceStation").textContent})
        const destinationMarkerLabel = document.querySelector("#destStation").textContent; //new google.maps.MarkerLabel({color: "#0000ff", text: document.querySelector("#destStation").textContent})

        const sourceMarker = new google.maps.Marker({position: sourceLocation, label: sourceMarkerLabel, map: map});
        const destMarker = new google.maps.Marker({position: destLocation, label: destinationMarkerLabel, map: map})
        
        console.table(response);
        console.log(response);

        for(let i = 0; i < response.length; i++) {
            new google.maps.Polyline({map: map, path: google.maps.geometry.encoding.decodePath(response[i])});
        }

        markerBounds.extend(sourceLocation);
        markerBounds.extend(destLocation);
        map.fitBounds(markerBounds);
      });

}

function determineMidpoint() {
   let midPoint = {lat: 0, lng: 0};

   const dLon = degreesToRadians(destLng - srcLng);
   const Bx = Math.cos(degreesToRadians(destLat)) * Math.cos(dLon);
   const By = Math.cos(degreesToRadians(destLat)) * Math.sin(dLon);

   midPoint.lat = radiansToDegrees(Math.atan2(
                Math.sin(degreesToRadians(srcLat)) + Math.sin(degreesToRadians(destLat)),
                Math.sqrt(
                    (Math.cos(degreesToRadians(srcLat)) + Bx) *
                    (Math.cos(degreesToRadians(srcLat)) + Bx) + By * By)));

   midPoint.lng = srcLng + radiansToDegrees(Math.atan2(By, Math.cos(degreesToRadians(srcLat)) + Bx));

   return midPoint;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI/180);
}

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI)
}
