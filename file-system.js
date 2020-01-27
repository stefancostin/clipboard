const fs = require('fs');
const { buffer, bufferRefreshRate, directoryPath, fileName } = require('./config');
const { Events } = require('./constants');

function checkFileSystem() {
  return new Promise((resolve, reject) => {

    if (!directoryPath || !fileName) {
      console.error('You must provide a directory path and a file name for the buffer file.');
      reject();
    }

    // is directory accessible
    fs.access(directoryPath, fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        console.warn('Please make sure that the folder structure exists on the shared drive.\n' +
         'You can either create the folder structure on the shared drive ' + 
         'or choose to change the directory path in the config.js file.');
        reject();
      }

      // is file accesible
      fs.access(buffer, fs.F_OK, (err) => {
        if (err) {

          // if file is not found, then create file
          fs.writeFile(buffer, '', (err) => {
            if (err) {
              console.error(err);
              console.warn('You do not have the permissions to create or write to the file.');
              reject();
            }
          });
        }

        // buffer file is ready
        console.log('Clipboard has started listening for events.');
        resolve();
      });
    });
  });
}

function readFromBuffer() {
  return new Promise((resolve, reject) => {
    fs.readFile(buffer, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        resolve(data);
      }
    });
  });
}

function watchBufferChanges(eventEmitter) {
  fs.watchFile(buffer, { interval: bufferRefreshRate }, (curr, prev) => {
    eventEmitter.emit(Events.BUFFER_UPDATE);
  });
}

function writeToBuffer(clipboard) {
  fs.writeFile(buffer, clipboard, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = { checkFileSystem, watchBufferChanges, readFromBuffer, writeToBuffer };