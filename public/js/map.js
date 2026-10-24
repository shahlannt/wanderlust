mapboxgl.accessToken = mapToken;
 const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: Listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

// create a marker at a coordinate
const marker = new mapboxgl.Marker({
    color: "#fa424d",
})
.setLngLat(Listing.geometry.coordinates)
.addTo(map);


const popup = new mapboxgl.Popup()
  .setHTML(`<h4>${Listing.title}</h4><p>exact location will be provided after booking</p>`);


  marker.setPopup(popup);
