const API = {
    base: 'http://127.0.0.1:8000/',
    distance: function (lat, lon, m, zoom) {
        fetch(`${this.base}tasks/api/v1/distance/?lat=${lat}&lon=${lon}&m=${m}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                makeMap(data, {"lon": lon, "lat": lat}, zoom, true)
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                document.getElementById('map').textContent = 'Error: ' + error.message;
            });
    },
    comuna: function(comuna) {
        fetch(`${this.base}tasks/api/v1/comuna/?comuna=${comuna}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                point = data[Math.floor(Math.random() * data.length)]
                makeMap(data, {"lon": point.longitud, "lat": point.latitud}, 14.75)
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                document.getElementById('map').textContent = 'Error: ' + error.message;
            });
    },
    category: function(category) {
        if (category != 'todos') {

            fetch(`${this.base}tasks/api/v1/category/?category=${category}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                makeMap(data, {"lon": -70.65383959939585, "lat": -33.44233935400292}, 12.5)
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                document.getElementById('map').textContent = 'Error: ' + error.message;
            });
        } else {
            makeMap([], {"lon": -70.65383959939585, "lat": -33.44233935400292}, 12.5)
        }
    }
}

const comunas = ["LO PRADO", "ESTACION CENTRAL", "SANTIAGO", "PROVIDENCIA", "LAS CONDES", "RECOLETA", "SAN MIGUEL", "LA CISTERNA", "SAN BERNARDO", "EL BOSQUE", "QUILICURA", "CONCHALI", "INDEPENDENCIA", "ÑUÑOA", "LA REINA", "MACUL", "LA FLORIDA", "PUENTE ALTO", "LA GRANJA", "SAN RAMON", "MAIPU", "PUDAHUEL", "QUINTA NORMAL", "CERRILLOS", "PEDRO AGUIRRE CERDA", "SAN JOAQUIN", "PEÑALOLEN", "LO ESPEJO", "RENCA", "LA PINTANA", "HUECHURABA", "PEÑALOLEN", "CERRO NAVIA", "VITACURA", "LO BARNECHEA", "ÑUÑOA", "PADRE HURTADO", "LAMPA", "TALAGANTE", "COLINA", "MELIPILLA", "BUIN", "PEÑAFLOR", "EL MONTE", "PAINE", "ISLA DE MAIPO", "CURACAVI", "CALERA DE TANGO"];

const selectComunas = document.getElementById('comunas');
comunas.forEach(comuna => {
    const option = document.createElement('option');
    option.text = comuna;
    selectComunas.add(option);
});

document.getElementById('my-address').addEventListener('click', function () {
    const addressInput = document.getElementById('address');
    if (this.checked) {
        addressInput.disabled = true;
    } else {
        addressInput.disabled = false;
    }
});

document.getElementById('comunas').addEventListener('change', function () {
    const buttonComunas = document.getElementById('button-comunas');
    buttonComunas.disabled = this.value === 'Seleccionar comuna';
});

document.getElementById('button-comunas').addEventListener('click', function () {
    if (this.disabled == false){
        API.comuna(document.getElementById('comunas').value)
    }
})

document.getElementById('search').addEventListener('click', function () {
    const addressInput = document.getElementById('address');
    const myAddress = document.getElementById('my-address');
    if (myAddress.checked) {
        navigator.geolocation.getCurrentPosition(position => {
            switch (parseInt(document.getElementById('floatingSelect').value)) {
                case 100:
                    zoom = 17
                    break
                case 200:
                    zoom = 16.25
                    break
                case 500:
                    zoom = 16
                    break
                case 1000:
                    zoom = 15.75
                    break
                case 2000:
                    zoom = 14.75
                    break
                case 3000:
                    zoom = 14.25
                    break
                case 5000:
                    zoom = 13.5
                    break
            }
            API.distance(position.coords.latitude, position.coords.longitude, document.getElementById('floatingSelect').value, zoom)
        })
    }
})

function popupContent(lat, lon) {
    return `
    <div style="text-align: center;">
    <h3 class="text-primary fw-bold fs-6">¿Quiéres buscar cerca de este lugar?</h3>
    <button type="button" id="close-pop-up" class="btn btn-primary" onclick="API.distance(${lat}, ${lon}, 1000, 15.75), aux_marker.marker.closePopup()">Buscar servicios</button>
    <button type="button" class="btn btn-outline-primary" onclick="positionalMarkerRemove()">Cancelar</button>
    </div>
    `;
}

function positionalMarkerRemove() {
    if (aux_marker.active) {
        aux_marker.active = false
        aux_marker.marker.remove()
    }
}
    

 // Función a ejecutar cuando se hace clic en el mapa
 function onMapClick(e) {
    if (!aux_marker.active) {
        aux_marker.marker = L.marker([e.latlng.lat, e.latlng.lng], {'icon': personIcon}).addTo(map)
        aux_marker.marker.bindPopup(popupContent(e.latlng.lat, e.latlng.lng)).openPopup()
        aux_marker.active = true
    } else {
        aux_marker.marker.remove()
        aux_marker.marker = L.marker([e.latlng.lat, e.latlng.lng], {'icon': personIcon}).addTo(map)
        aux_marker.marker.bindPopup(popupContent(e.latlng.lat, e.latlng.lng)).openPopup()
    }
}




// Añade el evento click al mapa
map.on('click', onMapClick);
