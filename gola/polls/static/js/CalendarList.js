var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	render: function() {
		var self = this;
		console.log(this.props);
		return(
			<ul id="options">{ this.props.children.map(function(child, index) {
				return (
					<li key={index} id="calendaroption">
						<b>Answer Choice {index+1}: </b>
						<div id="myDiv">
							{child}
						</div>
						<button id="deleteopt" onClick={self.props.onDeleteItem.bind(null, index)}></button>
					</li>
				)
			})}
			</ul>
		);
	}	
});