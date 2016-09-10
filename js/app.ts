import {Controller} from './Controller';
import {Model} from './Model';


class Keeper {
	store: any;
	model: any;
	template: any;
	view: any;
	controller: any;
	masonry: any;
	constructor() {
		this.model = new Model();
		this.controller = new Controller(this.model);
	}
}
let KeeperApp = new Keeper();


