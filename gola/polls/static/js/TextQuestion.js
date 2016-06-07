var React = require('react');
var ReactDOM = require('react-dom');
var List = require('./List.js');

module.exports = React.createClass({
  		getInitialState: function() {
    		return {
      			items: []
    		};
  		},

	  	render: function() {
	    	return (
	    		<div>
	    			<List onDeleteItem={this.onDeleteItem}>{this.state.items}</List>
	    			<input id="option" placeholder="Enter an answer choice" ref="new_item"/>
	    			<button id="addopt" type="button" onClick={this.onAddClicked}></button>
	    		</div>
	    	);
	  	},

	  	onAddClicked: function() {
	    	var newItems = this.state.items.slice();
	    	console.log(this.state.items);
	    	newItems.push(ReactDOM.findDOMNode(this.refs.new_item).value);
	    	this.setState({items: newItems});
	  	},

	  	onDeleteItem: function(index) {
	    	var newItems = this.state.items.slice();
	    	console.log("This item about to be removed")
	    	console.log(newItems[index]);
	    	newItems.splice(index, 1);
	    	this.setState({items: newItems});
	  	}
	});