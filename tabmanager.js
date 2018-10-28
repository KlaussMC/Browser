"use strict"
const http = require('http');
const url = require('url');
const Tab = require('./tab.js');

module.exports = params => {
	return TabManager.Parse(params)
}

class TabManager {

	static init() {
		this.tabs = []
		this.suspended = []
		this.activetab = "";
		this.activeindex = 0;

	}

	static generateID() {
		let id = ""

		do {
			for (let i = 0; i < Math.floor((Math.random() * 15) + 10); i++)
				id += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_" [Math.floor(Math.random() * 63)]
		} while (this.tabs.indexOf(id) > -1);

		return id;
	}

	static list() {
		return this.tabs;
	}

	static newtab(id) {
		id = id || this.generateID()
		this.tabs.push(new Tab(id, 'http://localhost:65534/file?file=newtab.html'))
		this.activetab = id;
		this.setActiveIndex()
	}

	static closetab(id) {
		this.tabs.splice(this.tabs.indexOf(id), 1);
	}

	static closecurrenttab() {
		this.tabs.splice(this.tabs.indexOf(this.activetab), 1);
	}

	static closeall() {
		this.tabs = [];
		this.activetab = ""
		// this.setActiveIndex();
		this.activeindex = 0;
	}

	static setActiveIndex() {
		let id = this.getactivetab().id;
		for (let i in this.tabs) {
			if (this.tabs[i].id == id) {
				this.activeindex = Number(i);
				break;
			}
		}
	}

	static switchcurrenttab(id) {
		id = Number(id) || id;

		if (typeof id == "string") {
			this.activetab = id;
			this.setActiveIndex();
		} else if (typeof id == "number") {
			this.activeindex += id;
			this.activeindex = loop(this.activeindex, 1, this.tabs.length)
			this.activetab = this.getactivetab().id;
			this.setActiveIndex();
		}
	}

	static getitem(item) {
		return this[item]
	}

	static settabtitle(title, id) {

		for (let t in this.tabs) {
			if (this.tabs[t].id == id || this.activetab) {
				this.tabs[t].set_title(decodeURI(title));
				break;
			}
		}
	}

	static settabicon(icon, id) {

		for (let t in this.tabs) {
			if (this.tabs[t].id == id || this.activetab) {
				this.tabs[t].set_favicon(decodeURI(JOSN.parse(title)));
				break;
			}
		}
	}

	static nav(url, id) {
		for (let t in this.tabs) {
			if (this.tabs[t].id == id || this.activetab) {
				this.tabs[t].set_url(url);
				break;
			}
		}
	}

	static getactivetab() {
		for (let t of this.tabs) {
			if (t.id == this.activetab) {
				return t;
			}
		}
		return null;
	}

	static gettab(id) {
		for (let t of this.tabs) {
			if (t.id == id) {
				return t;
			}
		}
		return null;
	}

	static Parse(params) {

		params.args = params.args || ""
		params.action = params.action.toLowerCase();

		if (!TabManager[params.action])
			return "function " + params.action + " doesn't exist";

		let output = {};

		return TabManager[params.action](...params.args.split(','))
	}

	static say(message) {
		return message;
	}

	static ping() {
		return "pong";
	}
}

TabManager.init();

let loop = (n, s, e) => (n < s) ? e - Math.abs(n % e) : n % e