const BUFFER_REFRESH_RATE = 1000;    // miliseconds
const CLIPBOARD_REFRESH_RATE = 2000; // miliseconds

const DIR_PATH = 'Y:\\Redirected_Profile\\';
const FILE_NAME = 'clipboard-buffer.txt';

module.exports = Object.freeze({ 
    buffer: `${DIR_PATH}${FILE_NAME}`,
    directoryPath: DIR_PATH, 
    fileName: FILE_NAME,
    bufferRefreshRate: BUFFER_REFRESH_RATE,
    clipboardRefreshRate: CLIPBOARD_REFRESH_RATE
});