export class View {
	template: any;
	notesBlock: HTMLElement;
	inputTitle: HTMLElement;
	inputText: HTMLElement;
	button: HTMLElement;
	modal: HTMLElement;
	modalOpen: HTMLElement;
	modalClose: HTMLElement;

	constructor(template:any) {
		this.template = template;
		this.notesBlock = document.getElementById('root');
		this.inputTitle = document.getElementById('note-input__title');
		this.inputText = document.getElementById('note-input__text');
		this.button = document.getElementById('add-button');
		this.modal = document.getElementById('modal');
		this.modalOpen = document.getElementById('modal-open');
		this.modalClose = document.getElementById('modal-close');
	}

	addNote(item:any): any {
			let self = this;
			let Note = document.createElement('div');

			Note.className = 'note-grid';
			Note.innerHTML = self.template.createNote(item);
			self.notesBlock.insertBefore(Note, self.notesBlock.firstChild);
	}

	deleteNote(item: HTMLElement):any {
		let self = this;
		let element = item.parentNode;
		self.notesBlock.removeChild(element);
	}

	addEvent(event: string, handler: any): any {
		let self = this;

		if (event === 'addNote') {
			let button = self.button;

			button.addEventListener('click', function() { 
				let inputTextValue = self.inputText.innerText;
				let inputTitleValue = self.inputTitle.innerText;

				if (inputTextValue !== '' && inputTitleValue !== '') {

					handler({
						id: Date.now(),
						title: inputTitleValue,
						text: inputTextValue
					});

					self.inputText.innerText = '';
					self.inputTitle.innerText = '';
				}

			});

		} else if (event === 'modal-active') {
			let modalClass = self.modal.className;

			self.modalOpen.addEventListener('click', function() { 
				let modal = self.modal;
				modal.className = modalClass + ' active';
			});

			self.modalClose.addEventListener('click', function() { 
				let modal = self.modal;
				modal.className = modalClass;
			});

		} else if (event === 'delete-note') {
			
		}
	}
}