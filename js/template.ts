export class Template {
	constructor() {

	}

	setProp(elem: HTMLElement, name: string, prop: string): void {
		if (this.isCustomProp(name)) {
			return
		} else if (name === 'className') {
			elem.setAttribute('class', prop);
		} else {
			elem.setAttribute(name, prop);
		}
	}

	setProps(elem: HTMLElement, props: any): void {
		let self = this;
		Object.keys(props).forEach(function(name) {
    	self.setProp(elem, name, props[name]);
  	});
	}

	isEventProp(name:string): any {
    return /^on/.test(name)
	}

	isCustomProp(name:string):any {
		return this.isEventProp(name)
	}

	getEventName(prop: string): any {
		return prop.slice(2).toLowerCase()
	}

	addEvent(elem:HTMLElement, props: any): void {
		let self = this;
		Object.keys(props).forEach(function(name) {
			if (self.isEventProp(name)) {
				elem.addEventListener(self.getEventName(name), props[name]);
			}
		});
	}

	createElement(node: any): any {
		let self = this;
		if (typeof node === 'string') {
			return document.createTextNode(node)
		}
		let elem: HTMLElement = document.createElement(node.type);
		self.setProps(elem, node.props);
		self.addEvent(elem, node.props);
		node.children
		.map((item:any) => self.createElement(item))
		.forEach(function(item:any) {
			elem.appendChild(item);
		});

		return elem
	}

	render(parent:HTMLElement, newChild:HTMLElement): void {
		parent.insertBefore(newChild, parent.firstChild);
	}
}