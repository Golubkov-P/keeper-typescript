export class Template {
	noteTemplate: string;
	constructor() {
		this.noteTemplate = '<div class="note" data-id="{{id}}">' 
		+											'<div class="note__title">'
		+												 '{{title}}'
		+											'</div>'
		+											'<div class="note__text">'
		+												 '{{text}}'
		+											'</div>'
		+										'</div>';
	}

	createNote(data: any): any {
		let template = this.noteTemplate;
		console.log(data);
		
		template = template.replace("{{id}}", data.id);
		template = template.replace("{{title}}", data.title);
		template = template.replace("{{text}}", data.text);
		console.log(template);

		return template
	}
}