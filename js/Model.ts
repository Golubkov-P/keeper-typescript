export class Model {
	Store:any;
	constructor(Store:any) {
		this.Store = Store;
	}
	save(content: any): void {
		this.Store.add(content);
	}
	remove(content: any): void {
		this.Store.del(content);
	}
}