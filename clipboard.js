const events = require('events');
const ioHook = require('iohook');
const OSClipboard = require('clipboardy');
const fileSystem = require('./file-system');
const { clipboardRefreshRate } = require('./config');
const { Events, Errors, Keys } = require('./constants');

let clipboardCache;

init();

function init() {
  fileSystem.checkFileSystem().then(() => {
    initClipboardCache();
    registerKeyboardEventListener();
    registerBufferUpdateEventListener();
    registerOSClipboardListener();
  });
}

function initClipboardCache() {
  OSClipboard.read().then((clipboard) => {
    clipboardCache = clipboard;
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
        if (clipboardCache !== clipboard) {
          writeToBuffer(clipboard);
        }
      });
    }

  });

  ioHook.start();
}

function registerBufferUpdateEventListener() {
  const eventEmitter = new events.EventEmitter();

  fileSystem.watchBufferChanges(eventEmitter);
  eventEmitter.on(Events.BUFFER_UPDATE, updateClipboardHandler);
}

function registerOSClipboardListener() {
  setInterval(synchronizeBufferHandler, clipboardRefreshRate);
}

function synchronizeBufferHandler() {
  OSClipboard.read().then((clipboard) => {
    if (clipboardCache !== clipboard) {
      writeToBuffer(clipboard);
    }
  }).catch(err => {
    if (err.code !== Errors.READ_RESTRICTED_ON_SLEEP_MODE) {
      console.error(err);
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