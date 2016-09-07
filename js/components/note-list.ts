export class NoteList {
	constructor() {
		
	}

	clearNoteList(event:any):any {
		let root:HTMLElement = document.getElementById('root');
		let childs = root.childNodes;
		let ch = Array.prototype.slice.call(childs);
		ch.map(function(elem:HTMLElement) {
			if( elem.getAttribute('class') === 'note-grid') {
  			event(elem);
  		}
		});
	}

	render():any {
		let helper: any = function(type: string, props: any, children: any) {
			return { type: type, props: props, children: children }
		};
		const t = (
			helper('div', {id: 'root'}, [
				helper('div', {className: 'note-sizing'}, [''])
			])
		);
		return t
	}
}