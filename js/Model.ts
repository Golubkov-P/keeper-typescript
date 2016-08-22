export class Model {
	Store:any;
	constructor(Store:any) {
		this.Store = Store;
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
}