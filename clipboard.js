const events = require('events');
const ioHook = require('iohook');
const OSClipboard = require('clipboardy');
const fileSystem = require('./file-system');
const { clipboardRefreshRate } = require('./config');
const { Events, Keys } = require('./constants');

let clipboardCache;

init();

function init() {
  fileSystem.checkFileSystem().then(() => {
    registerKeyboardEventListener();
    registerBufferEventListener();
    registerOSClipboardListener();
  });
}

function initClipboardCache() {
  OSClipboard.read().then((clipboard) => {
    clipboardCache = clipboard
  });
}

function registerKeyboardEventListener() {
  ioHook.on(Events.KEYPRESS, event => {

    if (event.ctrlKey && (
      event.keycode === Keys.KEYCODE_C_KEY ||
      event.keycode === Keys.KEYCODE_X_KEY ||
      event.rawcode === Keys.RAWCODE_C_KEY_UPPER ||
      event.rawcode === Keys.RAWCODE_C_KEY_LOWER ||
      event.rawcode === Keys.RAWCODE_X_KEY_UPPER ||
      event.rawcode === Keys.RAWCODE_X_KEY_LOWER)
    ) {

      // write from operating system clipboard to buffer
      OSClipboard.read().then((clipboard) => {
        writeToBuffer(clipboard);
      });
    }

  });

  ioHook.start();
}

function registerBufferEventListener() {
  const eventEmitter = new events.EventEmitter();

  fileSystem.watchBufferChanges(eventEmitter);
  eventEmitter.on(Events.BUFFER_UPDATE, updateClipboardHandler);
}

function registerOSClipboardListener() {
  initClipboardCache();
  setInterval(synchronizeBufferHandler, clipboardRefreshRate);
}

function synchronizeBufferHandler() {
  OSClipboard.read().then((clipboard) => {
    if (clipboardCache !== clipboard) {
      writeToBuffer(clipboard);
    }
  });
}

function updateClipboardHandler() {
  fileSystem.readFromBuffer().then((buffer) => {
    writeToClipboard(buffer);
  });
}

function writeToBuffer(clipboard) {
  clipboardCache = clipboard;
  fileSystem.writeToBuffer(clipboard);
}

function writeToClipboard(buffer) {
  clipboardCache = buffer;
  OSClipboard.writeSync(buffer);
}