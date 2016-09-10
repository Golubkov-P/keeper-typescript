import {DOMElement} from '../DOMElement';

export class DateComponent extends DOMElement {
	parent:HTMLElement;
	template: any;
	constructor() {
		super();
		this.parent = document.getElementById('date-container');
		this.template = this.getTemplate();
		this.render(this.parent, this.template);
	}

	createDate():any {
		let newDate = new Date();
		return newDate;
	}

	getDate():any {
		return this.createDate().getDate();
	}

	getMonth():any {
		return this.createDate().getMonth();
	}

	getYear():any {
		return this.createDate().getFullYear();		
	}

	getDay():any {
		return this.createDate().getDay();
	}

	returnFullDay():any {
		let day:number = this.getDay();
		let date:number = this.getDate();
		let days:any = {
			0: 'Sunday',
			1: 'Monday',
			2: 'Tuesday',
			3: 'Wednesday',
			4: 'Thursday',
			5: 'Friday',
			6: 'Saturday'
		};
		return date + ' ' + days[day];
	}

	returnMonthWithYear():any {
		let month:number = this.getMonth();
		let year:number = this.getYear();
		let months:any = {
			0: 'January',
			1: 'February',
			2: 'March',
			3: 'April',
			4: 'May',
			5: 'June',
			6: 'July',
			7: 'August',
			8: 'September',
			9: 'October',
			10: 'November',
			11: 'December'
		};
		return months[month] + ' ' + year;
	}

	getTemplate():any {
		let helper = this.helperFunc;
		let fullDay = this.returnFullDay();
		let Date = this.returnMonthWithYear();
		const template:any = (
			helper('div', {className: 'date'}, [
				helper('div', {className: 'date-day'}, [fullDay]),
				helper('div', {className: 'date-month'}, [Date])
			])
		);
		return template;
	}

	renderElement() {
		const parent = this.parent;
		const elem = this.createElement(this.getTemplate());

		this.render(parent, elem);
	}
}