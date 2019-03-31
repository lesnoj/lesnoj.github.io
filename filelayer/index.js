(function (window) {
    'use strict';

    function initMap() {
      var control;
      var L = window.L;

	    //OSM layer
	    var OSM = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	      maxNativeZoom: 18,
	      maxZoom: 22
	    });
 
 
	    //1 layer
	    var layer1 = new L.tileLayer('http://poloniasaratow.ucoz.org/{z}/{x}/{y}.jpg', {
	      minZoom: 10,
	     // minNativeZoom: 14,
	      maxNativeZoom: 18,
	      maxZoom: 22
	    });
 
	    //2 layer
	    var layer2 = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
	      attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>рапр</a>",
	    });
 
	    //3 layer
	    var layer3 = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
	      attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>кенке</a>",
	    });

 
	    //4 layer
	    var layer4 = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
	      attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>кенке</a>",
	    });

	    //MAP
	    var map = L.map('map', {
	      center: [51.480640, 46.074074],
	      zoom: 14,
		  maxZoom: 22,
		  zoomControl: true,
	      layers: [OSM, layer1]
	    });

//Начало маркеров-картинок со всплывающими окнами

	    //Забивание данных в массив
	    var IconPhoto = [
          [51.480640, 46.074074, "Первый маркер", "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. </p><img src='img/00.jpg' /><p>Donec nec justo eget felis facilisis fermentum.</p>"],
          [51.480643, 46.074079, "Второй маркер", "<p>Привет!</p><img src='img/01.jpg' />"],
        ];



		//Вывод маркеров на карту
        for (var i = 0; i < IconPhoto.length; i++){
                  
		    var IconPhoto1 = L.icon({
    			iconUrl: 'mark/'+i+'.png',
    			iconSize: [30, 22],
    			iconAnchor: [0, 0],
				popupAnchor: [0, 250],
    			shadowUrl: 'mark/shadow.png',
    			shadowSize: [34, 26],
    			shadowAnchor: [2, 2]
			});

			var marker = new L.Marker([IconPhoto[i][0],IconPhoto[i][1]], {icon:IconPhoto1, title:IconPhoto[i][2], riseOnHover:true}).bindPopup(L.popup({minWidth:680, maxWidth:680, maxHeight:500}).setContent(IconPhoto[i][3])).addTo(map);
        }

//Конец маркеров-картинок со всплывающими окнами


	    //Подключение крестика в центре с координатами
	    L.control.mapCenterCoord().addTo(map);

//Начало подключения измерительной линейки
        L.control.scale ({
          maxWidth: 240,
	      metric: true,
	      imperial: false,
	      position: 'bottomleft'
	    }).addTo (map);

        L.control.polylineMeasure ({
	      position: 'topleft',
	      unit: 'metres',
	      showBearings: false,
	      clearMeasurementsOnStop: false,
	      showClearControl: true,
	      showUnitControl: false
	    }).addTo (map);

//Конец подключения измерительной линейки

	    //BaseLayer
	    var Map_BaseLayer = {
	      "OSM": OSM
	    };
 
	    //AddLayer
	    var Map_AddLayer = {
	      "1": layer1,
	      "2": layer2,
	      "3": layer3,
	      "4": layer4
	    };
 
	    //LayerControl
	    L.control.layers(
	      Map_BaseLayer, 
	      Map_AddLayer, {
	         collapsed: true
	        }
	    ).addTo(map);
 
	    //OpacityControl
	    L.control.opacity(
	        Map_AddLayer, {
	/*    label: "Прозрачность", */
	          collapsed: true
	        }
	    ).addTo(map);


//Начало блока отображения загружаемого трека GPX и ему подобных

	    //Стиль трека 
        var style = {
          color: 'red',
          opacity: 1.0,
          fillOpacity: 1.0,
          weight: 3,
          clickable: false
        };
	
	    //Кнопка загрузки
        L.Control.FileLayerLoad.LABEL = '<img class="icon" src="filelayer/upload.svg" alt="Load track from file"/>';

        control = L.Control.fileLayerLoad({
            fitBounds: true,
            layerOptions: {
                style: style,
                pointToLayer: function (data, latlng) {
                  return L.circleMarker( latlng, { style: style });
                }
            }
        });

        control.addTo(map);
        control.loader.on('data:loaded', function (e) {
          var layer = e.layer;
          console.log(layer);
        });

//Конец блока отображения загружаемого трека GPX и ему подобных

//Начало блока определения геолокации и рисования трека

	    L.control.watermark({
		  position: 'topleft'
	    }).addTo(map);  //download-track-from-map-to-source-button

	    var url=location.search.slice(1) //возвращает информацию о расположении текущей веб-страницы: URL, информацию о сервере, номер порта, протокол. search - Если строка запроса содержит знак вопроса (?), возвращает ту часть строки, которая идет после знака вопроса. 
							            //В даннном случае второй элемент массива
	    var mytrack=L.mytrack({
		  click:url==1?true:false, elevation:true //если url=1, свойство click определяется как true и функция, присвоенная переменной L.mytrack запускается с этими параметрами (1 означает записывать трек)
	    }).addTo(map)  //{click:false}  //querstringparameter ?1 draw track  //must be named mytrack!

//Конец блока определения геолокации и рисования трека

    }

    window.addEventListener('load', function () {
        initMap();
    });
}(window));
