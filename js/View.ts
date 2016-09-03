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

	default(): any {
		let helper: any = function(type: string, props: any, children: any) {
			return { type: type, props: props, children: children }
		}
		const t = (helper('div', {className: 'default-text'}, ['Note list is empty']));
		return t
	}

	note(data: any, event:any): any {
		let self = this;
		let helper: any = function(type: string, props: any, children: any) {
			return { type: type, props: props, children: children }
		}
		const t = (
			helper('div', {className: 'note-grid', key: data.id}, [
				helper('div', {className: 'note'}, [
					helper('div', { className: 'note-close', onClick: (e:any) => { event(e.path[3]); } }, [
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

	addElement(parent:HTMLElement, template: any): void {
		let self = this;
		let newChild = self.template.createElement(template);
		self.template.render(parent, newChild);
		self.modal.className = 'modal';
	}

	deleteElement(parent:HTMLElement, item: HTMLElement): void {
		let self = this;
		parent.removeChild(item);
	}

	addEvent(event: string, handler: any): void {
		let self = this;
		if (event === 'addNote') {
			self.button.addEventListener('click', function() { 
				let inputTextValue = self.inputText.innerText;
				let inputTitleValue = self.inputTitle.innerText;

				if (inputTextValue.length !== 0 && inputTitleValue.length !== 0) {
					let phTitle:Element = document.querySelector('.input-text__title');
					let phText:Element = document.querySelector('.input-text__text');
					handler({
						id: Date.now(),
						title: inputTitleValue,
						text: inputTextValue
					});

					self.inputText.innerText = '';
					self.inputTitle.innerText = '';
					phTitle.setAttribute('style', '');
					phText.setAttribute('style', '');
				}
			});
			self.inputTitle.addEventListener('input', function(e) {
					let placeholder:Element = document.querySelector('.input-text__title');
					if (self.inputTitle.innerText.length !== 0 ) {
						placeholder.setAttribute('style', 'display: none');
					} else {
						placeholder.setAttribute('style', '');
					}
			});
			self.inputTitle.addEventListener('keydown', function(e) {
					if (e.key === 'Enter') {
						e.preventDefault();
						self.inputText.focus();
					}
			});
			self.inputText.addEventListener('input', function(e) {
					let placeholder:Element = document.querySelector('.input-text__text');
					if (self.inputText.innerText.length !== 0 ) {
						placeholder.setAttribute('style', 'display: none');
					} else {
						placeholder.setAttribute('style', '');
					}
			});

		} else if (event === 'modal-active') {
			let modalClass = self.modal.className;

			self.modalOpen.addEventListener('click', function() { 
				self.modal.className = modalClass + ' active';
			});

			self.modalClose.addEventListener('click', function() { 
				self.modal.className = modalClass;
			});
		} else if (event === 'search') {
			let searchInput:HTMLElement = document.getElementById('search-input');
			searchInput.addEventListener('input', function(e) {
				handler((<HTMLSelectElement>e.target).value);
			});
		}
	}
}