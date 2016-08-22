export class Store {
	name: string
	constructor(name: string) {
		this.name = name;
	}
	add(content:any): void {
		if ( localStorage.getItem(this.name) ) {
			let myStore = (<any>JSON).parse(localStorage.getItem(this.name));
			myStore.push(content);
			localStorage.setItem(this.name, (<any>JSON).stringify(myStore));
		} else {
			let myStore:any[] = [];
			myStore.push(content);
			localStorage.setItem(this.name, (<any>JSON).stringify(myStore));
		}
	}

	del(id:string): void {
		let myStore = (<any>JSON).parse(localStorage.getItem(this.name));
		let deletedId = id;
		let newStore = myStore.filter((item: any) => {
			return item.id !== deletedId
		});
		localStorage.setItem(this.name, (<any>JSON).stringify(newStore));
	}
	get(): any {
		let content = (<any>JSON).parse(localStorage.getItem(this.name));
		return content
	}
}