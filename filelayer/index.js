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
	    var layer3 = new L.layerGroup();
 
	    //4 layer
	    var layer4 = new L.layerGroup();
		
		//5 layer
	    var layer5 = new L.layerGroup();
		
		
	
	    //MAP
	    var map = L.map('map', {
	      center: [51.480640, 46.074074],
	      zoom: 14,
		  maxZoom: 22,
		  zoomControl: true,
	      layers: [OSM, layer1, layer3, layer4, layer5] //слои, отображаемые по умолчанию
	    });

	    //BaseLayer
	    var Map_BaseLayer = {
	      "OSM": OSM
	    };
 
	    //AddLayer
	    var Map_AddLayer = {
	      "Схема": layer1,
	      "Рельеф и старые дороги": layer2,
	      "Объекты": layer3,
	      "Экологическая тропа": layer4,
		  "Аллеи": layer5,
		  
	    };
		 
	    //LayerControl
	    L.control.layers(
	      Map_BaseLayer, 
	      Map_AddLayer, {
	         collapsed: true
	        }
	    ).addTo(map);
		
	//	map.removeLayer(layer5); // удаляется слой аллей, т.к. при первом показе карты при старте на zoom 14 он не должен быть виден
 
	    //OpacityControl
	    L.control.opacity(
	        Map_AddLayer, {
	/*    label: "Прозрачность", */
	          collapsed: true
	        }
	    ).addTo(map);

//Начало полилиний аллей 

		//Забивание данных в массив
		var alleyPoints = [
			[
				[
					[
						[51.47932, 46.08307],
						[51.47881, 46.08330],
						[51.47837, 46.08348]
					]
				], 'Аллея вдоль Става', 'Purple', // 'название аллеи', 'цвет'
			],
			[
				[
					[
						[51.48132, 46.07507],
						[51.48236, 46.07545],
						[51.48345, 46.07576]	
					] 
				], 'Березовая аллея', 'DarkTurquoise', // 'название аллеи', 'цвет'
			]
			
		];

		//Вывод всех полилиний аллей на слой layer5
		var alleyGroup = new L.FeatureGroup();
		
        for (var i = 0; i < alleyPoints.length; i++){

			var alleyLines = new L.polyline(alleyPoints[i][0][0], { //параметры полилинии (параметры текста всплвающего окна общия для leaflet, изменены в filelayer/style.css)
				color: alleyPoints[i][2],
				smoothFactor: 1.0,
				weight: 2,
				opacity: 0.4
			}).bindPopup(alleyPoints[i][1]);
			
			alleyGroup.addLayer(alleyLines);
		};

		alleyGroup.addTo(layer5);

//Конец полилиний аллей

//Начало полигонов территорий
		//Забивание данных в массив
		var poligPoints = [
			[
				[
					[
						[51.47417, 46.07367],
						[51.47431, 46.07409],
						[51.47417, 46.07484],
						[51.47399, 46.07532],
						[51.47363, 46.07561],
						[51.47332, 46.07555],
						[51.47302, 46.07475],
						[51.47379, 46.07384]
					]
				], 'Лягушачий полуостров', 'OrangeRed', 0.3, 0.2,// 'название полигона', 'цвет', 'прозрачность периметра', 'прозрачность заливки'
			],
			[
				[
					[
						[51.46417, 46.08367],
						[51.46431, 46.08409],
						[51.46417, 46.08484],
						[51.46399, 46.08532],
						[51.46363, 46.08561],
						[51.46332, 46.08555],
						[51.46302, 46.08475],
						[51.46379, 46.08384]	
					] 
				], 'Пример', 'blue', 0.9, 0.0,// 'название полигона', 'цвет', 'прозрачность периметра', 'прозрачность заливки'
			]
			
		];

		//Вывод всех полигонов на слой layer3
		var poligonGroup = new L.FeatureGroup();
		
        for (var i = 0; i < poligPoints.length; i++){

			var poligRegions = new L.polygon(poligPoints[i][0][0], { //параметры полиuгонов (параметры текста всплвающего окна общия для leaflet, изменены в filelayer/style.css)
				color: poligPoints[i][2],
				smoothFactor: 1.0,
				weight: 1,
				opacity: poligPoints[i][3],
				fillOpacity: poligPoints[i][4],
			}).bindPopup(poligPoints[i][1]);
			
			poligonGroup.addLayer(poligRegions);
		};
		
		poligonGroup.addTo(layer3);

//Конец полигонов территорий

//Начало полилинии экотропы
		//Забивание данных в массив
        var ekoPoints = [
			[
				[51.480170, 46.07246],
				[51.480640, 46.074074],
				[51.480663, 46.074049],
				[51.480440, 46.074474],
				[51.480140, 46.074874]
			],
			[
				[51.48109, 46.07705],
				[51.48027, 46.07394],
				[51.48013, 46.07488]
			],
		];           
		//выведение полилинни на слой 4
        var ekoSteshka = new L.polyline(ekoPoints, { //параметры полилинии (параметры текста всплвающего окна общие для leaflet, изменены в filelayer/style.css .leaflet-popup-content)
			color: 'green',
			smoothFactor: 1.0,
			weight: 2,  //толщина полтлтнтт при первой загрузке карты
			opacity: 1.0,
		}).bindPopup('Экотропа').addTo(layer4); 

		//Смена цвета при наведении мыши
		ekoSteshka.on('mouseover', function() {
			this.setStyle({
			color: 'yellow' //or whatever style you wish to use;
			});
		});
		//Смена цвета при убирании мыши
		ekoSteshka.on('mouseout', function() {
		    this.setStyle({
		    color: 'green' //or whatever style you wish to use;
		    });
		});
		
		ekoSteshka.on('mouseover', function() {
			this.setStyle({
			color: 'yellow' //or whatever style you wish to use;
			});
		});
//Конец полилинии экотропы

//управление толщиной полилиний экотропы и показом слоев в зависимости от масштаба карты
		
		map.on('zoom', function() {
			if (map.getZoom() < 17) {
				ekoSteshka.setStyle({ weight: 6 });
				alleyGroup.setStyle({ weight: 6 });
			}	else {
				ekoSteshka.setStyle({ weight: 10 }); ////установить толщину экотропы и аллей 10px на масштабе больше 15
				alleyGroup.setStyle({ weight: 10 });
			}
				
				if (map.getZoom() < 16) {
				ekoSteshka.setStyle({ weight: 3 }); //установить толщину экотропы и аллей 3px на масштабе меньше 16
				alleyGroup.setStyle({ weight: 3 });
				}
				if (map.getZoom() < 15) {
					ekoSteshka.setStyle({ weight: 2 }); //установить толщину экотропы и аллей 2px на масштабе меньше 14
					alleyGroup.setStyle({ weight: 2 });
				}
				if (map.getZoom() < 14) {
					layer4.removeLayer(iconMarkerGroup); //убрать маркеры на масштабе меньше 14
				} else {
						layer4.addLayer(iconMarkerGroup);// показать маркеры  на масштабе больше 13
					} 
				if (map.getZoom() < 13) {
					ekoSteshka.setStyle({ weight: 1 }); //установить толщину экотропы и аллей 1px на масштабе меньше 12
					alleyGroup.setStyle({ weight: 1 });
					map.removeLayer(layer5);  //убрать аллеи на масштабе меньше 13
				} else {
						map.addLayer(layer5); //показать аллеи на масштабе больше 12
					} 
				if (map.getZoom() < 11) {
					map.removeLayer(layer3); //убрать экотропу и полигоны на масштабе меньше 11
					map.removeLayer(layer4);
			    } else {
						map.addLayer(layer3);// показать экотропу и полигоны на масштабе больше 10
						map.addLayer(layer4);
					} 
		});

//Начало маркеров-картинок со всплывающими окнами

	   //Заготовки HTML кода для надписей всплывающих блоков маркеров (стили взяты из заброски GPX на карту filelayer/style.css)
		var fraze1 = "<div class='poup-marker-params'><p class='poup-marker-header'>";
		var fraze2 = "</p><p style='text-align: center;'><img src='";
		var fraze3 = "' width='640' /></p><div class='poup-marker-text'>";
		var fraze4 = "</div></div>";
		
		 //Забивание данных в массив
	    var IconPhoto = [
          [51.48182, 46.07457, "Первый маркер", "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. </p><p style='text-align: center;'><img src='https://pp.userapi.com/wFVP8zXJSFP58lDgjxRMFYgMsgSWY-RmcEU79w/PY417aNd4zQ.jpg' width='640'/></p><p>Donec nec justo eget felis facilisis fermentum.</p>"],
          [51.48185, 46.07465, "Второй маркер", "<div style='overflow:auto; width: 660px; height:500px;'><p>Привет!</p><p style='text-align: center;'><img src='mark/img/01.jpg' width='640' /></p><p>Привет!</p><p>Привет!</p><p>Привет!</p><p>Привет!</p><p>Привет!</p></div>"],
		  [51.48520, 46.06576, "Третий маркер", fraze1+'Привет!'+fraze2+'https://pp.userapi.com/lzx8JyQ3gR7aEnqMDAWxqShCNY5r9Aoim3m5lg/MQOH29jZenU.jpg'+fraze3+'<p>Привет!</p><p>Привет! Мое содержимое было немного более разнообразным, чем просто простое изображение, но ширина, конечно же, все еще зависела от времени загрузки изображений в контенте (и было нормально, когда изображение было в кеше браузера).</p><p>Привет!</p><p>Привет!</p><p>Привет!</p>'+fraze4],
		  [51.48528, 46.06582, "Четвертый маркер", fraze1+'Заголовок'+fraze2+'https://pp.userapi.com/c629420/v629420958/4f71/aoNRnMuHI9g.jpg'+fraze3+'<p>Привет!</p><p>Привет! Мое содержимое было немного более разнообразным, чем просто простое изображение, но ширина, конечно же, все еще зависела от времени загрузки изображений в контенте (и было нормально, когда изображение было в кеше браузера).</p><p>Привет!</p><p>Привет!</p><p>Привет!</p>'+fraze4],
		  [51.480640, 46.074074, "Пятый маркер", fraze1+'Пятый маркер'+fraze2+'https://pp.userapi.com/c623318/v623318958/76cb/o8oYiYn675I.jpg'+fraze3+'<p>Привет!</p><p>Привет! Мое содержимое было немного более разнообразным, чем просто простое изображение, но ширина, конечно же, все еще зависела от времени загрузки изображений в контенте (и было нормально, когда изображение было в кеше браузера).</p><p>Привет!</p><p>Привет!</p><p>Привет!</p>'+fraze4],
        ];
		
		//Вывод маркеров на слой layer4
//		var iconMarkerGroup = new L.FeatureGroup(); //для простого вывода маркеров
		var iconMarkerGroup = L.markerClusterGroup();  // для кластеризации маркеров
		
        for (var i = 0; i < IconPhoto.length; i++){
                  
		    var IconImg = L.icon({
    			iconUrl: 'mark/icon/'+i+'.png',
    			iconSize: [40, 40],
    			iconAnchor: [12, 0],
				popupAnchor: [0, 250],  //позиция всплывающего сообщения относительно центра карты
    		//	shadowUrl: 'mark/shadow.png', //отключить в случае стандарных иконок
    		//	shadowSize: [40, 40],
    		//	shadowAnchor: [2, 2]
			});
			
			var marker = new L.Marker([IconPhoto[i][0],IconPhoto[i][1]], {icon:IconImg, title:IconPhoto[i][2], riseOnHover:true}).bindPopup(L.popup({minWidth:660, maxWidth:660}).setContent(IconPhoto[i][3])); //для маркеров-фотографий, сколько маркеров - столько иконок
			iconMarkerGroup.addLayer(marker);	
		};

		iconMarkerGroup.addTo(layer4);  
		
	//  iconMarkerGroup.addLayer(L.marker(getRandomLatLng(layer4)));   //с этим чего-то не работает ничего, кроме кластеров

//Конец маркеров-картинок со всплывающими окнами
		
//Начало блока определения геолокации и рисования трека

	    L.control.watermark({
		  position: 'topleft'
	    }).addTo(map);  //download-track-from-map-to-source-button

	    var url=location.search.slice(1); //возвращает информацию о расположении текущей веб-страницы: URL, информацию о сервере, номер порта, протокол. search - Если строка запроса содержит знак вопроса (?), возвращает ту часть строки, которая идет после знака вопроса. 
							            //В даннном случае второй элемент массива
	    var mytrack=L.mytrack({
		  click:url==1?true:false, elevation:true //если url=1, свойство click определяется как true и функция, присвоенная переменной L.mytrack запускается с этими параметрами (1 означает записывать трек)
	    }).addTo(map);  //{click:false}  //querstringparameter ?1 draw track  //must be named mytrack!

//Конец блока определения геолокации и рисования трека

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

//Начало блока отображения загружаемого трека GPX и ему подобных

	    //Стиль трека 
        var style = {
          color: 'red', //// цвет отображемого загруженного трека 
          opacity: 1.0,
          fillOpacity: 1.0,
          weight: 3, // тощина отображемого загруженного трека (для компа - 3, для мобилы - 5)
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

//Подключение крестика в центре с координатами
	    L.control.mapCenterCoord().addTo(map);

    }

    window.addEventListener('load', function () {
        initMap();
		
	});

}(window));

