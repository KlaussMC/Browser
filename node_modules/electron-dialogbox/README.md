# electron-dialogbox

The module for creating simple customizable HTML dialog box for Electron base application.

## Getting Started

### Prerequisites

This module assumes that your project using Electron.

### Installing

You can install this module following command.

```
npm intall electron-dialogbox --save-dev
```

### Howto use

This is simple example for using this module.


* First, main process program.
```
const { app } = require('electron')
const eDialog = require('electron-dialogbox');

app.on('ready', async function() {
    let result = await eDialog.showDialog(
          'file:///'+__dirname+'/index.html', {width: 400, height: 300},
          'simple dialog diaplaying test.' );
    if (result==='OK') {
      // some procedures for 'OK' button clicked.
    } esle {
      // some procedures for 'CANCEL' button clicked.
    }
```

* second, displayed html.
```
<html>
  <head>
    <script>
      window.onload = function() {
        document.querySelector('#msg').innerHTML = dialog.argument;
      };
    </script>
  </head>
  <body>
    <h2>Simple message dialog example</h2>
    <p id="msg"></p>
    <button onclick="dialog.exit('ok')">OK</button>
    <button onclick="dialog.exit('cancel')">Cancel</button>
    <button onclick="dialog.fail('error')">Error</button>
  </body>
</html>
```

see [API Document](docs/api.md), for more detail of this functions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

