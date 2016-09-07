import {Controller} from './Controller';
import {Model} from './Model';
import {Store} from './store';
import {Template} from './template';
import {View} from './View';

class Keeper {
	store: any;
	model: any;
	template: any;
	view: any;
	controller: any;
	masonry: any;
	constructor() {
		this.store = new Store('note-app-store');
		this.model = new Model(this.store);
		this.template = new Template();
		this.view = new View(this.template);
		this.controller = new Controller(this.model, this.view);
	}
}
let KeeperApp = new Keeper();


