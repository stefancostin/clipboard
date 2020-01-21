const fs = require('fs');
/* packages */
const ioHook = require('iohook');
const OSClipboard = require('clipboardy');
/* utilities */
const { directoryPath, file } = require('./config');
const { keys } = require('./constants');

function startClipboardDaemon() {
  ioHook.on("keypress", event => {
    // console.log(event);

    if (event.ctrlKey && (
      event.rawcode === keys.linux.cKey || event.keycode === keys.windows.cKey)
    ) {
      console.log('\n CTRL + C \n');

      // write from operating system clipboard to buffer
      OSClipboard.read().then((clipboard) => {
        fs.writeFile(file, clipboard, (err) => {
          if (err) {
            console.error(err);
            return;
          }

          // read from file
          fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              // write to the operating system clipboard of listening node
              OSClipboard.writeSync(data);
            }
          });

        });
      });
    }

    if (event.ctrlKey && (
      event.rawcode === keys.linux.vKey || event.keycode === keys.windows.vKey)
    ) {
      console.log('\n CTRL + V \n');
    }

    // OSClipboard.writeSync('🦄');
    // OSClipboard.readSync();
  });

  ioHook.start();
}


// directory is accesible
fs.access(directoryPath, fs.F_OK, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  // is file accesible
  fs.access(file, fs.F_OK, (err) => {
    if (err) {

      // if file is not found, then create file
      fs.writeFile(file, '', (err) => {
        if (err) {
          console.error(err);
          console.warn('You do not have the admin rights to create and write to file')
          return;
        }
      });
    }

    // buffer file already exists
    console.log('buffer exists', file);
    startClipboardDaemon();
  });
});

/**
 * Restructuring
 */
// function isDirectoryAccesible() {
//   return new Promise((resolve, reject) => {
//     fs.access(directoryPath, fs.F_OK, (err) => {
//       if (err) {
//         console.error(err);
//         console.warn('Directory does not exist or directory is not accessible.');
//         reject();
//       }
//       resolve();
//     });
//   });
// }



// Run this as a daemon
// Libraries: daemonize2, Forever

