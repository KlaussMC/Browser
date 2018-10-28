async function get() {
	// let res = await fetch('/file?file=newtab.html');
	// let res = await fetch('/fake/url')

	function handleErrors(response) {
		if (!response.ok) {
			throw Error(response.statusText);
		}
		return response;
	}

	fetch("/fake/url")
		.then(handleErrors)
		.then(function(response) {
			console.log("ok");
		}).catch(function(error) {
			console.log(error);
		});
}