/* Create the map */
var mapContainer = document.getElementById('map');       // div for map
var mapOption = {
    center: new daum.maps.LatLng(33.450701, 126.570667), // initial map center
    level: 3                                             // magnification level
};
var map = new daum.maps.Map(mapContainer, mapOption);    // create map

/* Marker events */
var markers = [];
var selectedMarkers = [];

/* Selected marker image */
var imageSrc = 'http://bit.sparcs.org/~chocho/selectedMarker.png',
    imageSize = new daum.maps.Size(39, 54),
    imageOption = {offset: new daum.maps.Point(20, 45)};

var selectedMarkerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);

/* Add marker */
var addMarkerBtn = document.getElementById("addMarkerBtn");
addMarkerBtn.onclick = addMarker;

function addMarker() {
    var markerPosition = map.getCenter(),
        marker = new daum.maps.Marker({
            position: markerPosition
        }),
        clickBit = 0;
    var markerImage = marker.getImage();
    marker.setMap(map);
    marker.setDraggable(true);
    markers.push(marker);
    
    daum.maps.event.addListener(marker, 'click', function() {
        if (clickBit == 0) {
            marker.setImage(selectedMarkerImage);
            selectedMarkers.push(marker);
        } else {
            marker.setImage(markerImage);
            var index = selectedMarkers.indexOf(marker);
            if (index != -1) {
                selectedMarkers.splice(index, 1);
            }
        }
        clickBit = ~clickBit; 
    });
}

/* Get markers' position */
var getMarkerPositionBtn = document.getElementById("getMarkerPositionBtn");
getMarkerPositionBtn.onclick = getMarkerPosition;
function getMarkerPosition() {
    var message = "";
    for (var i = 0; i < markers.length; i++) {
        message += "Marker " + (i + 1) + ": " + markers[i].getPosition() + "<br>";
    }
    document.getElementById("message").innerHTML = message;
}

/* Search places */
var ps = new daum.maps.services.Places();
var infowindow = new daum.maps.InfoWindow({zIndex:1});

searchPlaces();

function searchPlaces() {
    var keyword = document.getElementById('keyword').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        return false;
    }

    ps.keywordSearch( keyword, placesSearchCB);
}

/* Callback function when places search is done */
function placesSearchCB(status, data, pagination) {
    if (status === daum.maps.services.Status.OK) {
        displayPlaces(data.places);
        displayPagination(pagination);
    } else if (status === daum.maps.services.Status.ZERO_RESULT) {
        alert('No result found.');
        return;
    } else if (status === daum.maps.services.Status.ERROR) {
        alert('Error');
        return;
    }
}

/* Display places search result */
function displayPlaces(places) {
    var listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new daum.maps.LatLngBounds(),
        listStr = '';

    // Remove elements that are in the search result
    removeAllChildNods(listEl);

    // Remove markers present on the map
    removeMarker();

    for ( var i = 0; i < places.length; i++ ) {
    
        // Create marker and display it on the map
        var placePosition = new daum.maps.LatLng(places[i].latitude,
                places[i].longitude),
            marker = addSearchMarker(placePosition, i),
            itemEl = getListItem(i, places[i], marker);

        bounds.extend(placePosition);

        (function(marker, title) {
            daum.maps.event.addListener(marker, 'mouseover', function() {
                displayInfowindow(marker, title);
            });

            daum.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });

            itemEl.onmouseover = function () {
                displayInfowindow(marker, title);
            };

            itemEl.onmouseout = function () {
                infowindow.close();
            };
        }) (marker, places[i].title);

        fragment.appendChild(itemEl);
    }
    
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    map.setBounds(bounds);
}

function getListItem(index, places) {
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
                             
}

function addSearchMarker(position, idx, title) {
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

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    daum.maps.event.addListener(marker, 'click', function() {
        if (clickBit == 0) {
            marker.setImage(selectedMarkerImage);
            selectedMarkers.push(marker);
        } else {
            marker.setImage(markerImage);
            var index = selectedMarkers.indexOf(marker);
            if (index != -1) {
                selectedMarkers.splice(index, 1);
            }
        }
        clickBit = ~clickBit; 
    });

    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    

    return marker;
}

function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i; 

    // 기존에 추가된 페이지번호를 삭제합니다
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
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
}

 // 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}