const fs = require('fs');
const { directoryPath, fileName, buffer } = require('./config');

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
        resolve();
      });
    });
  });
}

function watchForBufferChanges() {
  fs.watchFile(buffer, (current, previous) => {
    console.log(`${buffer} file Changed`);
    console.log('current', current)
    console.log('previous', previous)
  });
}

function writeToBuffer(clipboardContent) {
  fs.writeFile(buffer, clipboardContent, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

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

module.exports = { checkFileSystem, watchForBufferChanges, writeToBuffer };