var React = require('react');
var ReactDOM = require('react-dom');

var TextList = React.createClass({
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

module.exports = React.createClass({
  		getInitialState: function() {
    		return {
      			items: []
    		};
  		},

  		refresh: function(){
  			this.setState(this.getInitialState());
  		},

  		submit: function(){
  			console.log("TextQuestion submit called");
  			console.log(this.state.items);
  			return {
  				"options": this.state.items
  			};
  		},

	  	render: function() {
	    	return (
	    		<div>
	    			<TextList onDeleteItem={this.onDeleteItem}>{this.state.items}</TextList>
	    			<input id="option" placeholder="Enter an answer choice" ref="new_item"/>
	    			<button id="addopt" type="button" onClick={this.onAddClicked}></button>
	    		</div>
	    	);
	  	},

	  	onAddClicked: function() {
	    	var newItems = this.state.items.slice();
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
