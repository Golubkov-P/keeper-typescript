/// <reference path="masonry-layout.d.ts" />

import {DateComponent} from './components/date';
import {Note} from './components/note';
import {DefaultItem} from './components/default';
import {NoteList} from './components/note-list';
import {Modal} from './components/modal';
import {AddNoteForm} from './components/addNoteForm';

export class Controller {
	Model: any;
	Masonry: any;
	constructor(Model:any) {
		this.Model = Model;
		this.appLoading();
		this.Masonry = new Masonry('#root', {
			itemSelector: '.note-grid',
			columnWidth: '.note-sizing',
			percentPosition: true
		});
	}

	appLoading():any {
		let noteList = new NoteList();
		let date = new DateComponent();
		let content = this.Model.get();
		this.modalControl();
		this.addSearchEvent(noteList);

		if (content.length === 0) {
			let item = new DefaultItem();
			return
		}

		content.map((elem:any) => {
			let item = new Note(elem, this.deleteNote.bind(this));
		});
	}

	addNote(elem: any): void {
		let root = document.getElementById('root');
		let defaultContainer:Element = document.querySelector('.default-text');
		if ( defaultContainer ) {
			root.removeChild(defaultContainer);
		}
		let item = new Note(elem, this.deleteNote.bind(this));
		this.Model.save(elem);
		this.layoutReload();
	}

	deleteNote(item: HTMLElement): void {
		let content: any[] = [];
		this.Model.del(item.getAttribute('key'));
		content = this.Model.get();
		if (content.length === 0) {
			let item = new DefaultItem();
		}
		this.layoutReload();
	}

	searchNote(noteList: any, value: string) :void {
		let allNotes:any[] = this.Model.get();
		let result = this.Model.sort(value);
		let list = noteList;
		noteList.clearNoteList();	
		if (value.length !== 0) {
			result.map((elem:any) => {
				let item = new Note(elem, this.deleteNote.bind(this));
			});
		} else {
			allNotes.map((elem:any) => {
				let item = new Note(elem, this.deleteNote.bind(this));
			});
		} 
		this.layoutReload();
	}

	addSearchEvent(noteList: any):void {
		let searchInput:HTMLElement = document.getElementById('search-input');
		searchInput.addEventListener('input', (e) => {
			let value = (<HTMLSelectElement>e.target).value;
			this.searchNote(noteList, value);
		});
	}

	layoutReload(): void {
		this.Masonry.reloadItems();
		this.Masonry.layout();
	}

	modalControl() {
		let openButton = document.getElementById('modal-open');
		let child = new AddNoteForm({ event: this.addNote.bind(this)});
		openButton.addEventListener('click', function(e) {
			let modal = new Modal(child.getTemplate());
			child.placeholderControl();
			child.focusFieldControl();
		});
	}
}