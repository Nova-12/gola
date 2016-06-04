var List = React.createClass({
  	render: function() {
  		var self = this;
  		console.log(this.props);
    	return (
    	 	<ol id="options">{ this.props.children.map(function(child, index){
                return (
                	<li key={index}>
                	{<input type="text" id="option" defaultValue={child}></input>}
                	<button onClick={self.props.onDeleteItem.bind(null, index)}>Remove</button>
                	</li>
                )

                }) }
                    
            </ol>
    	);
  	}
});

var TextQuestion = React.createClass({
		getInitialState: function() {
		return {
  			items: []
		};
		},

  	render: function() {
    	return (
    		<div>
    			<List onDeleteItem={this.onDeleteItem}>{this.state.items}</List>
    			<input ref="new_item"/>
    			<button id="addOption" type="button" onClick={this.onAddClicked}>Add</button>
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
    	console.log(newItems[index]);
    	newItems.splice(index, 1);
    	this.setState({items: newItems});
  	}
});