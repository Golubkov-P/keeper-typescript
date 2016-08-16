export class Store {
	name: string
	constructor(name: string) {
		this.name = name;
	}
	add(content:any) {
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

	del(content:any) {
		let myStore = (<any>JSON).parse(localStorage.getItem(this.name));
		let deletedItem = content;
		let newStore = myStore.filter((item: any) => {
			return item.id !== deletedItem.id
		});
		localStorage.setItem(this.name, (<any>JSON).stringify(newStore));
	}
}