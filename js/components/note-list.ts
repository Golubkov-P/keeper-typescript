import {DOMElement} from '../DOMElement';

export class NoteList extends DOMElement {
	parent:HTMLElement;
	template:any; 
	constructor() {
		super();
		this.parent = document.getElementById('app');
		this.template = this.getTemplate();
		this.render(this.parent, this.template);
	}

	clearNoteList():any {
		let root:HTMLElement = document.getElementById('root');
		let childs = root.childNodes;
		let ch = Array.prototype.slice.call(childs);
		ch.map((elem:HTMLElement) => {
			if( elem.getAttribute('class') === 'note-grid') {
  			this.deleteElement(root, elem);
  		}
		});
	}

	getTemplate():any {
		let helper = this.helperFunc;
		const template = (
			helper('div', {id: 'root'}, [
				helper('div', {className: 'note-sizing'}, [''])
			])
		);
		return template
	}

}