const events = require('events');
const ioHook = require('iohook');
const OSClipboard = require('clipboardy');
const fileSystem = require('./file-system');
const { Events, Keys } = require('./constants');

init();

function init() {
  fileSystem.checkFileSystem().then(() => {
    startClipboard();
    registerEventListener();
  });
}

function startClipboard() {
  ioHook.on(Events.KEYPRESS, event => {

    if (event.ctrlKey && (
      event.keycode === Keys.WIN_C_KEY ||
      event.keycode === Keys.WIN_X_KEY ||
      event.rawcode === Keys.LINUX_C_KEY_UPPER ||
      event.rawcode === Keys.LINUX_C_KEY_LOWER ||
      event.rawcode === Keys.LINUX_X_KEY_UPPER ||
      event.rawcode === Keys.LINUX_X_KEY_LOWER)
    ) {

      // write from operating system clipboard to buffer
      OSClipboard.read().then((clipboard) => {
        fileSystem.writeToBuffer(clipboard);
      });
    }

  });

  ioHook.start();
}

function registerEventListener() {
  const eventEmitter = new events.EventEmitter();

  fileSystem.watchBufferChanges(eventEmitter);
  eventEmitter.on(Events.BUFFER_UPDATE, updateClipboardHandler);
}

function updateClipboardHandler() {
  fileSystem.readFromBuffer().then((buffer) => {
    OSClipboard.writeSync(buffer);
  });
}
