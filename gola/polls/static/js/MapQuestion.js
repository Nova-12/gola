var React = require('react');
var ReactDOM = require('react-dom');

var imageSrc = 'http://bit.sparcs.org/~chocho/selectedMarker.png',
    imageSize,
    imageOption;

var selectedMarkerImage;

var ps;

var fragment = document.createDocumentFragment();

var infowindow;

module.exports = React.createClass({
	getInitialState: function() {
		infowindow = new daum.maps.InfoWindow({zIndex:1});
		return {
			map: "",
			markers: [],
			selectedMarkers: [],
			items: []
		};
	},
	addMarker: function() {
		var markerPosition = this.state.map.getCenter(),
			marker = new daum.maps.Marker({
				position: markerPosition
			}),
			clickBit = 0;
		var markerImage = marker.getImage();
		marker.setMap(this.state.map);
		marker.setDraggable(true);
		this.state.markers.push(marker);

		var title = prompt("Enter a name for the marker.");
		var iwContent = '<div style="padding:5px;">' +
						title+'</div>';
		
		var btn = this.refs.iwBtn;
		console.log(this.refs.iwBtn);
		/*var iw = new daum.maps.InfoWindow({
			content: iwContent
		});*/
		
		marker.setTitle(title);
		
		var ctx = this.state;
		daum.maps.event.addListener(marker, 'click', function() {
			
			if (clickBit == 0) {
				marker.setImage(selectedMarkerImage);
				ctx.selectedMarkers.push(marker);
			}
			else {
				marker.setImage(markerImage);
				var index = ctx.selectedMarkers.indexOf(marker);
				if (index != -1) {
					ctx.selectedMarkers.splice(index, 1);
				}
			}
			clickBit = ~clickBit;
		});
		daum.maps.event.addListener(marker, 'mouseover', function() {
			infowindow.setContent(iwContent);
			infowindow.open(ctx.map, marker);
		});
		daum.maps.event.addListener(marker, 'mouseout', function() {
			infowindow.close();
		});
		console.log("Markers: ", this.state.markers);
		console.log("Selected: ", this.state.selectedMarkers);
	},
	setText: function() {
		console.log("CALLED");
		marker.setTitle("KAKAO");
	},
	addSearchMarker: function(position, idx, title) {
		var imageSrc = 'http://i1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
	        imageSize = new daum.maps.Size(36, 37),  // 마커 이미지의 크기
	        imgOptions =  {
	            spriteSize : new daum.maps.Size(36, 691), // 스프라이트 이미지의 크기
	            spriteOrigin : new daum.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
	            offset: new daum.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
	        },
	        markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imgOptions),
	        marker = new daum.maps.Marker({
	            position: position, // 마커의 위치
	            image: markerImage
	        }),
	        clickBit = 0;

	    marker.setMap(this.state.map); // 지도 위에 마커를 표출합니다
	    var ctx = this.state;
	    daum.maps.event.addListener(marker, 'click', function() {
	        if (clickBit == 0) {
	            marker.setImage(selectedMarkerImage);
	            ctx.selectedMarkers.push(marker);
	        } else {
	            marker.setImage(markerImage);
	            var index = ctx.selectedMarkers.indexOf(marker);
	            if (index != -1) {
	                ctx.selectedMarkers.splice(index, 1);
	            }
	        }
	        clickBit = ~clickBit; 
	    });

	    this.state.markers.push(marker);  // 배열에 생성된 마커를 추가합니다

	    return marker;
	},
	componentDidMount: function() {
		console.log(this.refs.map);
		var mapContainer = this.refs.map;
		var mapOption = {
			center: new daum.maps.LatLng(33.450701, 126.570667), // initial map center
    		level: 3 
		};
		var map = new daum.maps.Map(mapContainer, mapOption);
		console.log("MAP: ", map);
		this.setState({map: map});
		imageSize = new daum.maps.Size(39, 54),
   		imageOption = {offset: new daum.maps.Point(20, 45)};

		selectedMarkerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);

		ps = new daum.maps.services.Places();
		
	},
	displayInfowindow: function(marker, title) {
		var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
		infowindow.setContent(content);
		infowindow.open(this.state.map, marker);
	},
	displayPagination: function(pagination) {
		var paginationEl = this.refs.pagination,
			fragment = document.createDocumentFragment(),
			i;

		while (paginationEl.hasChildNodes()) {
	        paginationEl.removeChild (paginationEl.lastChild);
	    }

	    for (i=1; i<=pagination.last; i++) {
	        var el = document.createElement('a');
	        el.href = "#";
	        el.innerHTML = i;

	        if (i===pagination.current) {
	            el.className = 'on';
	        } else {
	            el.onclick = (function(i) {
	                return function() {
	                    pagination.gotoPage(i);
	                }
	            })(i);
	        }

	        fragment.appendChild(el);
	    }
	    paginationEl.appendChild(fragment);
	},
	displayPlaces: function(places) {
		var listEl = this.refs.placesList,
			menuEl = this.refs.menu_wrap,
			// fragment = createFragment(),
			fragment = document.createDocumentFragment(),
			bounds = new daum.maps.LatLngBounds(),
			listStr = '';

		this.removeAllChildNode(listEl);
		this.removeMarker();

	    for ( var i = 0; i < places.length; i++ ) {
	    
	        // Create marker and display it on the map
	        var placePosition = new daum.maps.LatLng(places[i].latitude,
	                places[i].longitude),
	            marker = this.addSearchMarker(placePosition, i),
	            itemEl = this.getListItem(i, places[i], marker);

	        bounds.extend(placePosition);
	        var ctx = this;
	        (function(marker, title, dm, ctx) {
            	dm.event.addListener(marker, 'mouseover', function() {
	                ctx.displayInfowindow(marker, title);
	            });

            	dm.event.addListener(marker, 'mouseout', function() {
	                infowindow.close();
	            });

	            itemEl.onmouseover =  function () {
	                ctx.displayInfowindow(marker, title);
	            };

	            itemEl.onmouseout =  function () {
	                infowindow.close();
	            };
	        })(marker, places[i].title, daum.maps, ctx);
	        
	        marker.setTitle(places[i].title);
	        fragment.appendChild(itemEl);
	    }
	    
	    listEl.appendChild(fragment);
	    menuEl.scrollTop = 0;

	    this.state.map.setBounds(bounds);

	},
	getListItem: function(index, places) {
		var el = document.createElement('li'),
        	itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
	                    '<div class="info">' +
	                    '   <h5>' + places.title + '</h5>';

        if (places.newAddress) {
            itemStr += '    <span>' + places.newAddress + '</span>' +
                        '   <span class="jibun gray">' +  places.address  + '</span>';
        } else {
            itemStr += '    <span>' +  places.address  + '</span>'; 
        }
                     
          itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                    '</div>';           

        el.innerHTML = itemStr;
        el.className = 'item';

        return el;
	},
	placesSearchCB: function(status, data, pagination) {
		if (status === daum.maps.services.Status.OK) {
			console.log("IN");
	        this.displayPlaces(data.places);
	        this.displayPagination(pagination);
	    } else if (status === daum.maps.services.Status.ZERO_RESULT) {
	        alert('No result found.');
	        return;
	    } else if (status === daum.maps.services.Status.ERROR) {
	        alert('Error');
	        return;
	    }
	    console.log("HERE");
	},
	searchPlaces: function() {
		var keyword = this.refs.keyword.value;
		if (!keyword.replace(/^\s+|\s+$/g, '')) {
			console.log("FALSE");
	        return false;
	    }
	    ps.keywordSearch(keyword, this.placesSearchCB);
	},
	submit: function() {
		if (this.state.items.length > 0) {
			this.state.items = [];
		}
		for (var i = 0; i < this.state.selectedMarkers.length; i++) {
			console.log("SELECTED MARKER: "+ this.state.selectedMarkers[i]);
			console.log("POSITION: " + this.state.selectedMarkers[i].getPosition());
			var item = [];
			item.push(this.state.selectedMarkers[i].getPosition());
			item.push(this.state.selectedMarkers[i].getTitle());
			console.log("ITEM INFO: ", item); 
			this.state.items.push(item);
		}
		return {
			"options": this.state.items
		}
	},
	refresh: function() {
		this.setState(this.getInitialState());
	},
	removeAllChildNode: function(el) {
		while (el.hasChildNodes()) {
			el.removeChild (el.lastChild);
		}
	},
	removeMarker: function() {
		for (var i = 0; i < this.state.markers.length; i++) {
			this.state.markers[i].setMap(null);
		}				
		this.state.markers = [];
	},
	render: function() {
		return (
			<div className="map-wrapper">
				<div id="map" ref="map"></div>
				<div id="menu_wrap" className="bg_white" ref="menu_wrap">
			        <div className="option">
		                <form onsubmit="searchPlaces(); return false;">
		                    Keyword : <input type="text" defaultValue=""
		                    id="keyword" size="15" ref="keyword"></input>
		                <button type="button" onClick={this.searchPlaces}>Search</button>
		              	</form>
			        </div>
			        <hr />
			        <ul id="placesList" ref="placesList"></ul>
			        <div id="pagination" ref="pagination"></div>
			    </div>
			    <div id="add_marker" >
			    	<button id="add_marker_btn" onClick={this.addMarker}></button>
			    </div>
			</div>
		);
	}
});