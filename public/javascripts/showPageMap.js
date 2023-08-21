mapboxgl.accessToken = 'pk.eyJ1IjoicG50MjE2IiwiYSI6ImNsZWFveGxwNzExaGMzbmx1NWo2eWp4OXAifQ.R5njvS56y7lqdRX6WmJSww';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${phorestaurant.title}</h3><p>${phorestaurant.location}</p>`
            )
    )
    .addTo(map)