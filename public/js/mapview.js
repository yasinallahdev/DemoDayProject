const stationLat = document.querySelector("#stationLat");
const stationLng = document.querySelector("#stationLng");

function initMap() {

    //const stationPosition = {lat: parseFloat(stationLat.textContent), lng: parseFloat(stationLng.textContent)};
    const stationPosition = {lat: stationData.latitude, lng: stationData.longitude};

    const map = new google.maps.Map(document.querySelector('#map'), {
        center: stationPosition,
        zoom: 18
      });

    const marker = new google.maps.Marker({position: stationPosition, map: map});

}
