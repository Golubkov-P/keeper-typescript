import {DOMElement} from '../DOMElement';

export class Button extends DOMElement {
	parent:HTMLElement;
	template: any;
	option:any;
	constructor(option:any) {
		super();
		this.option = option;
		this.parent = document.getElementById(this.option.parent);
		this.template = this.getTemplate();
		this.render(this.parent, this.template);
	}

	getTemplate(): any {
		let helper = this.helperFunc;
		const t = (helper('div', {id: this.option.id, onClick: this.option.event}, [
			helper('i', {className: 'fa fa-plus'}, [''])
		]));
		return t
	}
}