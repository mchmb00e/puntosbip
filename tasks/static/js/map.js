console.log('Miguel Chamorro | +56 9 3337 2677 | miguelchamorro912@gmail.com')

var initialPosition = [-33.44233935400292, -70.65383959939585]
var map = L.map('map').setView(initialPosition, 12.5)
var markers = []
var allMarkersAux = []
var bipArray

var customIcon = L.icon({
    iconUrl: 'static/img/location.webp',
    iconSize: [38, 38],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
var personIcon = L.icon({
    iconUrl: 'static/img/person_red.webp',
    iconSize: [38, 38],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function openCard(point) {
    if (document.getElementById('card').classList.contains('opacity-0')) {
        if (point.entidad == "Fullcarga") {
            document.getElementById('card-nombre').innerHTML = "Centro <b>Bip!</b>"
        } else {
            document.getElementById('card-nombre').innerHTML = point.entidad
        }
            document.getElementById('card-horario').innerHTML = point.horario
            document.getElementById('card-direccion').innerHTML = point.direccion + ', ' + point.comuna + '.'
            funciones = point.funciones.split(", ")
            document.getElementById('card-funciones').innerHTML = ''
            for (let i = 0; i < funciones.length; i++) {
                document.getElementById('card-funciones').innerHTML += '<li class="list-group-item">' + funciones[i] + '</li>'
            }
            document.getElementById('card').classList.remove('opacity-0')
            document.getElementById('card').classList.add('animate__animated')
            document.getElementById('card').classList.add('animate__faster')
            document.getElementById('card').classList.add('animate__fadeInRight')
    } else {
        closeCard()
        setTimeout(() => {
            if (point.entidad == "Fullcarga") {
                document.getElementById('card-nombre').innerHTML = "Centro <b>Bip!</b>"
            } else {
                document.getElementById('card-nombre').innerHTML = point.entidad
            }
            document.getElementById('card-horario').innerHTML = point.horario
            document.getElementById('card-direccion').innerHTML = point.direccion + ', ' + point.comuna + '.'
            funciones = point.funciones.split(", ")
            document.getElementById('card-funciones').innerHTML = ''
            for (let i = 0; i < funciones.length; i++) {
                document.getElementById('card-funciones').innerHTML += '<li class="list-group-item">' + funciones[i] + '</li>'
            }
            document.getElementById('card').classList.remove('animate__animated')
            document.getElementById('card').classList.remove('animate__faster')
            document.getElementById('card').classList.remove('animate__fadeOutRight')
            document.getElementById('card').classList.remove('opacity-0')
            document.getElementById('card').classList.add('animate__animated')
            document.getElementById('card').classList.add('animate__faster')
            document.getElementById('card').classList.add('animate__fadeInRight')
        }, 600);
    }
}

function closeCard() {
    if (!document.getElementById('card').classList.contains('opacity-0')) {
        document.getElementById('card').classList.remove('animate__animated')
        document.getElementById('card').classList.remove('animate__faster')
        document.getElementById('card').classList.remove('animate__fadeInRight')
        document.getElementById('card').classList.add('animate__animated')
        document.getElementById('card').classList.add('animate__faster')
        document.getElementById('card').classList.add('animate__fadeOutRight')
        setTimeout(() => {
            document.getElementById('card').classList.add('opacity-0')
        }, 500);
    }
}

function removeMarkers() {
    if (markers.length != 0) {
        for (let i = 0; i < markers.length; i++) {
            markers[i].remove()
        }
    }
}

function makeMap(bip_array, location, zoom, person) {
    positionalMarkerRemove()
    removeMarkers()
    var marker
    bipArray = bip_array
    removeMarkers()
    map.flyTo([location.lat, location.lon], zoom)
    for (let i = 0; i < bip_array.length; i++) {
        marker = L.marker([bip_array[i].latitud, bip_array[i].longitud], {'icon': customIcon}).addTo(map);
        marker.on('click', function(e) {
            openCard(bip_array[i]);
        });
        markers.push(marker)
        // Añade un evento click al marcador
        marker.on('click', function(e) {
            L.DomEvent.stopPropagation(e);  // Detiene la propagación del evento para que no llegue al mapa
        });
    }
    if (person) {
        marker = L.marker([location.lat, location.lon], {'icon': personIcon}).addTo(map)
        marker.on('click', function(e) {
            L.DomEvent.stopPropagation(e);  // Detiene la propagación del evento para que no llegue al mapa
            console.log(marker)
        });
        markers.push(marker)
    }
}

var aux_marker = {
    'active': false,
    'marker': null
}
