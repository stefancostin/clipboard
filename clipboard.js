const ioHook = require('iohook');
const OSClipboard = require('clipboardy');

ioHook.on("keypress", event => {
  console.log(event);
  // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}

  OSClipboard.writeSync('🦄');
  OSClipboard.readSync();
});

ioHook.start();

// Run this as a daemon
// Libraries: daemonize2, Forever

