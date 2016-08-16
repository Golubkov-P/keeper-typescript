export class Controller {
	Model:any;
	View:any;
	emmitEvent:any;
	constructor(Model:any, View: any) {
		this.Model = Model;
		this.View = View;
		this.emmitEvent = (() => { this.View.addEvent('addNote', (item: any) => {
				this.createNote(item);
			});
		})();
	}

	createNote(item: any):any {
		let self = this;
		self.Model.save(item);
		self.View.addNote(item);
	}

}