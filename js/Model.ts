import {Store} from './date/store';

export class Model {
	Store:any;
	constructor() {
		this.Store = new Store('note-app-store');
	}
	save(content: any): void {
		this.Store.add(content);
	}
	del(id: string): void {
		this.Store.del(id);
	}
	get():any {
		return this.Store.get();
	}
	sort(value:string) {
		return this.Store.sort(value);
	}
}