let loaded = async () => {

	window.vars = {}

	await fetch('/tabs?action=closeall')

	await newtab(true);
	await setwebview()

	window.vars.urlbar = document.querySelector('.url');

	document.querySelector('.reload').addEventListener('click', e => window.vars.webView.reload());
	document.querySelector('.back').addEventListener('click', e => window.vars.webView.goBack());
	document.querySelector('.forward').addEventListener('click', e => window.vars.webView.goForward());

	document.querySelector('.search').addEventListener('click', navigate)

	window.vars.urlbar.addEventListener('change', navigate)

	// window.vars.webView.addEventListener('did-navigate', url => {
	// 	nav(url.url)
	// })

	// window.vars.webView.addEventListener('will-navigate', e => window.vars.urlbar.style.background = "#ff4045");
	// window.vars.webView.addEventListener('did-stop-loading', e => window.vars.urlbar.style.background = "#ddd");

	// window.vars.webView.addEventListener('did-fail-loading', e => window.vars.webView.loadURL('http://localhost:65534/file?file=newtab.html'));

}

let setwebview = async () => {

	window.vars.urlbar = document.querySelector('.url');

	let res = await fetch('/tabs?action=getitem&args=activeindex')
	res = await res.json()

	document.querySelector('.active_view').removeAttribute("class")
	window.vars.webView = document.querySelectorAll('webview')[Number(res)]
	window.vars.webView.setAttribute('class', "active_view");

	window.vars.webView.addEventListener('did-navigate', async url => {
		nav(await fetch('/tabs?action=getactivetab').url)
	})

	window.vars.webView.addEventListener('will-navigate', e => window.vars.urlbar.style.background = "#ff4045");
	window.vars.webView.addEventListener('did-stop-loading', e => window.vars.urlbar.style.background = "#ddd");

	window.vars.webView.addEventListener('did-fail-loading', e => window.vars.webView.loadURL('http://localhost:65534/file?file=err.html'));

	window.vars.webView.addEventListener('enter-html-full-screen', e => {
		let status = JSON.parse(window.localStorage.bugMessages)
		if (!status["fullscreen"]) {
			alert('A known bug has been encountered. The bug dissalows the browser from entering a complete fullscreen. This can be partly fixed, however any attempt at doing this result in a white bar at the bottom of the screen and an incomplete scale. If you wish to help, please do. https://github.com/KlaussMC/Browser')
			status['fullscreen'] = true;
			window.localStorage.bugMessages = JSON.stringify(status);
		}
	})

	window.vars.webView.addEventListener('page-title-updated', async title => {
		await fetch('/tabs?action=settabtitle&args=' + title.title);
		let res = await fetch('/tabs?action=getitem&args=activeindex');
		res = await res.json();

		document.querySelectorAll('.tab')[res].querySelector('.title').innerHTML = title.title;
	})

	window.vars.webView.addEventListener('page-favicon-updated', async e => {
		await fetch('/tabs?action=setpageicon&args=' + encodeURI(JSON.stringify(e.favicons)));

		let res = await fetch('/tabs?action=getitem&args=activeindex');
		res = await res.json();

		let exists = await fetch(e.favicons[0]).catch(tmp => exists = false);

		document.querySelectorAll('.tab')[res].querySelector('.favicon').src = exists ? e.favicons[0] : await fetch('/file?file=imgerr.png');
	})

	await updateUI();

}

let updateUI = async () => {

	try {
		let res = await fetch('/tabs?action=getactivetab')
		res = await res.json()
		window.vars.urlbar.value = res.url.indexOf('http://localhost:65534') > -1 ? '' : res.url;

	} catch (e) {
		throw e;
	}

}

let nav = async url => {
	await fetch('/tabs?action=nav&args=' + encodeURI(url))
	await updateUI();
}

let neatenURL = url => {

	let tokens = url.split(/(?=\/|\.)/);

	if (/https?;\//.test(tokens[0] + tokens[1]))
		url = "http://" + url;

	if (tokens.length == 1) url = `https://www.google.com/search?q=${url}`;
	else if (!/https?:\//.test(tokens[0] + tokens[1]))
		url = "http://" + url
	else
		url = url;
	// console.log(url)

	return url
}

let navigate = function(e) {
	let neatened = neatenURL(this.value);
	if (neatened) window.vars.urlbar.style.background = "#ff4045"
	window.vars.webView.loadURL(neatened)
	nav(neatened);
}

let newtab = async donotsetview => {
	if (typeof donotsetview != "boolean") return;

	await fetch('/tabs?action=newtab')
	let res = await fetch('/tabs?action=getactivetab')
	res = await res.json();

	try {
		document.querySelector('.active').setAttribute('class', 'tab');
	} catch (e) {
		null;
	}

	let tabDisplayer = document.querySelector('.tab-displayer');

	let newtabbtn = document.querySelector('.new-tab-btn-wrapper');
	document.querySelector('.new-tab-btn-wrapper').outerHTML = ""

	// console.log(res.id);

	tabDisplayer.innerHTML += `<div class="tab active" name="${res.id}"><img class="favicon" /><span class="title">New Tab</span></div>`;
	tabDisplayer.innerHTML += newtabbtn.outerHTML;

	document.querySelector('.new-tab-btn-wrapper').addEventListener('click', e => {
		newtab(false)
	});

	[...document.querySelectorAll(".tab")].forEach(t => t.addEventListener('click', function(e) {
		switchTab(this)
	}))

	try {
		document.querySelector('.active_view').removeAttribute('class');
	} catch (e) {
		null;
	}
	document.querySelector(".content").innerHTML += `<webview src="/file?file=newtab.html" autosize="on" class="active_view" id="${res.id}"></webview>`;

	if (!donotsetview)
		setwebview();

}

let switchTab = async tab => {
	let id = tab.getAttribute('name')
	// console.log(id);
	await fetch('/tabs?action=switchcurrenttab&args=' + id)

	document.querySelector('.active').setAttribute('class', 'tab');
	tab.setAttribute('class', 'tab active');

	setwebview();

}