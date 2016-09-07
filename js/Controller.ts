/// <reference path="masonry-layout.d.ts" />

import {DateComponent} from './components/date';
import {Note} from './components/note';
import {NoteList} from './components/note-list';
import {DefaultItem} from './components/default';

export class Controller {
	Model: any;
	View: any;
	Masonry: any;
	emmitEvent: any;
	default: any;
	constructor(Model:any, View: any) {
		let self = this;
		this.Model = Model;
		this.View = View;
		self.defaultLoad();
		this.Masonry = new Masonry('#root', {
			itemSelector: '.note-grid',
			columnWidth: '.note-sizing',
			percentPosition: true
		});
		self.layout();
		self.renderDate();
		self.View.addEvent('addNote', function(item:any) {
			self.createNote(item);
		});
		self.View.addEvent('modal-active');
		self.View.addEvent('search', function(value:string) {
			self.searchNote(value);
		});
	}

	defaultLoad(): any {
		let self = this;
		let app = document.getElementById('app');
		let noteList = new NoteList();
		let content: any[] = self.Model.get() || [];
		self.View.addElement(app, noteList.render());

		if (content.length === 0) {
			let defaultItem = new DefaultItem();
			let template = defaultItem.render();
			let parent = document.getElementById('root');

			self.View.addElement(parent, template);

			return
		}
		content.map(function(item) {
			let note = new Note();
			let template = note.render(item, self.deleteNote.bind(self));
			let parent = document.getElementById('root');

			self.View.addElement(parent, template);
		});
	}

	layout():void {
		let self = this;
		self.Masonry.reloadItems();
		self.Masonry.layout();
	}

	createNote(item: any): void {
		let self = this;
		let note = new Note();
		let template = note.render(item, self.deleteNote.bind(self));
		let root:HTMLElement = document.getElementById('root');
		let defaultContainer:Element = document.querySelector('.default-text');
		if (defaultContainer ) {
			root.removeChild(defaultContainer);
		}

		self.View.addElement(root, template);
		self.Model.save(item);

		self.Masonry.reloadItems();
		self.Masonry.layout();
	}

	deleteNote(item: HTMLElement): void {
		let self = this;
		let root:HTMLElement = document.getElementById('root');

		self.View.deleteElement(root, item);
		self.Model.del(item.getAttribute('key'));

		let content: any[] = self.Model.get();
		if (content.length === 0) {
			let defaultItem = new DefaultItem();
			let template = defaultItem.render();
			self.View.addElement(root, template);
		}

		self.Masonry.reloadItems();
		self.Masonry.layout();
	}

	hideNote(item: HTMLElement) {
		let self = this;
		let root:HTMLElement = document.getElementById('root');
		self.View.deleteElement(root, item);
	}

	searchNote(value: string) :void {
		let self = this;
		let root:HTMLElement = document.getElementById('root');
		let allNotes:any[] = self.Model.get();
		let result = self.Model.sort(value);
		let noteList = new NoteList();
		let note = new Note();

		noteList.clearNoteList(self.hideNote.bind(self));
		
		if (value.length !== 0) {
			result.map((item:any) => {
				let template = note.render(item, self.deleteNote.bind(self));
				self.View.addElement(root, template);
			});
		} else {
			allNotes.map((item:any) => {
				let template = note.render(item, self.deleteNote.bind(self));
				self.View.addElement(root, template);	
			});
		} 
		self.layout();
	}

	renderDate():void {
		let self = this;
		let root:HTMLElement = document.getElementById('date-container');
		let date = new DateComponent();
		let template = date.render();
		self.View.addElement(root, template);
	}
}