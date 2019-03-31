FlagButton = 0; // задал переменную для определения функциональности кнопки запуска геолокации 	  

L.Control.Watermark = L.Control.extend({ //download-button
  onAdd: function(map) {
	var FlagButton = 0; // задал переменную для определения функциональности кнопки запуска геолокации 	  
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
	  if ( FlagButton === 0) {
		  FlagButton = 1; //замена переменной для идентификации состояния кнопки запуска геолокации (положение "Включено"
		  this.startStropButton.style.backgroundColor = "lightgreen"; //замена фона кнопки геолокации на зеленый
		  this.startStropButton.title = 'Остановить запись трека';
          startGeolocation( this._map ) // отсылка к исполняемой функции за пределами L.Control.Watermark
	    } else {
			FlagButton = 0; //замена переменной для идентификации состояния кнопки запуска геолокации (положение "Выключено"
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
	
	},
	
    //, onRemove: function(map) { }   // Nothing to do here
});



startGeolocation = function (selectedMap) {

alert (FlagButton);


};

stopGeolocation = function (selectedMap) {
	alert (FlagButton);
selectedMap.stopLocate();
};






L.Mytrack = L.Layer.extend({
  options: {
    click: false,
    elevation: false,
  }, //click or locationfound
  lng0: 0, //prevent duplikates
  gpx: {
    "type": "LineString",
    "coordinates": []
  },
  initialize: function(options) {
    L.setOptions(this, options);
  },
  onAdd: function(map) {
    this.myLayer = L.geoJSON().addTo(map); 
	map.on(this.options.click ? 'click' : 'locationfound', this._onclick, this);
  },
  
  //  добваляет на слой массив координат (coordinates) объекта gpx с новой последней точкой
  _onclick: function(e) {
    if (e.latlng.lng != this.lng0) {
      this.lng0 = e.latlng.lng;
	  this.gpx.coordinates.push(this.options.elevation &&e.altitude?[e.latlng.lng, e.latlng.lat, e.altitude]:[e.latlng.lng, e.latlng.lat]); // в конец массива gpx добавляется новый latlng с думя значениями координат
      this.myLayer.clearLayers(); // очищается слой myLayer
	  this.myLayer.addData(this.gpx);  // по новой на слой myLayer добавляется дополненный массив coordinates объекта gpx
	  this._map.panTo([e.latlng.lat, e.latlng.lng]) //центр карты позиционируется на место геолокации
      this._map.attributionControl.setPrefix(Math.round(e.speed*3.6)+" km/h")
    }
  },
/*  
  upload: function(url) {
     var xhr = new XMLHttpRequest(), fd = new FormData()
     var blob = new Blob([JSON.stringify(this.gpx)], { type: "application/json"})
     fd.append("myfile", blob, "mytrack.json")
     xhr.open("POST", url, true)
	 xhr.send(fd)
    }
*/	
	
});

L.mytrack = function(options) {return new L.Mytrack(options);}; //L.mytrack = new L.Mytrack();



L.control.watermark = function(opts) {
  return new L.Control.Watermark(opts);
}


/*
L.Control.Watermark2 = L.Control.extend({ //upload-button
  onAdd: function(map) {
    var thisLoader = this;
    this.mt=L.geoJSON("",{style: {color: "red"}}).addTo(map)
    this.wakelock = new this.Wakelock()
    var container = L.DomUtil.create('div');
    container.setAttribute("style", "height:26px; width:26px; background:#fff; text-align:center")
    var img = L.DomUtil.create('input', 'mc', container);
    img.type = 'file'
    img.id = "fileElem"
    img.style.display = 'none'
    img.accept = ".json,.gpx,.geojson"
    img.addEventListener('change', function() {
      thisLoader._handleFiles(this.files)
    }); //L.DomEvent.on

    var lab = L.DomUtil.create('label', 'mc', container);
    lab.setAttribute("for", "fileElem")
    lab.textContent = "\u00A0\u2B06\u00A0"
    //lab.style.background = 'white'

    L.DomEvent.disableClickPropagation(container)
    return container;
  },
  _handleFiles: function(files) {
      var thisLoader = this;
      var reader = new FileReader();
      reader.onload = function(e) {thisLoader._add(reader.result, new Date(files[0].lastModified))}  //Date
      reader.readAsText(files[0])
    },
    ajax: function(url) {
      var thisLoader = this;
      fetch(url).then(function(response) {response.text().then(function(data) {thisLoader._add(data,response.headers.get("Last-modified"))}
    ) })
    },
    _add: function(data,lm) {
      if(data[0]!="{") { //Gpx track
          data = '{"type": "LineString","coordinates": [' + (data.replace(/lat="(.*?)" lon="(.*?)"/g, "[$2,$1]").match(/\[.*?\]/g) + "").replace('"', '') + ']}'
        }
      data = JSON.parse(data)
      if(data.latitude) data = { "type": "Point","coordinates": [data.longitude, data.latitude] }  //read json
      
      var mt=this.mt; //mt.clearLayers()
      mt.addData(data)
      this._map.panTo(mt.getBounds().getCenter())  //.fitBounds(mt.getBounds())
      
      mt=mt.bindPopup(function (layer) { var fe=layer.feature.geometry.coordinates, tot=0
       for (var i=0; i<fe.length-1; i++) {tot += L.latLng([fe[i][1],fe[i][0]]).distanceTo([fe[i+1][1],fe[i+1][0]])}
      return (tot/1000).toFixed(3)+" km<br>&#x2195; "+(fe[fe.length-1][2]-fe[0][2]).toFixed(0)+" m<br>"+(lm||"") })
      
      var mp; mt.eachLayer(function (layer) {mp=layer.feature.geometry.coordinates});  //altitude
      if(mp[0][2]) mp.forEach(function myFunction(item) {L.geoJSON({"type":"Point","coordinates":item},{
       style:function(feature) {return {fillColor:"hsl("+(180-Math.atan(feature.geometry.coordinates[2]/1000)/Math.PI*360)+", 100%, 50%)"}},  //500
       pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, {radius: 4,color: "#000",weight: 0,fillOpacity: 0.8})}  //1
       }).addTo(karte);
      })
      
    },
    Wakelock: function() {  //Android
     var video = document.createElement('video'); video.addEventListener('ended', function() {video.play()})
     this.request = function() {
      video.src = "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA="
      video.play() }
    }
    //, onRemove: function(map) { }   // Nothing to do here
});

L.control.watermark2 = function(opts) {
  return new L.Control.Watermark2(opts);
}
*/

