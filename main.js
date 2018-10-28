let win;

const server = require('./server');

const port = 65534

server.listen(port, err => {
	const {
		app,
		BrowserWindow,
		ipcMain
	} = require('electron');
	const startUrl = "http://localhost:" + String(port);

	app.on('ready', function() {
		win = new BrowserWindow({
			width: 720,
			height: 360,
			title: 'Browser',
			frame: false
		});
		win.setMenu(null);

		win.maximize();

		win.loadURL(startUrl);
		win.on('closed', () => {
			win = null;
		});

		win.on('resize', e => {
			win.webContents.send('resize', win.isMaximized());
		})

		win.webContents.send('resize', win.isMaximized());
		win.webContents.openDevTools();
	});

	app.on('window-all-closed', () => {
		app.quit();
		// console.log('close')
		server.close();
	});

	app.on('activate', () => {
		if (win === null) {
			app.emit('ready');
		}
	});

	ipcMain.on("fullscreen", (e, state) => {
		win.setFullScreen(state);

		// win.webContents.send('fullscreen_status', state);
	})

	ipcMain.on('minimise', e => win.minimize())
	ipcMain.on('restore', e => win.isMaximized() ? win.restore() : win.maximize())
	// ipcMain.on('maximise', e => win.maximize())
})