var directionsService = new google.maps.DirectionsService();
 
var directionsDisplay = new google.maps.DirectionsRenderer({
   draggable: true
});

var options = {
   zoom: 15,
   disableDefaultUI: true,
   mapTypeId: google.maps.MapTypeId.ROADMAP
};

var mapa = document.getElementById('mapa');
var btnFechar = document.getElementById('btnFechar');

$("form").submit(mostraMapa);

$('#btnFechar').click(function() {
   mapa.style.display = 'none';
   btnFechar.style.display = 'none';
});

function mostraMapa(event) {
   event.preventDefault();

   var enderecoPartida = $("#txtEnderecoPartida").val();
   var enderecoChegada = $("#txtEnderecoChegada").val();
 
   var request = { 
      origin: enderecoPartida, 
      destination: enderecoChegada, 
      travelMode: google.maps.TravelMode.WALKING
   };
 
   directionsService.route(request, tracaRota);
}   
   
function tracaRota(result, status) {
   mapa.style.display = 'block';
   btnFechar.style.display = 'block';
   
   map = new google.maps.Map(mapa, options);
   directionsDisplay.setMap(map);
   map.addListener('click', clicouMapa);
   
   if (status == google.maps.DirectionsStatus.OK) { 
      directionsDisplay.setDirections(result); 
   }
   
   $.get(SERVIDOR + '/ocorrencias', mostraAreaPerigo);
}

function mostraAreaPerigo(dados) {
   var pontos = eval(dados);
   var heatmapData = [];
   
   for (var i in pontos) {
      lat = pontos[i].loc[0];
      lng = pontos[i].loc[1];
      heatmapData.push({
         location: new google.maps.LatLng(lat, lng)
      });
   }
      
   var heatmap = new google.maps.visualization.HeatmapLayer({
     data: heatmapData
   });
   heatmap.set('radius', 40);
   heatmap.setMap(map);
   map.setZoom(15);
}

function clicouMapa(e) {
   $.get(SERVIDOR + '/perigo?lat=' + e.latLng.lat() + 
         '&lon=' + e.latLng.lng(),
         function(data) {
            console.log(data);
         }
   );
}
