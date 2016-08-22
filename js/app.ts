/// <reference path="masonry-layout.d.ts" />

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
		this.masonry = new Masonry('#root', {
			itemSelector: '.note-grid',
			columnWidth: '.note-sizing',
			percentPosition: true
		});
		this.controller = new Controller(this.model, this.view, this.masonry);
	}
}

let KeeperApp = new Keeper();


