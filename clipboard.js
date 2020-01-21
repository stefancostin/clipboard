// imports
const ioHook = require('iohook');
const OSClipboard = require('clipboardy');
const fileSystem = require('./file-system');
const { Keys, HostState } = require('./constants');

// process state
const currentNode = HostState.READ;


fileSystem.checkFileSystem().then(
  initClipboardProcess()
);

function initClipboardProcess() {
  ioHook.on("keypress", event => {

    if (event.ctrlKey &&
      (event.rawcode === Keys.LINUX_C_KEY || event.keycode === Keys.WIN_C_KEY)
    ) {
      console.log('\n CTRL + C \n');

      // write from operating system clipboard to buffer
      OSClipboard.read().then((clipboard) => {
        fileSystem.writeToBuffer(clipboard);
      });
    }

    fileSystem.watchForBufferChanges();

    // OSClipboard.writeSync('🦄');
    // OSClipboard.readSync();
  });

  ioHook.start();
}




/**
 * CHANGE THIS FOR THE WRITING NODE TO BE
 * LISTENING FOR FILE CHANGES AND THEN UPDATE
 */
// read from file
// fs.readFile(buffer, { encoding: 'utf-8' }, (err, data) => {
//   if (err) {
//     console.error(err);
//   } else {
//     // data = 'dadada';
//     // write to the operating system clipboard of listening node
//     OSClipboard.writeSync(data);
//   }
// });

// Run this as a daemon
// Libraries: daemonize2, Forever

