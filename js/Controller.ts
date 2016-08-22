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
		self.View.addEvent('delete-note', function(item:HTMLElement) {
			self.deleteNote(item);
		});
	}

	defaultLoad(): any {
		let self = this;
		var content: any[] = self.Model.get();
		if (content == undefined) {
			return
		}
		content.map(function(item) {
			self.View.addNote(item);
		});
		self.Masonry.reloadItems();
		self.Masonry.layout();
	}

	createNote(item: any): void {
		let self = this;
		self.Model.save(item);
		self.View.addNote(item);
		self.Masonry.reloadItems();
		self.Masonry.layout();
	}

	deleteNote(item: HTMLElement): any {
		let self = this;
		self.Model.del(item.getAttribute('data-id'));
		self.View.deleteNote(item.parentNode);
		self.Masonry.reloadItems();
		self.Masonry.layout();
	}

}