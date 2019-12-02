const map = document.querySelector('#map');
const stationLat = document.querySelector("#stationLat");
const stationLng = document.querySelector("#stationLng");

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(stationLat.textContent), lng: parseFloat(stationLng.textContent)},
        zoom: 18
      });

}
