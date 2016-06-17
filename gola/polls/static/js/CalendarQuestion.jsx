import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // only needs to be imported once
import moment from 'moment';
import 'react-widgets/lib/less/react-widgets.less';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

var CalendarList = React.createClass({
	render: function() {
		var self = this;
		console.log(this.props);
		return(
			<ul id="options">{ this.props.children.map(function(child, index) {
				return (
					<li key={index} id="calendaroption">
						<b id="calendaroptiontext1">Answer Choice {index+1}: </b>
						<p id="calendaroptiontext2"> {child} </p>
						<button id="calendardeleteopt" onClick={self.props.onDeleteItem.bind(null, index)}></button>
					</li>
				);
			})}
			</ul>
		);
	}	
});


momentLocalizer(moment);

// Render the Calendar
var today = new Date();
var minDate = Number(new Date()) - (24*60*60*1000) * 7; // One week before today
var startTime = new Date();
var endTime = new Date();

export class CalendarQuestion extends Component {
	constructor(props) {
		super(props);
		this.state = {items: []};

		this.onAddClicked = this.onAddClicked.bind(this)
		this.onDeleteItem = this.onDeleteItem.bind(this)

	}
	onDateSelect (date) {
		console.log(date.format('MM DD YYYY'));
		this.setState({date: date.format('YYYY/MM/DD EEE')});
	}
	
	onStartTimeSelect (date) {
		console.log(moment(date).format("hh:mm A"));
		startTime = moment(date).format("hh:mm A");
		this.setState({startTime: startTime});
		console.log("START TIME: ", startTime);
		console.log("START TIME TYPE: ", typeof startTime);
	}
	onEndTimeSelect (date) {
		console.log(moment(date).format("hh:mm A"));
		endTime = moment(date).format("hh:mm A");
		this.setState({endTime: endTime});	
		console.log("END TIME: ", endTime);
		console.log("END TIME TYPE: ", typeof endTime);
	}

	onAddClicked () {
		var newItems = this.state.items.slice();
		var dateTime = moment(this.refs.new_item.state.selectedDate).format('YYYY/MM/DD');
		console.log("onClick START", this.state.startTime);
		dateTime += " " + startTime + " ~ " + endTime;
    	console.log("NEW ITEMS: ", newItems);
    	newItems.push(dateTime);
    	this.setState({items: newItems});
	}

	onDeleteItem (index) {
    	var newItems = this.state.items.slice();
    	console.log("This item about to be removed")
    	console.log(newItems[index]);
    	newItems.splice(index, 1);
    	this.setState({items: newItems});
  	}

  	refresh () {
		this.state = {items: []};
  	}

  	submit (){
  		return {
  			"options": this.state.items
  		};
  	}

	render () {
		return (
			<div class="calendar-wrapper">
				<div id="calendar">
					<InfiniteCalendar
						width={300}
						height={500}
						selectedDate={today}
						disabledDays={[]}
						minDate={minDate}
						keyboardSupport={true}
						onChange={this.onDateSelect}
						ref="new_item"
					/>
				</div>
                <div id="time">
            		<div id="time1"><h4>Start: </h4></div>
            		<div id="time2">
                		<DateTimePicker
	                		calendar={false}
	                		format={"hh:mm A"}
	                		onChange={this.onStartTimeSelect}
                		/>
            		</div>
            		<div id="time3"><h4>End: </h4></div>
            		<div id="time4">
                		<DateTimePicker
	                		calendar={false}
	                		format={"hh:mm A"}
	                		onChange={this.onEndTimeSelect}
                		/>
            		</div>
            		<div id="time5"><button id="addopt" type="button" onClick={this.onAddClicked}></button></div>
                </div>
                <div id="datetime-result">
                	<CalendarList onDeleteItem={this.onDeleteItem}>{this.state.items}</CalendarList>
                </div>
			</div>

  		);
	}
	
}
