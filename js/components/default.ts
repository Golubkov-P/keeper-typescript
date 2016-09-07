export class DefaultItem {
	constructor() {

	}

	render(): any {
		let helper: any = function(type: string, props: any, children: any) {
			return { type: type, props: props, children: children }
		}
		const t = (helper('div', {className: 'default-text'}, ['Note list is empty']));
		return t
	}
}