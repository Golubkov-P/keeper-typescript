export class View {
	template: any;
	notesBlock: HTMLElement;
	inputTitle: HTMLElement;
	inputText: HTMLElement;
	button: HTMLElement;

	constructor(template:any) {
		this.template = template;
		this.notesBlock = document.getElementById('root');
		this.inputTitle = document.getElementById('note-input__title');
		this.inputText = document.getElementById('note-input__text');
		this.button = document.getElementById('add-button');
	}

	addNote(item:any): any {
			let self = this;
			let data = item;
			let tmpl = self.template;
			let Note = document.createElement('div');
			let notesBlock = self.notesBlock;

			Note.innerHTML = tmpl.createNote(data);
			notesBlock.appendChild(Note);
	}

	addEvent(event: string, handler: any): any {
		let self = this;
		if (event === 'addNote') {
			let button = self.button;
			button.addEventListener('click', function() { 
				let inputTextValue = (<HTMLInputElement>self.inputText).value;
				let inputTitleValue = (<HTMLInputElement>self.inputTitle).value;
				handler({
					id: Date.now(),
					title: inputTitleValue,
					text: inputTextValue
				});
			});
		}
	}
}