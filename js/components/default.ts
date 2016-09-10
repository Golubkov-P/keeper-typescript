import {DOMElement} from '../DOMElement';

export class DefaultItem extends DOMElement {
	parent:HTMLElement;
	template: any;
	constructor() {
		super();
		this.parent = document.getElementById('root');
		this.template = this.getTemplate();
		this.render(this.parent, this.template);
	}

	getTemplate(): any {
		let helper = this.helperFunc;
		const t = (helper('div', {className: 'default-text'}, ['Note list is empty']));
		return t
	}
}