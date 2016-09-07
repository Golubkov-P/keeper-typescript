export class Note {
	constructor() {

	}

	render(data:any, event:any):any {
		let helper: any = function(type: string, props: any, children: any) {
			return { type: type, props: props, children: children }
		};
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
}