import {DOMElement} from '../DOMElement';

export class AddNoteForm extends DOMElement {
	parent:HTMLElement;
	template: any;
	option:any;
	constructor(option:any) {
		super();
		this.parent = document.getElementById('root');
		this.template = this.getTemplate();
		this.option = option;
	}

	returnItemObject() {
		let noteTitle:HTMLElement = document.getElementById('note-input__title');
		let noteText:HTMLElement = document.getElementById('note-input__text');

		return {
			id: new Date(),
			title: noteTitle.innerText,
			text: noteText.innerText
		}
	}

	placeholderHide(placeholder:Element) {
		placeholder.setAttribute('style', 'display:none;');	
	}

	placeholderShow(placeholder:Element) {
		placeholder.setAttribute('style', '');	
	}

	placeholderControl() {
		let noteTitle:HTMLElement = document.getElementById('note-input__title');
		let noteText:HTMLElement = document.getElementById('note-input__text');
		let phTitle:Element = document.querySelector('.input-text__title');
		let phText:Element = document.querySelector('.input-text__text');

		noteTitle.addEventListener('input', () => {
			if (noteTitle.innerText.length !== 0 ) {
				this.placeholderHide(phTitle);
			} else {
				this.placeholderShow(phTitle);
			}
		});
		noteText.addEventListener('input', () => {
			if (noteText.innerText.length !== 0 ) {
				this.placeholderHide(phText);
			} else {
				this.placeholderShow(phText);
			}
		});
	}

	focusFieldControl() {
		let noteTitle:HTMLElement = document.getElementById('note-input__title');
		let noteText:HTMLElement = document.getElementById('note-input__text');

		noteTitle.addEventListener('keydown', function(e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				noteText.focus();
			}
		});
	}

	addNoteFunction() {
		let noteTitle:HTMLElement = document.getElementById('note-input__title');
		let noteText:HTMLElement = document.getElementById('note-input__text');
		let phTitle:Element = document.querySelector('.input-text__title');
		let phText:Element = document.querySelector('.input-text__text');
		let modal:HTMLElement = document.getElementById('modal');
		let modalParent = document.querySelector('body');

		if (noteTitle.innerText.length !== 0 && noteTitle.innerText.length !== 0) {
			let date = this.returnItemObject();
			this.option.event(date);

			noteTitle.innerText = '';
			noteText.innerText = '';
			this.placeholderShow(phText);
			this.placeholderShow(phTitle);
			this.deleteElement(<HTMLElement>modalParent, modal);
		}
	}


	getTemplate(): any {
		let helper = this.helperFunc;
		const t = (helper('div', {className: 'note-form'}, [
			helper('div', {className: 'input-wrapper'}, [
					helper('div', {className: 'input-text__title'}, ["Note's title"]),
					helper('div', {contenteditable: "true", id: "note-input__title", className: "note-input__title"}, ['']),
			]),
			helper('div', {className: 'input-wrapper'}, [
				helper('div', {className: 'input-text__text'}, ["Note's text"]),
				helper('div', {contenteditable: "true", id: "note-input__text", className: "note-input__text"}, ['']),
			]),
			helper('div', {id: 'add-button', onClick: () => { this.addNoteFunction(); }}, [
				helper('i', {className: 'fa fa-plus'}, [''])
			])
		]));
		return t
	}
}
