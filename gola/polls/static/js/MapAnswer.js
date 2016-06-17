var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			markers: [],
			selectedMarkers: []
		}
	},
	componentDidMount: function() {
		var mapContainer = this.refs.map;
		var mapOption = {
			center: this.props.content[0].getPosition();
			level: 3
		};
		var map = new daum.maps.Map(mapContainer, mapOption);
		var imageSrc = 'http://bit.sparcs.org/~chocho/selectedMarker.png',
			imageSize = new daum.maps.Size(39, 54),
   			imageOption = {offset: new daum.maps.Point(20, 45)};

		var selectedMarkerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);
		for (var i = 0; i < this.props.content.length; i++) {
			var marker = new daum.maps.Marker({
				position: this.props.content[i].getPosition()
			});
			marker.setMap(map);
			this.state.markers.push(marker);

			var ctx = this.state;
			daum.maps.event.addListener(marker, 'click', function() {
			if (clickBit == 0) {
				marker.setImage(selectedMarkerImage);
				ctx.selectedMarkers.push(marker.getPosition());
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
		}
	},
	render: function(){
		this.props.content
		return (
			<div className="mapContainer" ref="map" content={this.state.selectedMarkers}>
				
			</div>
		);

	}
});