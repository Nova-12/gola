import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // only needs to be imported once


export default class Calendar extends {Component} {

	onDateSelect (date) {
		console.log(date.format('MM DD YYYY'));
		this.setState({date: date});
	}

	render () {
		<div id="calendar">
			<InfiniteCalendar
				width={300}
				height={500}
				selectedDate={today}
				disabledDays={[0,6]}
				minDate={minDate}
				keyboardSupport={true}
				onChange={this.onDateSelect}
			/>
		</div>
	}
}