import {DOMElement} from '../DOMElement';

export class Note extends DOMElement {
	parent:HTMLElement;
	template: any;
	event:any;
	constructor(data:any, event:any) {
		super();
		this.parent = document.getElementById('root');
		this.event = event;
		this.template = this.getTemplate(data, event);
		this.render(this.parent, this.template);
	}

	getTemplate(data:any, event:any):any {
		let helper = this.helperFunc;
		const t = (
			helper('div', {className: 'note-grid', key: data.id}, [
				helper('div', {className: 'note'}, [
					helper('div', { className: 'note-close', onClick: (e:any) => { this.deleteNote(e.path[3]); } }, [
						helper('i', {className: 'fa fa-close'}, [''])
					]),
					helper('div', {className: 'note__title'}, [
						data.title
					]),
					helper('div', {className: 'note__text'}, [
						data.text
					])
				])
			])
		);
		return t
	}

	deleteNote(elem:HTMLElement) {
		this.deleteElement(this.parent, elem);
		this.event(elem);
	}
}