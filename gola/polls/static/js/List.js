var React = require('react');

module.exports = React.createClass({
  	render: function() {
  		var self = this;
  		console.log(this.props);
    	return (
    	 	<ul id="options">{ this.props.children.map(function(child, index){
                return (
                	<li key={index} id="option">
                    	<b>Answer Choice {index+1}: </b>{child}
                    	<button id="deleteopt" onClick={self.props.onDeleteItem.bind(null, index)}></button>
                	</li>
                )

                }) }
                    
            </ul>
    	);
  	}
});