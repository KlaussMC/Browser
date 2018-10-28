class Tab {
	constructor(id, url) {
		this.id = id || TabManager.generateID();
		this.url = url || 'http://localhost:65534/file?file=newtab.html';
		this.title = ""
		this.favicon = [];
		this.content;
	}

	get_url() {
		return this.url;
	}

	set_url(url) {
		this.url = url;
	}

	get_title() {
		return this.title
	}

	set_title(title) {
		this.title = title;
	}

	get_content() {
		return this.content;
	}

	set_content(content) {
		this.content = content;
	}

	get_favicon() {
		return this.favicon;
	}

	set_favicon(favicon) {
		this.favicon = favicon;
	}
}

module.exports = Tab;