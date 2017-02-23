// BASEMAPS -----------------------------------------------------------------------

var satelite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>, <a href="http://cerigmaps.pe.hu">CerigMaps</a>',
    maxZoom: 18,
    id: 'mapbox.streets-satellite',
    accessToken: 'pk.eyJ1IjoiZmNlcmlnbm9uaSIsImEiOiIxZjEwMjYzZmVjN2Q0MmU4MTIzNDVhNzE2NjZjNTc1YyJ9.ZCTJBcGB2O7I5U96k74uSw'
});
var estradas = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>, <a href="http://cerigmaps.pe.hu">CerigMaps</a>',
    maxZoom: 18,
    id: 'mapbox.streets-basic',
    accessToken: 'pk.eyJ1IjoiZmNlcmlnbm9uaSIsImEiOiIxZjEwMjYzZmVjN2Q0MmU4MTIzNDVhNzE2NjZjNTc1YyJ9.ZCTJBcGB2O7I5U96k74uSw'
});

//--------------------------------------------------------------------------------
                            // MAPA GERAL

var map = L.map('map', {
    center: [-17.14, -48.49],
    zoom: 4,
    minZoom: 2,
    maxZoom: 17,
    layers: [satelite],
    fullscreenControl: true,
    fullscreenControlOptions: {
        position:'topleft'
    }
});


// BASE DE DADOS -----------------------------------------------------------------
                            // Florestal XXIII


// Função para gerar a cor
function getColor(a) {
    if (a == "Trabalhando") {
        return '#228B22';
    } else if (a == "Estágio") {
        return '#4292c6';
    } else if (a == "Estudando") {
        return '#fed976';
    } else {
        return '#e31a1c';
    }
}

// Função com o estilo dos pontos
function florestalStyle(feature) {
    return {
    radius: 8,
    fillColor: getColor(feature.properties.SITUACAO),
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
    }
}

// Função com as informações dos balões
function popupContent(feature) {
    if (feature.properties.SITUACAO == "Desempregado" || feature.properties.SITUACAO == "Estudando") {
        return          '<h1>'+feature.properties.APELIDO+'</h1>'+
                        '<span class="info">Turma: </span>' + feature.properties.TURMA+
                        '</br><span class="info">Nome: </span>'+feature.properties.NOME+
                        '</br><span class="info">E-mail: </span>'+feature.properties.EMAIL_PES +
                        '</br><b>------------------------</b>'+
                        '</br><span class="info">Situação: </span>'+feature.properties.SITUACAO;
    } else {
        return          '<h1>'+feature.properties.APELIDO+'</h1>'+
                        '<span class="info">Turma: </span>' + feature.properties.TURMA+
                        '</br><span class="info">Nome: </span>'+feature.properties.NOME+
                        '</br><span class="info">E-mail: </span>'+feature.properties.EMAIL_PES+
                        '</br><b>------------------------</b>'+
                        '</br><span class="info">Situação: </span>'+feature.properties.SITUACAO+
                        '</br><span class="info">Cargo: </span>'+feature.properties.CARGO+
                        '</br><span class="info">Empresa: </span>'+feature.properties.EMPRESA+
                        '</br><span class="info">E-mail: </span>'+feature.properties.EMAIL_COM ;
    }
}

var florestalLegend = L.control({position: 'bottomright'});

florestalLegend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'florestal-legend'),
    grades = ["Trabalhando","Estágio","Estudando","Desmpregado"],
    labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class="legend-icon" style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + '</br>';
}
    return div;
};

var xxiiiFlorestal = L.geoJSON(xxiii_florestal,{
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,florestalStyle(feature));
    },
    onEachFeature : function (feature,layer) {
        popupOptions = {maxWidth:300};
        layer.bindPopup(popupContent(feature),popupOptions);
     }
    }).addTo(map);

florestalLegend.addTo(map);

// CONTROLE DE CAMADAS -----------------------------------------------------------

var baseMaps = {
    "Satelite": satelite,
    "Estradas": estradas
};

var overlayMaps = {
    "XXIII Florestal" : xxiiiFlorestal
};

// INTERATIVIDADE ----------------------------------------------------------------

L.control.layers(baseMaps,overlayMaps,{collapsed:true}).setPosition('bottomleft').addTo(map);

map.on('overlayadd', function(eventLayer){
    if (eventLayer.name === 'XXIII Florestal'){
        map.addControl(florestalLegend);
    } 
});

map.on('overlayremove', function(eventLayer) {
    if (eventLayer.name === 'XXIII Florestal'){
        map.removeControl(florestalLegend);
    }
});
//--------------------------------------------------------------------------------


