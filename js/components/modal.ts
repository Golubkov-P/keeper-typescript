import {DOMElement} from '../DOMElement';

export class Modal extends DOMElement {
	parent:Element;
	template: any;
	child:any;
	openButton:any;
	constructor(child:any) {
		super();
		this.parent = document.querySelector('body');
		this.child = child;
		this.template = this.getTemplate();
		this.render(<HTMLElement>this.parent, this.getTemplate())
		this.addChild();
	}

	getTemplate(): any {
		let helper = this.helperFunc;
		const t = (helper('div', {id: 'modal', className: 'modal active'}, [
			helper('div', {id: 'modal-content', className: 'modal__content'}, [
				helper('div', {id: "modal-close", className: 'modal-close', onClick: (e:any) => { this.hideModal(e.path[3]); }}, [
					helper('i', {id: "modal-close", className: 'fa fa-close'}, [''])
				])
			])
		]));
		return t
	}

	addChild(): void {
		let container:HTMLElement = document.getElementById('modal-content');
		this.render(container, this.child);
	}

	hideModal(elem:HTMLElement):void {
		this.deleteElement(<HTMLElement>this.parent, elem);
	}
}