import {TextQuestion} from './TextQuestion';

var QuestionMenu = React.createClass({

    getInitialState: function(){
        return { focused: 0 };
    },

    clicked: function(index){

        this.setState({focused: index});
    },

    render: function() {

        var self = this;

        return (
            <div>
            	<font size="4" color="#002b80">{self.state.focused}.</font>
            	<QuestionInput/>
                <ul id="questiontabs">{ this.props.items.map(function(m, index){
        
                    var style = '';
        
                    if(self.state.focused == index){
                        style = 'focused';
                    }
        
                    return <li id="questiontab" className={style} onClick={self.clicked.bind(self, index)}>{m}</li>;
        
                }) }
                        
                </ul>
                <br/><br/><Content currentTab={this.state.focused}/>
            </div>
        );
    }
});
var QuestionInput = React.createClass({
	getInitialState: function() {
	    return {value: ''};
	},
	handleChange: function(event) {
		this.setState({value: event.target.value});
	},
	render: function() {
		return (
   			<input
		        type="text"
		        id="question"
		        placeholder="Enter the question"
		        value={this.state.value}
		        onChange={this.handleChange}
      		/>
    	);
		}
});
var Content = React.createClass({
    render: function(){
        return(
            <div className="content">
            	{this.props.currentTab === 0 ?
            	<div className="text">
                    <TextQuestion/>
                </div>
                :null}

                {this.props.currentTab === 1 ?
                <div className="mike">
                    <img src="http://s.mlkshk.com/r/104TN" />
                </div>
                :null}

                {this.props.currentTab === 2 ?
                <div className="donnie">
                    <img src="http://s.mlkshk.com/r/103AG" />
                </div>
                :null}

                {this.props.currentTab === 3 ?
                <div className="raph">
                    <img src="http://s.mlkshk.com/r/JAUD" />
                </div>
                :null}
            
                {this.props.currentTab === 4 ?
                <div className="leo">
                    <img src="http://s.mlkshk.com/r/ZJPL" />
                </div>
                :null}
            </div>
        );
    }
});

ReactDOM.render(
	    <QuestionMenu items={ ['TEXT', 'IMAGE', 'IMAGE TAGGING', 'VIDEO', 'CALENDAR', 'MAP'] } />,
	    document.getElementById('gola')
);