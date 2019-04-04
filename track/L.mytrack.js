

L.Control.Watermark = L.Control.extend({
	options: {
	FlagButton: false,}, // задал свойство для определения функциональности кнопки запуска геолокации 

	//блок кнопок
  onAdd: function(map) {
	  
    var imgAll = L.DomUtil.create('div', 'leaflet-control-filelayer leaflet-control-zoom leaflet-bar'); // добавил класс из линейки rul
	
			//Кнопка запуска геолокации маркера
    this.startStropButton = L.DomUtil.create('a', 'leaflet-control-filelayer leaflet-control-zoom-in leaflet-bar-part', imgAll); // добавил класс из линейки rul
    this.startStropButton.title = 'Показать геолокацию и записать трек';
	this.startStropButton.innerHTML = '<img class="icon" src="track/crosshair.svg" alt="Load track from file"/>';
    this.startStropButton.href = '#';
//	this.startStropButton.classList.add('polyline-measure-clearControl1'); // добавил класс из линейки rul
    L.DomEvent.on(this.startStropButton, 'click', this._startStop, this);
	L.DomEvent.disableClickPropagation(this.startStropButton);
	
	
	    //Кнопка сохранения трека
    this.saveButton = L.DomUtil.create('a', 'leaflet-control-filelayer leaflet-control-zoom-in leaflet-bar-part', imgAll); // добавил класс из линейки rul		
    this.saveButton.innerHTML = "<a download='mytrack.json'/><img style='pointer-events: none;' class='icon' src='track/search.svg'/></a>";  //style='pointer-events: none;'  - чтобы href на реагировал на картинку, только на download
    this.saveButton.title = 'Сохранить трек (GeoJSON)';
//  this.saveButton.classList.add('polyline-measure-clearControl1');  //Добавил вспыхнивание кнопки при нажатии из css линейки (rul/Leaflet.PolylineMeasure). В css было -  a.polyline-measure-clearControl:active {background-color: #f88;}
    L.DomEvent.on(this.saveButton, 'click', this._download, this); //_download
    L.DomEvent.disableClickPropagation(this.saveButton);


		//Кнопка очистки (вместо this.clearButton описал конкретную var clearButton, чтобы сработала вспыхивание clearButton.classList.add('polyline-measure-clearControl')
    var clearButton = L.DomUtil.create('a', 'leaflet-bar-part', imgAll); // 'leaflet-bar-part' для сохранения единого размера крестика на всех кнопках		
    clearButton.title = 'Очистить трек';
    var userIcon2 = L.DomUtil.create('img' , 'img-responsive' , this.clearButton);
    clearButton.innerHTML = '<b><font size="4">&times;</font></b>';
    clearButton.href = '#';
	clearButton.classList.add('polyline-measure-clearControl');  //Добавил вспыхнивание кнопки при нажатии из css линейки (rul/Leaflet.PolylineMeasure). В css было -  a.polyline-measure-clearControl:active {background-color: #f88;}
    L.DomEvent.on(clearButton, 'click', this._clearTrack, this);
	L.DomEvent.disableClickPropagation(clearButton);

    return imgAll;
  },
  
  
    // переключатель кнопки старт/стоп геолокации и отсылка к соответствующим функциям
  _startStop: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
	  if ( this.options.FlagButton === false) {
		  this.options.FlagButton = true; //замена значения свойства для идентификации состояния кнопки запуска геолокации (положение "Включено"
		  this.startStropButton.style.backgroundColor = "lightgreen"; //замена фона кнопки геолокации на зеленый
		  this.startStropButton.title = 'Остановить запись трека'; 
          startGeolocation( this._map ) // отсылка к исполняемой функции за пределами L.Control.Watermark
	    } else { 
			this.options.FlagButton = false; //замена значения свойства для идентификации состояния кнопки запуска геолокации (положение "Выключено"
			this.startStropButton.title = 'Показать геолокацию и записать трек';
			this.startStropButton.style.backgroundColor = "white"; //замена фона кнопки геолокации на белый
			stopGeolocation( this._map ) // отсылка к исполняемой функции за пределами L.Control.Watermark
		};
    },
    
      // функция сохранения трека  
  _download: function(ev) {var tmp=this._map._layers  //mytrack.gpx //must be named mytrack!  
  	  for (var layer in tmp) {if (tmp[layer].gpx) {tmp=tmp[layer].gpx; break}} // перебирает все объекты _layers карты от низких номеров к высоким, находя свойства, указанные при создании - "type":"Feature","geometry": tmp
      //tmp = {"type": "FeatureCollection","features": [{"type":"Feature","geometry": tmp }]}
      if ('msSaveOrOpenBlob' in navigator) navigator.msSaveOrOpenBlob(new Blob([JSON.stringify(tmp)]), "mytrack.json"); //L.mytrack? // поддержка устаревшего свойства msSaveOrOpenBlob объекта navigator (оно предлагает на выбор пользователю или открыть файл в соответствующей программе, либо сохранить на диск)
      else ev.target.href = "data:application/geo+json," + JSON.stringify(tmp)  //встраивает запись "data:application/geo+json," + JSON.stringify(tmp) в строку HTML. из которой пришло событие (click)
    },
		
		// функция очистки
    _clearTrack: function (e) {
	   myTrackLayer.clearLayers(); //очищаю нарисованный слой
	   daneCoord.length = 0; //очистка массива L.Mytrack.gpx.coordinates с координатами прежнего трека, чтобы при новом запуске геолокации не добавлялся прежний трек
	},
	
    //, onRemove: function(map) { }   // Nothing to do here
});
   // запуск геолокации
startGeolocation = function (selectedMap) {
    selectedMap.locate({ //определение геолокации, запускает locationfound событие в случае успеха
	  watch: true,  // watch:true - непрерывный просмотр изменений местоположения
      enableHighAccuracy: true
	}); 
 	
};
   //прекращение геолокации
stopGeolocation = function (selectedMap) { 
    selectedMap.stopLocate(); //остановить определение геолокации и непрерывный просмотр изменений местоположения
};



daneCoord = [] // //объявляю глобальную переменную, чтобы из L.Control.Watermark управлять очисткой массива L.Mytrack.gpx.coordinates 
myTrackLayer = [] //объявляю глобальную переменную, чтобы слой можно было очистить из L.Control.Watermark

L.Mytrack = L.Layer.extend({
    options: {   //click or locationfound
      click: false,
      elevation: false, 
    }, 
    lng0: 0, //prevent duplikates
    gpx: {
      "type": "LineString",
      "coordinates": []
    },
    initialize: function(options) {
      L.setOptions(this, options);
    },
    onAdd: function(map) {
        myTrackLayer = L.geoJSON(this.gpx.coordinates, {
            style: {
                color: 'royalblue', //цвет отображаемого трека
                weight: 5, //тощина отображаемого трека (для компа 3, для мобилиы 5)
            }
		}).addTo(map); 
	  map.on(this.options.click ? 'click' : 'locationfound', this._onclick, this);
    },
  
  //  добваляет на слой массив координат (coordinates) объекта gpx с новой последней точкой
    _onclick: function(e) {
        if (e.latlng.lng != this.lng0) {
          this.lng0 = e.latlng.lng;
	      daneCoord = this.gpx.coordinates;
	      this.gpx.coordinates.push(this.options.elevation &&e.altitude?[e.latlng.lng, e.latlng.lat, e.altitude]:[e.latlng.lng, e.latlng.lat]); // в конец массива gpx добавляется новый latlng с думя значениями координат
  	      myTrackLayer.clearLayers(); // очищается слой myTrackLayer
	      myTrackLayer.addData(this.gpx);  // по новой на слой myTrackLayer добавляется дополненный массив coordinates объекта gpx
	      this._map.panTo([e.latlng.lat, e.latlng.lng]) //центр карты позиционируется на место геолокации
          this._map.attributionControl.setPrefix(Math.round(e.speed*3.6)+" km/h")
        }
    },
});

L.mytrack = function(options) {return new L.Mytrack(options);}; //L.mytrack = new L.Mytrack();



L.control.watermark = function(opts) {
  return new L.Control.Watermark(opts);
}


