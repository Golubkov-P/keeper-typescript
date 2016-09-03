export class Controller {
	Model: any;
	View: any;
	Masonry: any;
	emmitEvent: any;
	default: any;
	constructor(Model:any, View: any, Masonry: any) {
		let self = this;
		this.Model = Model;
		this.View = View;
		this.Masonry = Masonry;
		self.defaultLoad();
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
		var content: any[] = self.Model.get() || [];
		if (content.length === 0) {
			let template = self.View.default();
			let parent = document.getElementById('root');
			self.View.addElement(parent, template);
			return
		}
		content.map(function(item) {
			let template = self.View.note(item, self.deleteNote.bind(self));
			let parent = document.getElementById('root');
			self.View.addElement(parent, template);
		});
		self.Masonry.reloadItems();
		self.Masonry.layout();
	}

	createNote(item: any): void {
		let self = this;
		
		let template = self.View.note(item, self.deleteNote.bind(self));
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
			let template = self.View.default();
			self.View.addElement(root, template);
		}

		self.Masonry.reloadItems();
		self.Masonry.layout();
	}

	searchNote(value: string) :void {
		let self = this;
		let root:HTMLElement = document.getElementById('root');
		let allNotes:any[] = self.Model.get();
		let result = self.Model.sort(value);
		if (value.length !== 0) {
			result.map((item:any) => {
				let template = self.View.note(item, self.deleteNote.bind(self));
				self.View.addElement(root, template);
			});
		} else {
			allNotes.map((item:any) => {
				let template = self.View.note(item, self.deleteNote.bind(self));
				self.View.addElement(root, template);	
			});
		} 
	}
}