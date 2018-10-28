let server;

const http = require('http');
const fs = require('fs');
const path = require('path');

let usr = path.join(__dirname, 'usr');
let lib = path.join(usr, 'lib');
let med = path.join(usr, 'res');
let files = path.join(__dirname, 'files')

let tabmanager = require('./tabmanager.js')

let getContentType = function(file) {
	switch (file.split('.').pop()) {
		case 'html':
			return 'text/html';
		case 'css':
			return 'text/css';
		case 'js':
			return 'text/javascript';
		case 'json':
			return 'application/json';
		case 'svg':
			return 'image/svg+xml';
		case 'png':
			return 'image/png';
		case 'jpg':
			return 'image/mpeg';
		default:
			return 'text/plain';
	}
}

let coalescing = function (op1, op2) {
	if (Boolean(op1) == false && typeof op1 != "number")
		return op2;
	else 
		return op1;
}

let parse = function(path) {
	let tmp = path.split('?'),
		url = tmp[0],
		args,
		params;

	if (tmp[1]) {
		args = tmp[1].split('&');
		params = {}

		args.forEach(arg => {
			let split = arg.split('=')
			params[split[0]] = split[1]
		})
	}

	let retval = {
		url,
		params: params || {}
	}

	return retval;
}

server = http.createServer((req, res) => {
	if (req.method == "GET") {

		let request = parse(req.url);
		let params = request.params;
		let url = request.url;

		switch (url) {
			case '/':
				res.writeHead('200', {
					'Content-type': 'text/html'
				})
				res.write(fs.readFileSync(path.join(usr, "index.html")))
				break;
			case '/master.css':
				res.writeHead('200', {
					'Content-type': 'text/css'
				})
				res.write(fs.readFileSync(path.join(usr, "master.css")))
				break;
			case '/controller.js':
				res.writeHead('200', {
					'Content-type': 'text/javascript'
				})
				res.write(fs.readFileSync(path.join(usr, "controller.js")))
				break;

			case '/res':
				if (fs.existsSync(path.join(med, params.file))) {
					res.writeHead(200, {
						"content-type": getContentType(params.file)
					})
					res.write(fs.readFileSync(path.join(med, params.file)))
				} else {
					res.writeHead(404)
					res.write("The File Wasn't Found")
				}
				break;
			case '/file':
				if (fs.existsSync(path.join(files, params.file))) {
					res.writeHead(200, {
						"content-type": getContentType(params.file)
					})
					res.write(fs.readFileSync(path.join(files, params.file)))
				} else {
					res.writeHead(404)
					res.write("The File Wasn't Found")
				}
				break;
			case '/tabs':
				let result;
				let status = 200;
				try {
					// result = tabmanager(params) || {}
					result = coalescing(tabmanager(params), {});
				} catch (e) {
					status = 500;
					result = e;
					console.log(e);
				}

				res.writeHead(status, {
					"Content-type": "application/json"
				})
				res.write(JSON.stringify(result));
				break;
			default:
				res.writeHead(404)
				res.write("The File Wasn't Found")
		}

		res.end();
	}
})
module.exports = server;